import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai'
import { openai } from '@ai-sdk/openai'

export const maxDuration = 30

type InterviewProfile = {
  name?: string
  company?: string
  phone?: string
  companyAddress?: string
  email?: string
  aboutMe?: string
}

type SchedulePayload = {
  type: 'interview' | 'quickCall'
  date: string
  time: string
} | null

export async function POST(request: Request) {
  const {
    messages,
    locale,
    profile,
    schedule,
  }: {
    messages: UIMessage[]
    locale: 'en' | 'vi'
    profile?: InterviewProfile
    schedule?: SchedulePayload
  } = await request.json()

  const lastUserText = [...messages]
    .reverse()
    .find(message => message.role === 'user')
    ?.parts.find(part => part.type === 'text')

  const systemPrompt =
    locale === 'vi'
      ? `Bạn là trợ lý song ngữ cho widget tuyển dụng trên CV cá nhân. Hãy trả lời ngắn gọn, lịch sự, rõ ràng bằng tiếng Việt. Hỗ trợ ba việc: giới thiệu ứng viên, trả lời câu hỏi thêm về hồ sơ, và xác nhận kế hoạch liên hệ tuyển dụng như lời mời phỏng vấn hoặc cuộc gọi sàng lọc. Thông tin ứng viên hiện tại: tên ${profile?.name || 'chưa có'}, công ty ${profile?.company || 'chưa có'}, số điện thoại ${profile?.phone || 'chưa có'}, địa chỉ công ty ${profile?.companyAddress || 'chưa có'}, email ${profile?.email || 'chưa có'}, giới thiệu ${profile?.aboutMe || 'chưa có'}. Kế hoạch liên hệ đã chọn: ${schedule ? `${schedule.type === 'interview' ? 'lời mời phỏng vấn' : 'cuộc gọi sàng lọc'} vào ${schedule.date} lúc ${schedule.time}` : 'chưa chọn'}. Không nói rằng bạn đã gửi email hay tạo lịch thật. Hãy nhắc đây là bản nháp có thể kết nối API sau.`
      : `You are a bilingual recruiter assistant for a personal CV widget. Reply briefly, warmly, and clearly in English. Help with three things: introducing the candidate, answering follow-up questions about the profile, and confirming recruiter outreach plans such as an interview invitation or screening call. Current profile data: name ${profile?.name || 'missing'}, company ${profile?.company || 'missing'}, phone ${profile?.phone || 'missing'}, company address ${profile?.companyAddress || 'missing'}, email ${profile?.email || 'missing'}, about me ${profile?.aboutMe || 'missing'}. Selected outreach plan: ${schedule ? `${schedule.type === 'interview' ? 'interview outreach' : 'screening call'} on ${schedule.date} at ${schedule.time}` : 'none selected'}. Do not claim that real email or calendar automation has already happened; frame it as a draft recruiter workflow that can be connected later.`

  const apiKey = process.env.OPENAI_API_KEY

  if (apiKey) {
    const result = streamText({
      model: openai('gpt-4.1-mini'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  }

  const fallbackText = buildFallbackReply(
    locale,
    lastUserText?.text || '',
    profile,
    schedule || null,
  )

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'text-start', id: 'fallback-reply' })
        writer.write({
          type: 'text-delta',
          id: 'fallback-reply',
          delta: fallbackText,
        })
        writer.write({ type: 'text-end', id: 'fallback-reply' })
      },
    }),
  })
}

function buildFallbackReply(
  locale: 'en' | 'vi',
  input: string,
  profile?: InterviewProfile,
  schedule?: SchedulePayload,
) {
  const normalizedInput = input.toLowerCase()
  const candidateName =
    profile?.name || (locale === 'vi' ? 'ứng viên' : 'the candidate')

  if (schedule) {
    return locale === 'vi'
      ? `Đã ghi nhận kế hoạch liên hệ ${schedule.type === 'interview' ? 'mời phỏng vấn' : 'gọi sàng lọc'} cho ${candidateName} vào ${schedule.date} lúc ${schedule.time}. Đây là lịch tạm trong widget; khi bạn thêm calendar API và email API sau, mình có thể dùng đúng luồng này để xác nhận tự động.`
      : `I noted the ${schedule.type === 'interview' ? 'interview outreach' : 'screening call'} plan for ${candidateName} on ${schedule.date} at ${schedule.time}. This is currently a draft schedule inside the widget; once you connect calendar and email APIs later, the same flow can send real confirmations.`
  }

  if (
    normalizedInput.includes('about') ||
    normalizedInput.includes('introduce') ||
    normalizedInput.includes('giới thiệu')
  ) {
    return locale === 'vi'
      ? `${candidateName} hiện đến từ ${profile?.company || 'một đơn vị đang cập nhật'}, có thể liên hệ qua ${profile?.email || 'email chưa được điền'}. Phần giới thiệu hiện tại là: ${profile?.aboutMe || 'chưa có nội dung giới thiệu nào được lưu.'}`
      : `${candidateName} is currently associated with ${profile?.company || 'an organization still being filled in'} and can be reached at ${profile?.email || 'an email that has not been entered yet'}. The saved introduction currently says: ${profile?.aboutMe || 'there is no saved introduction yet.'}`
  }

  return locale === 'vi'
    ? `Mình đã nhận câu hỏi của bạn: “${input || '...'}”. Bản demo này đang chạy ở chế độ an toàn nên chưa gửi email hay đặt lịch thật, nhưng bạn vẫn có thể lưu thông tin tuyển dụng, chọn ngày giờ mong muốn và dùng widget này để chuẩn bị nội dung liên hệ tuyển dụng song ngữ.`
    : `I received your question: “${input || '...'}”. This demo is running in a safe placeholder mode, so it does not send real emails or book real calendar events yet, but you can already save recruiter details, pick a preferred date and time, and use the widget to prepare bilingual recruiter outreach.`
}

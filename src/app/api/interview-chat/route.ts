import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const maxDuration = 30

const getOpenAIModel = (apiKey: string) =>
  createOpenAI({
    baseURL: 'https://aiproxy.moreshared.com/v1',
    apiKey,
  })('gpt-5.2')

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

type ChatLanguage = 'en' | 'vi'

function getMessageText(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text.trim())
    .filter(Boolean)
    .join('\n')
}

function buildConversationPrompt(messages: UIMessage[]) {
  const transcript = messages
    .map(message => {
      const text = getMessageText(message)

      if (!text) {
        return null
      }

      const speaker = message.role === 'assistant' ? 'Assistant' : 'Recruiter'

      return `[${speaker}]\n${text}`
    })
    .filter((entry): entry is string => Boolean(entry))
    .join('\n\n')

  if (!transcript) {
    return ''
  }

  return [
    'Conversation transcript:',
    transcript,
    'Respond as the assistant to the latest recruiter message only. Keep the answer concise, warm, and actionable.',
  ].join('\n\n')
}

function detectMessageLanguage(
  input: string | undefined,
  fallbackLocale: ChatLanguage,
): ChatLanguage {
  const text = input?.trim()

  if (!text) {
    return fallbackLocale
  }

  const normalizedText = text.toLowerCase()

  const hasVietnameseDiacritics =
    /[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(
      text,
    )

  const vietnameseSignalCount = [
    /\b(và|là|của|cho|với|không|mình|bạn|giúp|hãy|tôi|gì|nào|được|trong|cần|muốn|phỏng vấn|tiếng việt)\b/gi,
  ].reduce(
    (count, pattern) => count + (normalizedText.match(pattern)?.length || 0),
    0,
  )

  const englishSignalCount = [
    /\b(the|and|for|with|please|can|could|would|should|help|interview|english|reply|what|how|why)\b/gi,
  ].reduce(
    (count, pattern) => count + (normalizedText.match(pattern)?.length || 0),
    0,
  )

  if (hasVietnameseDiacritics || vietnameseSignalCount > englishSignalCount) {
    return 'vi'
  }

  if (englishSignalCount > vietnameseSignalCount) {
    return 'en'
  }

  return fallbackLocale
}

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

  const responseLanguage = detectMessageLanguage(lastUserText?.text, locale)

  const systemPrompt =
    responseLanguage === 'vi'
      ? `Bạn là trợ lý song ngữ cho widget tuyển dụng trên CV cá nhân. Hãy trả lời ngắn gọn, lịch sự, rõ ràng bằng tiếng Việt. Hỗ trợ ba việc: tóm tắt hoặc diễn giải hồ sơ ứng viên đang hiển thị trên CV, trả lời câu hỏi thêm của nhà tuyển dụng về mức độ phù hợp, và xác nhận kế hoạch liên hệ tuyển dụng như lời mời phỏng vấn hoặc cuộc gọi sàng lọc. QUAN TRỌNG: dữ liệu profile được gửi kèm là ngữ cảnh của nhà tuyển dụng/công ty, không phải thông tin nhận diện của ứng viên. Ngữ cảnh nhà tuyển dụng/công ty hiện tại: tên người tuyển dụng ${profile?.name || 'chưa có'}, công ty ${profile?.company || 'chưa có'}, số điện thoại ${profile?.phone || 'chưa có'}, địa chỉ công ty ${profile?.companyAddress || 'chưa có'}, email công việc ${profile?.email || 'chưa có'}, vai trò hoặc bối cảnh tuyển dụng ${profile?.aboutMe || 'chưa có'}. Kế hoạch liên hệ đã chọn: ${schedule ? `${schedule.type === 'interview' ? 'lời mời phỏng vấn' : 'cuộc gọi sàng lọc'} vào ${schedule.date} lúc ${schedule.time}` : 'chưa chọn'}. Không được nói các thông tin tuyển dụng này là tên, công ty, email hay phần giới thiệu của ứng viên. Không nói rằng bạn đã gửi email hay tạo lịch thật. Hãy nhắc đây là bản nháp có thể kết nối API sau.`
      : `You are a bilingual recruiter assistant for a personal CV widget. Reply briefly, warmly, and clearly in English. Help with three things: summarizing or clarifying the candidate information shown on the CV, answering recruiter follow-up questions about fit, and confirming recruiter outreach plans such as an interview invitation or screening call. IMPORTANT: the attached profile data is recruiter/company context, not the candidate's identity. Current recruiter/company context: recruiter name ${profile?.name || 'missing'}, company ${profile?.company || 'missing'}, phone ${profile?.phone || 'missing'}, company address ${profile?.companyAddress || 'missing'}, work email ${profile?.email || 'missing'}, role or hiring context ${profile?.aboutMe || 'missing'}. Selected outreach plan: ${schedule ? `${schedule.type === 'interview' ? 'interview outreach' : 'screening call'} on ${schedule.date} at ${schedule.time}` : 'none selected'}. Do not describe those recruiter details as the candidate's name, company, email, or bio. Do not claim that real email or calendar automation has already happened; frame it as a draft recruiter workflow that can be connected later.`

  const apiKey = process.env.AI_API_KEY
  const conversationPrompt = buildConversationPrompt(messages)

  if (apiKey) {
    try {
      const result = streamText({
        model: getOpenAIModel(apiKey),
        providerOptions: {
          openai: {
            store: true,
          },
        },
        system: systemPrompt,
        prompt: conversationPrompt,
      })

      return result.toUIMessageStreamResponse()
    } catch {
      const failureText =
        responseLanguage === 'vi'
          ? 'Mình không thể lấy phản hồi lúc này. Vui lòng thử lại sau.'
          : 'I could not respond right now. Please try again in a moment.'

      return createUIMessageStreamResponse({
        stream: createUIMessageStream({
          execute: ({ writer }) => {
            writer.write({ type: 'text-start', id: 'ai-error-reply' })
            writer.write({
              type: 'text-delta',
              id: 'ai-error-reply',
              delta: failureText,
            })
            writer.write({ type: 'text-end', id: 'ai-error-reply' })
          },
        }),
      })
    }
  }

  const fallbackText = buildFallbackReply(
    responseLanguage,
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
  const candidateLabel = locale === 'vi' ? 'ứng viên' : 'the candidate'
  const recruiterName = profile?.name?.trim()
  const recruiterCompany = profile?.company?.trim()
  const recruiterEmail = profile?.email?.trim()
  const recruiterContext = profile?.aboutMe?.trim()

  if (schedule) {
    return locale === 'vi'
      ? `Đã ghi nhận kế hoạch liên hệ ${schedule.type === 'interview' ? 'mời phỏng vấn' : 'gọi sàng lọc'} dành cho ${candidateLabel} vào ${schedule.date} lúc ${schedule.time}. Đây hiện là lịch nháp trong widget cho phía tuyển dụng${recruiterName ? ` của ${recruiterName}` : ''}${recruiterCompany ? ` từ ${recruiterCompany}` : ''}; khi bạn thêm calendar API và email API sau, cùng luồng này có thể dùng để xác nhận tự động.`
      : `I noted the ${schedule.type === 'interview' ? 'interview outreach' : 'screening call'} plan for ${candidateLabel} on ${schedule.date} at ${schedule.time}. This is currently a draft schedule inside the widget for the recruiter side${recruiterName ? ` (${recruiterName}` : ''}${recruiterCompany ? `${recruiterName ? ', ' : ' ('}${recruiterCompany}` : ''}${recruiterName || recruiterCompany ? ')' : ''}; once you connect calendar and email APIs later, the same flow can send real confirmations.`
  }

  if (
    normalizedInput.includes('about') ||
    normalizedInput.includes('introduce') ||
    normalizedInput.includes('giới thiệu')
  ) {
    return locale === 'vi'
      ? `Mình có thể hỗ trợ tóm tắt ${candidateLabel} dựa trên nội dung CV đang hiển thị, nhưng các trường bạn vừa điền là ngữ cảnh của nhà tuyển dụng/công ty chứ không phải dữ liệu nhận diện của ứng viên. Hiện ngữ cảnh đã lưu${recruiterName ? `: người tuyển dụng ${recruiterName}` : ''}${recruiterCompany ? `${recruiterName ? ', ' : ': '}công ty ${recruiterCompany}` : ''}${recruiterEmail ? `${recruiterName || recruiterCompany ? ', ' : ': '}email ${recruiterEmail}` : ''}${recruiterContext ? `${recruiterName || recruiterCompany || recruiterEmail ? '. ' : ': '}Bối cảnh tuyển dụng: ${recruiterContext}` : '.'}`
      : `I can help summarize ${candidateLabel} from the CV content shown on the page, but the fields you saved are recruiter/company context rather than the candidate's identity. The saved recruiter context${recruiterName ? ` includes recruiter name ${recruiterName}` : ''}${recruiterCompany ? `${recruiterName ? ', ' : ' includes '}company ${recruiterCompany}` : ''}${recruiterEmail ? `${recruiterName || recruiterCompany ? ', ' : ' includes '}email ${recruiterEmail}` : ''}${recruiterContext ? `${recruiterName || recruiterCompany || recruiterEmail ? '. ' : ' includes '}Hiring context: ${recruiterContext}` : '.'}`
  }

  return locale === 'vi'
    ? `Mình đã nhận câu hỏi của bạn: “${input || '...'}”. Bản demo này đang chạy ở chế độ an toàn nên chưa gửi email hay đặt lịch thật, nhưng bạn vẫn có thể lưu thông tin tuyển dụng, chọn ngày giờ mong muốn và dùng widget này để chuẩn bị nội dung liên hệ tuyển dụng song ngữ.`
    : `I received your question: “${input || '...'}”. This demo is running in a safe placeholder mode, so it does not send real emails or book real calendar events yet, but you can already save recruiter details, pick a preferred date and time, and use the widget to prepare bilingual recruiter outreach.`
}

import type {
  ChatLanguage,
  InterviewProfile,
  SchedulePayload,
} from '@/lib/interview-chat/build-system-prompt'

type BuildFallbackReplyInput = {
  locale: ChatLanguage
  input: string
  profile?: InterviewProfile
  schedule?: SchedulePayload
}

export function buildFallbackReply({
  locale,
  input,
  profile,
  schedule,
}: BuildFallbackReplyInput) {
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

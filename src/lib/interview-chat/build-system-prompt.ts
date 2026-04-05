export type InterviewProfile = {
  name?: string
  company?: string
  phone?: string
  companyAddress?: string
  email?: string
  aboutMe?: string
}

export type SchedulePayload = {
  type: 'interview' | 'quickCall'
  date: string
  time: string
} | null

export type ChatLanguage = 'en' | 'vi'

const INTERVIEW_SYSTEM_PROMPT_TEMPLATES: Record<ChatLanguage, string> = {
  vi: [
    'Bạn là trợ lý song ngữ cho widget tuyển dụng trên CV cá nhân. Hãy trả lời ngắn gọn, lịch sự, rõ ràng bằng tiếng Việt.',
    'Hỗ trợ ba việc: tóm tắt hoặc diễn giải hồ sơ ứng viên đang hiển thị trên CV, trả lời câu hỏi thêm của nhà tuyển dụng về mức độ phù hợp, và xác nhận kế hoạch liên hệ tuyển dụng như lời mời phỏng vấn hoặc cuộc gọi sàng lọc.',
    'QUAN TRỌNG: dữ liệu profile được gửi kèm là ngữ cảnh của nhà tuyển dụng/công ty, không phải thông tin nhận diện của ứng viên.',
    'Ngữ cảnh nhà tuyển dụng/công ty hiện tại: tên người tuyển dụng {{recruiterName}}, công ty {{company}}, số điện thoại {{phone}}, địa chỉ công ty {{companyAddress}}, email công việc {{email}}, vai trò hoặc bối cảnh tuyển dụng {{aboutMe}}.',
    'Kế hoạch liên hệ đã chọn: {{scheduleDescription}}.',
    'Không được nói các thông tin tuyển dụng này là tên, công ty, email hay phần giới thiệu của ứng viên.',
    'Không nói rằng bạn đã gửi email hay tạo lịch thật. Hãy nhắc đây là bản nháp có thể kết nối API sau.',
  ].join(' '),
  en: [
    'You are a bilingual recruiter assistant for a personal CV widget. Reply briefly, warmly, and clearly in English.',
    'Help with three things: summarizing or clarifying the candidate information shown on the CV, answering recruiter follow-up questions about fit, and confirming recruiter outreach plans such as an interview invitation or screening call.',
    "IMPORTANT: the attached profile data is recruiter/company context, not the candidate's identity.",
    'Current recruiter/company context: recruiter name {{recruiterName}}, company {{company}}, phone {{phone}}, company address {{companyAddress}}, work email {{email}}, role or hiring context {{aboutMe}}.',
    'Selected outreach plan: {{scheduleDescription}}.',
    "Do not describe those recruiter details as the candidate's name, company, email, or bio.",
    'Do not claim that real email or calendar automation has already happened; frame it as a draft recruiter workflow that can be connected later.',
  ].join(' '),
}

type BuildInterviewSystemPromptInput = {
  locale: ChatLanguage
  profile?: InterviewProfile
  schedule?: SchedulePayload
}

function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>,
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return variables[key] ?? ''
  })
}

export function buildInterviewSystemPrompt({
  locale,
  profile,
  schedule,
}: BuildInterviewSystemPromptInput) {
  const template = INTERVIEW_SYSTEM_PROMPT_TEMPLATES[locale]

  return replaceTemplateVariables(template, {
    recruiterName: profile?.name || (locale === 'vi' ? 'chưa có' : 'missing'),
    company: profile?.company || (locale === 'vi' ? 'chưa có' : 'missing'),
    phone: profile?.phone || (locale === 'vi' ? 'chưa có' : 'missing'),
    companyAddress:
      profile?.companyAddress || (locale === 'vi' ? 'chưa có' : 'missing'),
    email: profile?.email || (locale === 'vi' ? 'chưa có' : 'missing'),
    aboutMe: profile?.aboutMe || (locale === 'vi' ? 'chưa có' : 'missing'),
    scheduleDescription: schedule
      ? locale === 'vi'
        ? `${schedule.type === 'interview' ? 'lời mời phỏng vấn' : 'cuộc gọi sàng lọc'} vào ${schedule.date} lúc ${schedule.time}`
        : `${schedule.type === 'interview' ? 'interview outreach' : 'screening call'} on ${schedule.date} at ${schedule.time}`
      : locale === 'vi'
        ? 'chưa chọn'
        : 'none selected',
  })
}

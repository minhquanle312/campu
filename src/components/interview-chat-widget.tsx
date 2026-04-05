'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { enUS, vi as viLocale } from 'date-fns/locale'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import {
  Bot,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPinned,
  MessageSquareMore,
  Phone,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types/cv'

type InterviewChatWidgetProps = {
  locale: Locale
  title: string
  description: string
}

type InterviewProfile = {
  name: string
  company: string
  phone: string
  companyAddress: string
  email: string
  aboutMe: string
}

const translations = {
  en: {
    open: 'Open assistant',
    language: 'Language',
    intro:
      'Share your recruiter details, ask about the candidate, or line up a screening call or interview.',
    name: 'Recruiter name',
    company: 'Company',
    phone: 'Phone number',
    address: 'Company address',
    email: 'Work email',
    aboutMe: 'Role or hiring context',
    saveProfile: 'Save recruiter details',
    askPlaceholder: 'Ask about the candidate, hiring fit, or outreach timing…',
    quickActions: 'Recruiter details',
    askMore: 'Ask about candidate fit',
    scheduleInterview: 'Plan interview outreach',
    scheduleCall: 'Plan screening call',
    scheduleTitle: 'Choose outreach timing',
    scheduleSubtitle:
      'A simple placeholder scheduler for recruiter follow-up that you can later connect to calendar and email APIs.',
    pickDate: 'Pick a date',
    availableTimes: 'Available outreach times',
    selectedSchedule: 'Selected outreach plan',
    noDate: 'Choose a date and time first',
    send: 'Send',
    assistant: 'Assistant',
    you: 'You',
    interview: 'Interview',
    quickCall: 'Screening call',
    profileSaved:
      'Your recruiter details are ready. You can now draft outreach or choose a schedule.',
    scheduleReady:
      'Your outreach timing is saved in the widget. You can connect it to your calendar later.',
  },
  vi: {
    open: 'Mở trợ lý',
    language: 'Ngôn ngữ',
    intro:
      'Hãy điền thông tin tuyển dụng của bạn, hỏi thêm về ứng viên hoặc sắp xếp cuộc gọi sàng lọc hay buổi phỏng vấn.',
    name: 'Tên người tuyển dụng',
    company: 'Công ty',
    phone: 'Số điện thoại',
    address: 'Địa chỉ công ty',
    email: 'Email công việc',
    aboutMe: 'Vai trò hoặc bối cảnh tuyển dụng',
    saveProfile: 'Lưu thông tin tuyển dụng',
    askPlaceholder: 'Hỏi về ứng viên, mức độ phù hợp hoặc thời điểm liên hệ…',
    quickActions: 'Thông tin nhà tuyển dụng',
    askMore: 'Hỏi về độ phù hợp của ứng viên',
    scheduleInterview: 'Lên lịch mời phỏng vấn',
    scheduleCall: 'Lên lịch gọi sàng lọc',
    scheduleTitle: 'Chọn thời điểm liên hệ',
    scheduleSubtitle:
      'Lịch hẹn mẫu cho bước liên hệ tuyển dụng, bạn có thể kết nối thêm calendar API và email API sau đó.',
    pickDate: 'Chọn ngày',
    availableTimes: 'Khung giờ liên hệ',
    selectedSchedule: 'Kế hoạch liên hệ đã chọn',
    noDate: 'Hãy chọn ngày và giờ trước',
    send: 'Gửi',
    assistant: 'Trợ lý',
    you: 'Bạn',
    interview: 'Phỏng vấn',
    quickCall: 'Cuộc gọi sàng lọc',
    profileSaved:
      'Thông tin tuyển dụng của bạn đã sẵn sàng. Bây giờ bạn có thể soạn lời liên hệ hoặc chọn lịch.',
    scheduleReady:
      'Thời điểm liên hệ đã được lưu trong widget. Bạn có thể nối với calendar sau.',
  },
} as const

const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
]

function getMonthDays(currentMonth: Date) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: Array<Date | null> = []
  const firstWeekDay = (firstDay.getDay() + 6) % 7

  for (let i = 0; i < firstWeekDay; i += 1) {
    days.push(null)
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day))
  }

  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
}

export function InterviewChatWidget({
  locale,
  title,
  description,
}: InterviewChatWidgetProps) {
  const [input, setInput] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [scheduleType, setScheduleType] = useState<'interview' | 'quickCall'>(
    'interview',
  )
  const [profile, setProfile] = useState<InterviewProfile>({
    name: '',
    company: '',
    phone: '',
    companyAddress: '',
    email: '',
    aboutMe: '',
  })

  const t = translations[locale]
  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/interview-chat',
      prepareSendMessagesRequest: ({ messages: currentMessages }) => ({
        body: {
          locale,
          profile,
          schedule:
            selectedDate && selectedTime
              ? {
                  type: scheduleType,
                  date: selectedDate.toISOString(),
                  time: selectedTime,
                }
              : null,
          messages: currentMessages,
        },
      }),
    }),
  })

  const saveProfile = () => {
    void sendMessage({
      text:
        locale === 'vi'
          ? `Tôi là nhà tuyển dụng và vừa lưu bối cảnh liên hệ của bên tuyển dụng: tên ${profile.name}, công ty ${profile.company}, số điện thoại ${profile.phone}, địa chỉ công ty ${profile.companyAddress}, email ${profile.email}, vai trò hoặc bối cảnh tuyển dụng: ${profile.aboutMe}. Hãy dùng các thông tin này làm ngữ cảnh nhà tuyển dụng/công ty, không phải thông tin nhận diện của ứng viên.`
          : `I am a recruiter and just saved my recruiter/company outreach context: name ${profile.name}, company ${profile.company}, phone ${profile.phone}, company address ${profile.companyAddress}, work email ${profile.email}, role or hiring context ${profile.aboutMe}. Please use these details as recruiter/company context, not as the candidate's identity.`,
    })
  }

  const submitMessage = () => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    void sendMessage({ text: trimmedInput })
    setInput('')
  }

  const saveSchedule = () => {
    if (!selectedDate || !selectedTime) {
      return
    }

    const summary =
      locale === 'vi'
        ? `Tôi muốn ${scheduleType === 'interview' ? 'gửi lời mời phỏng vấn' : 'sắp xếp cuộc gọi sàng lọc'} vào ngày ${format(selectedDate, 'dd/MM/yyyy')} lúc ${selectedTime}.`
        : `I want to ${scheduleType === 'interview' ? 'send interview outreach' : 'set up a screening call'} on ${format(selectedDate, 'MM/dd/yyyy')} at ${selectedTime}.`

    void sendMessage({ text: summary })
  }

  const displayLocale = locale === 'vi' ? viLocale : enUS

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden sm:bottom-6 sm:right-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="h-auto rounded-full bg-slate-900 px-5 py-3 text-white shadow-2xl hover:bg-slate-800">
            <MessageSquareMore className="size-4" />
            {title}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full overflow-hidden border-l-0 bg-white p-0 sm:max-w-115"
        >
          <div className="flex h-full min-h-0 flex-col bg-linear-to-b from-rose-50 via-white to-white">
            <div className="border-b border-rose-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4 pr-8">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
                    <Sparkles className="size-3.5" />
                    {t.assistant}
                  </div>
                  <SheetTitle className="text-xl font-black tracking-tight text-slate-900">
                    {title}
                  </SheetTitle>
                  <SheetDescription className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </SheetDescription>
                </div>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1 px-6 py-6">
              <div className="space-y-6 pb-6">
                <div className="rounded-4xl border border-rose-100 bg-white/90 p-5 shadow-sm">
                  <p className="text-sm leading-6 text-slate-600">{t.intro}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <QuickAction
                    icon={Briefcase}
                    label={t.askMore}
                    onClick={() =>
                      setInput(
                        locale === 'vi'
                          ? 'Cho tôi biết thêm về hồ sơ này và mức độ phù hợp với vị trí tuyển dụng.'
                          : 'Tell me more about this candidate and fit for the role.',
                      )
                    }
                  />
                  <QuickAction
                    icon={CalendarDays}
                    label={t.scheduleInterview}
                    onClick={() => setScheduleType('interview')}
                  />
                  <QuickAction
                    icon={Clock3}
                    label={t.scheduleCall}
                    onClick={() => setScheduleType('quickCall')}
                  />
                  <QuickAction
                    icon={Bot}
                    label={t.saveProfile}
                    onClick={() =>
                      setInput(
                        locale === 'vi'
                          ? 'Hãy giúp tôi soạn một lời nhắn đầu tiên để liên hệ với ứng viên.'
                          : 'Help me draft a first outreach message to this candidate.',
                      )
                    }
                  />
                </div>

                <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <UserRound className="size-4" />
                    {t.quickActions}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label={t.name} icon={UserRound}>
                      <Input
                        value={profile.name}
                        onChange={event =>
                          setProfile(current => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label={t.company} icon={Briefcase}>
                      <Input
                        value={profile.company}
                        onChange={event =>
                          setProfile(current => ({
                            ...current,
                            company: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label={t.phone} icon={Phone}>
                      <Input
                        value={profile.phone}
                        onChange={event =>
                          setProfile(current => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label={t.email} icon={Mail}>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={event =>
                          setProfile(current => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field
                      label={t.address}
                      icon={MapPinned}
                      className="sm:col-span-2"
                    >
                      <Input
                        value={profile.companyAddress}
                        onChange={event =>
                          setProfile(current => ({
                            ...current,
                            companyAddress: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field
                      label={t.aboutMe}
                      icon={MessageSquareMore}
                      className="sm:col-span-2"
                    >
                      <Textarea
                        value={profile.aboutMe}
                        onChange={event =>
                          setProfile(current => ({
                            ...current,
                            aboutMe: event.target.value,
                          }))
                        }
                        className="min-h-[110px]"
                      />
                    </Field>
                  </div>

                  <Button
                    type="button"
                    className="mt-4 w-full rounded-2xl bg-rose-500 py-6 text-sm font-semibold hover:bg-rose-600"
                    onClick={saveProfile}
                  >
                    {t.saveProfile}
                  </Button>
                </section>

                <section className="rounded-4xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-rose-200">
                        {t.scheduleTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {t.scheduleSubtitle}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                      {scheduleType === 'interview' ? t.interview : t.quickCall}
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        type="button"
                        className="rounded-full border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1,
                              1,
                            ),
                          )
                        }
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <p className="text-sm font-semibold tracking-wide">
                        {format(currentMonth, 'MMMM yyyy', {
                          locale: displayLocale,
                        })}
                      </p>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1,
                              1,
                            ),
                          )
                        }
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      {(locale === 'vi'
                        ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
                        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                      ).map(day => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>

                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {days.map((day, index) => {
                        if (!day) {
                          const row = Math.floor(index / 7)
                          const column = index % 7
                          return (
                            <div
                              key={`empty-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${row}-${column}`}
                              className="aspect-square rounded-2xl border border-transparent"
                            />
                          )
                        }

                        const isSelected =
                          selectedDate &&
                          day.toDateString() === selectedDate.toDateString()

                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            onClick={() => setSelectedDate(day)}
                            className={cn(
                              'aspect-square rounded-2xl border text-sm font-semibold transition-all',
                              isSelected
                                ? 'border-rose-400 bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                                : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10',
                            )}
                          >
                            {format(day, 'd')}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                      {t.availableTimes}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={cn(
                            'rounded-2xl border px-3 py-3 text-sm font-medium transition-all',
                            selectedTime === slot
                              ? 'border-rose-400 bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                              : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10',
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {t.selectedSchedule}
                    </p>
                    <p className="mt-2 leading-6">
                      {selectedDate && selectedTime
                        ? `${scheduleType === 'interview' ? t.interview : t.quickCall} • ${format(selectedDate, 'PPPP', { locale: displayLocale })} • ${selectedTime}`
                        : t.noDate}
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="mt-5 w-full rounded-2xl bg-white text-slate-900 hover:bg-rose-50"
                    onClick={saveSchedule}
                  >
                    {scheduleType === 'interview'
                      ? t.scheduleInterview
                      : t.scheduleCall}
                  </Button>
                </section>

                <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <Bot className="size-4" />
                    {t.assistant}
                  </div>

                  <div className="mb-4 space-y-3">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={cn(
                          'rounded-3xl px-4 py-3 text-sm leading-6',
                          message.role === 'user'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">
                          {message.role === 'user' ? t.you : t.assistant}
                        </p>
                        {message.parts.map(part =>
                          part.type === 'text' ? (
                            <p key={`${message.id}-${part.text}`}>
                              {part.text}
                            </p>
                          ) : null,
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Textarea
                      value={input}
                      onChange={event => setInput(event.target.value)}
                      placeholder={t.askPlaceholder}
                      className="min-h-[90px] rounded-3xl border-slate-200 bg-slate-50 px-4 py-3"
                    />
                    <Button
                      type="button"
                      className="h-auto rounded-3xl bg-slate-900 px-4 hover:bg-slate-800"
                      onClick={submitMessage}
                      disabled={status !== 'ready'}
                    >
                      <Send className="size-4" />
                      {t.send}
                    </Button>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Sparkles
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-sm"
    >
      <Icon className="mb-3 size-4 text-rose-500" />
      <p className="text-sm font-semibold text-slate-700">{label}</p>
    </button>
  )
}

function Field({
  children,
  label,
  icon: Icon,
  className,
}: {
  children: React.ReactNode
  label: string
  icon: typeof UserRound
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <Icon className="size-3.5" />
        {label}
      </span>
      {children}
    </div>
  )
}

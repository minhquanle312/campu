'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { enUS, vi as viLocale } from 'date-fns/locale'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { useTranslations } from 'next-intl'
import {
  Bot,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MessageSquareMore,
  Send,
  Sparkles,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types/cv'

type InterviewChatWidgetProps = {
  locale: Locale
  title: string
  description: string
}

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
  const t = useTranslations('CV.InterviewChatWidget')
  const weekdays = [
    t('Weekdays.Mon'),
    t('Weekdays.Tue'),
    t('Weekdays.Wed'),
    t('Weekdays.Thu'),
    t('Weekdays.Fri'),
    t('Weekdays.Sat'),
    t('Weekdays.Sun'),
  ]
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'schedule'>('chat')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [scheduleType, setScheduleType] = useState<'interview' | 'quickCall'>(
    'interview',
  )

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth])

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/interview-chat',
      prepareSendMessagesRequest: ({ messages: currentMessages }) => ({
        body: {
          locale,
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

  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

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
      scheduleType === 'interview'
        ? t('ScheduleSummaryInterview', {
            date: format(
              selectedDate,
              locale === 'vi' ? 'dd/MM/yyyy' : 'MM/dd/yyyy',
            ),
            time: selectedTime,
          })
        : t('ScheduleSummaryQuickCall', {
            date: format(
              selectedDate,
              locale === 'vi' ? 'dd/MM/yyyy' : 'MM/dd/yyyy',
            ),
            time: selectedTime,
          })

    void sendMessage({ text: summary })
  }

  const displayLocale = locale === 'vi' ? viLocale : enUS
  const latestMessage = messages.at(-1)
  const latestMessageText = latestMessage?.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
  const messageCount = messages.length
  const transcriptScrollKey = `${messageCount}:${latestMessage?.id ?? 'none'}:${latestMessageText ?? ''}`

  useEffect(() => {
    if (!isOpen || !transcriptScrollKey) {
      return
    }

    requestAnimationFrame(() => {
      transcriptEndRef.current?.scrollIntoView({
        behavior: status === 'streaming' ? 'smooth' : 'auto',
        block: 'end',
      })
    })
  }, [isOpen, status, transcriptScrollKey])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    if (!open) {
      setIsFullscreen(false)
      setActiveTab('chat')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden sm:bottom-6 sm:right-6">
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button className="h-auto rounded-full bg-slate-900 px-5 py-3 text-white shadow-2xl hover:bg-slate-800">
            <MessageSquareMore className="size-4" />
            {title}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className={cn(
            'w-full overflow-hidden border-l-0 bg-white p-0',
            isFullscreen ? 'sm:max-w-none lg:w-screen' : 'sm:max-w-115',
          )}
        >
          <div className="flex h-full min-h-0 flex-col bg-linear-to-b from-rose-50 via-white to-white">
            <div className="border-b border-rose-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4 pr-8">
                <div>
                  <div className="flex justify-between items-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
                      <Sparkles className="size-3.5" />
                      {t('Assistant')}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsFullscreen(current => !current)}
                      className="hidden rounded-full lg:inline-flex bg-rose-100 px-3 py-1 text-xs font-semibold uppercase text-rose-700"
                    >
                      {t('ViewInFullScreen')}
                    </Button>
                  </div>
                  <SheetTitle className="text-xl font-black tracking-tight text-slate-900">
                    {title}
                  </SheetTitle>
                  <SheetDescription className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </SheetDescription>
                </div>

                {/* <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsFullscreen(current => !current)}
                  className="hidden rounded-full px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
                >
                  {fullscreenToggleLabel}
                </Button> */}
              </div>
            </div>

            {isFullscreen ? (
              <div className="min-h-0 flex-1 px-6 py-6 lg:px-10 lg:py-8">
                <section className="flex h-full min-h-0 flex-col rounded-4xl border border-slate-200 bg-white p-5 shadow-sm lg:mx-auto lg:max-w-4xl">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <Bot className="size-4" />
                    {t('Assistant')}
                  </div>

                  {error ? (
                    <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                      {t('ErrorSending')}
                    </div>
                  ) : null}

                  <ScrollArea className="mb-4 min-h-0 flex-1 pr-3">
                    <div className="space-y-3">
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
                            {message.role === 'user'
                              ? t('You')
                              : t('Assistant')}
                          </p>
                          {message.parts.map(part =>
                            part.type === 'text' ? (
                              <MarkdownRenderer
                                key={`${message.id}-${part.text}`}
                                content={part.text}
                                className={cn(
                                  'space-y-3 break-words [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.95em] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:px-3 [&_pre]:py-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5',
                                  message.role === 'user'
                                    ? '[&_a]:text-white [&_code]:bg-white/15 [&_pre]:bg-white/10'
                                    : '[&_a]:text-slate-900 [&_code]:bg-slate-200 [&_pre]:bg-white',
                                )}
                              />
                            ) : null,
                          )}
                        </div>
                      ))}
                      <div ref={transcriptEndRef} />
                    </div>
                  </ScrollArea>

                  <form
                    className="flex items-center gap-3"
                    onSubmit={event => {
                      event.preventDefault()
                      submitMessage()
                    }}
                  >
                    <Input
                      value={input}
                      onChange={event => setInput(event.target.value)}
                      placeholder={t('AskPlaceholder')}
                      disabled={status !== 'ready'}
                      className="h-12 flex-1 rounded-3xl border-slate-200 bg-slate-50 px-4 text-sm shadow-none placeholder:text-slate-400"
                    />
                    <Button
                      type="submit"
                      className="h-12 rounded-3xl bg-slate-900 px-4 hover:bg-slate-800"
                      disabled={status !== 'ready'}
                    >
                      <Send className="size-4" />
                      {t('Send')}
                    </Button>
                  </form>
                </section>
              </div>
            ) : (
              <div className="min-h-0 flex-1 overflow-hidden px-6 py-6">
                <div className="flex h-full min-h-0 flex-col gap-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <QuickAction
                      icon={Briefcase}
                      label={t('AskMore')}
                      onClick={() => {
                        setActiveTab('chat')
                        setInput(t('AskMorePrefill'))
                      }}
                    />
                    <QuickAction
                      icon={CalendarDays}
                      label={t('ScheduleInterview')}
                      onClick={() => {
                        setScheduleType('interview')
                        setActiveTab('schedule')
                      }}
                    />
                    <QuickAction
                      icon={Clock3}
                      label={t('ScheduleCall')}
                      onClick={() => {
                        setScheduleType('quickCall')
                        setActiveTab('schedule')
                      }}
                    />
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={value =>
                      setActiveTab(value as 'chat' | 'schedule')
                    }
                    className="flex min-h-0 flex-1 flex-col gap-4"
                  >
                    <TabsList className="w-full rounded-3xl bg-rose-100/80 p-1">
                      <TabsTrigger value="chat" className="rounded-[20px]">
                        {t('ChatTab')}
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="rounded-[20px]">
                        {t('ScheduleTab')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="chat"
                      className="min-h-0 flex-1 overflow-hidden"
                    >
                      <section className="flex h-full min-h-0 flex-col rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                          <Bot className="size-4" />
                          {t('Assistant')}
                        </div>

                        {error ? (
                          <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
                            {t('ErrorSending')}
                          </div>
                        ) : null}

                        <ScrollArea className="mb-4 min-h-0 flex-1 pr-3">
                          <div className="space-y-3">
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
                                  {message.role === 'user'
                                    ? t('You')
                                    : t('Assistant')}
                                </p>
                                {message.parts.map(part =>
                                  part.type === 'text' ? (
                                    <MarkdownRenderer
                                      key={`${message.id}-${part.text}`}
                                      content={part.text}
                                      className={cn(
                                        'space-y-3 break-words [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.95em] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:px-3 [&_pre]:py-2 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5',
                                        message.role === 'user'
                                          ? '[&_a]:text-white [&_code]:bg-white/15 [&_pre]:bg-white/10'
                                          : '[&_a]:text-slate-900 [&_code]:bg-slate-200 [&_pre]:bg-white',
                                      )}
                                    />
                                  ) : null,
                                )}
                              </div>
                            ))}
                            <div ref={transcriptEndRef} />
                          </div>
                        </ScrollArea>

                        <form
                          className="flex items-center gap-3"
                          onSubmit={event => {
                            event.preventDefault()
                            submitMessage()
                          }}
                        >
                          <Input
                            value={input}
                            onChange={event => setInput(event.target.value)}
                            placeholder={t('AskPlaceholder')}
                            disabled={status !== 'ready'}
                            className="h-12 flex-1 rounded-3xl border-slate-200 bg-slate-50 px-4 text-sm shadow-none placeholder:text-slate-400"
                          />
                          <Button
                            type="submit"
                            className="h-12 rounded-3xl bg-slate-900 px-4 hover:bg-slate-800"
                            disabled={status !== 'ready'}
                          >
                            <Send className="size-4" />
                            {t('Send')}
                          </Button>
                        </form>
                      </section>
                    </TabsContent>

                    <TabsContent
                      value="schedule"
                      className="min-h-0 flex-1 overflow-hidden"
                    >
                      <section className="flex h-full min-h-0 flex-col overflow-y-auto rounded-4xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                        <div className="flex w-full items-start justify-between gap-4 pr-2">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex rounded-full bg-white/10 p-2 text-rose-200">
                              <CalendarDays className="size-4" />
                            </span>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-rose-200">
                                {t('ScheduleTitle')}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">
                                {t('ScheduleSubtitle')}
                              </p>
                            </div>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                            {scheduleType === 'interview'
                              ? t('Interview')
                              : t('QuickCall')}
                          </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
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
                            {weekdays.map(day => (
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
                                day.toDateString() ===
                                  selectedDate.toDateString()

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
                            {t('AvailableTimes')}
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
                            {t('SelectedSchedule')}
                          </p>
                          <p className="mt-2 leading-6">
                            {selectedDate && selectedTime
                              ? `${scheduleType === 'interview' ? t('Interview') : t('QuickCall')} • ${format(selectedDate, 'PPPP', { locale: displayLocale })} • ${selectedTime}`
                              : t('NoDate')}
                          </p>
                        </div>

                        <Button
                          type="button"
                          className="mt-5 w-full rounded-2xl bg-white text-slate-900 hover:bg-rose-50"
                          onClick={saveSchedule}
                        >
                          {scheduleType === 'interview'
                            ? t('ScheduleInterview')
                            : t('ScheduleCall')}
                        </Button>
                      </section>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
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

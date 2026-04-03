import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import type { CVData, Locale } from '@/types/cv'

type CVMessages = {
  contact: string
  skills: string
  education: string
  experience: string
  downloadPdf: string
  information: string
  summary: string
  objective: string
  fullLayout: string
  minimalLayout: string
  hrAssistant: string
  hrAssistantDescription: string
}

type LayoutProps = {
  cv: CVData
  locale: Locale
  messages: CVMessages
  documentId?: string
  desktopMinWidthClassName?: string
}

function localized(value?: { vi?: string; en?: string }, locale?: Locale) {
  if (!value) return ''
  return locale === 'vi' ? (value.vi ?? '') : (value.en ?? '')
}

function uniqueKey(parts: Array<string | number | undefined | null>) {
  return parts
    .filter(
      part => part !== undefined && part !== null && String(part).length > 0,
    )
    .join('::')
}

function sectionHeading(label: string, dark = false) {
  return (
    <h2
      className={
        dark
          ? 'text-xl font-bold tracking-wider uppercase border-b border-slate-600 pb-2 mb-6'
          : 'text-2xl font-bold tracking-wider uppercase text-slate-800 mb-6 border-b-2 border-slate-200 pb-2 inline-block'
      }
    >
      {label}
    </h2>
  )
}

function ContactSection({
  cv,
  locale,
  title,
  dark = false,
}: {
  cv: CVData
  locale: Locale
  title: string
  dark?: boolean
}) {
  const iconClassName = dark
    ? 'w-4 h-4 text-slate-400'
    : 'w-4 h-4 text-slate-500'
  const textClassName = dark ? 'text-sm' : 'text-sm text-slate-600'

  return (
    <div className="space-y-4">
      {sectionHeading(title, dark)}
      <div className={`flex items-center gap-3 ${textClassName}`}>
        <Phone className={iconClassName} />
        <span>{cv.personalInfo?.phone || '093 7519 105'}</span>
      </div>
      <div className={`flex items-center gap-3 ${textClassName}`}>
        <Mail className={iconClassName} />
        <span className="break-all">
          {cv.personalInfo?.email || 'quyenphanthicam@gmail.com'}
        </span>
      </div>
      <div className={`flex items-center gap-3 ${textClassName}`}>
        <MapPin className={iconClassName} />
        <span>
          {localized(cv.personalInfo?.address, locale) || 'Thành Phố Thủ Đức'}
        </span>
      </div>
      {cv.personalInfo?.website && (
        <div className={`flex items-center gap-3 ${textClassName}`}>
          <Globe className={iconClassName} />
          <a
            href={`https://${cv.personalInfo.website}`}
            className={dark ? 'hover:text-amber-400' : 'hover:text-rose-500'}
          >
            {cv.personalInfo.website}
          </a>
        </div>
      )}
    </div>
  )
}

function InformationSection({ cv, title }: { cv: CVData; title: string }) {
  return (
    <div>
      {sectionHeading(title)}
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Name
          </p>
          <p className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-800">
            {cv.personalInfo?.name || 'PHAN THỊ CẨM QUYÊN'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Year
          </p>
          <p className="mt-2 text-base text-slate-600">
            {cv.personalInfo?.birthYear || '2002'}
          </p>
        </div>
      </div>
    </div>
  )
}

function SummarySection({
  content,
  title,
}: {
  content?: string
  title: string
}) {
  if (!content) return null

  return (
    <div>
      {sectionHeading(title)}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-xs">
        {content}
      </div>
    </div>
  )
}

function SkillsSection({
  cv,
  locale,
  title,
  dark = false,
}: {
  cv: CVData
  locale: Locale
  title: string
  dark?: boolean
}) {
  const skills = cv.skills?.[locale] || []

  return (
    <div className="space-y-4">
      {sectionHeading(title, dark)}
      {dark ? (
        <ul className="space-y-2 text-sm list-disc list-inside">
          {skills.length > 0
            ? skills.map(skill => (
                <li
                  key={uniqueKey(['skill-dark', skill])}
                  className="leading-relaxed"
                >
                  {skill}
                </li>
              ))
            : null}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span
              key={uniqueKey(['skill-light', skill])}
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function EducationSection({
  cv,
  locale,
  title,
  dark = false,
}: {
  cv: CVData
  locale: Locale
  title: string
  dark?: boolean
}) {
  const education = cv.education || []

  return (
    <div className="space-y-4">
      {sectionHeading(title, dark)}
      {education.length > 0
        ? education.map(edu => (
            <div
              key={uniqueKey([
                'education',
                localized(edu.institution, locale),
                localized(edu.major, locale),
                edu.period,
              ])}
              className={
                dark
                  ? 'mb-4'
                  : 'rounded-3xl border border-slate-200 bg-white p-5'
              }
            >
              <h3
                className={
                  dark
                    ? 'font-semibold text-amber-400 text-sm uppercase'
                    : 'font-semibold text-slate-800 text-sm uppercase'
                }
              >
                {localized(edu.institution, locale)}
              </h3>
              <p
                className={
                  dark ? 'text-sm mt-1' : 'mt-2 text-sm text-slate-600'
                }
              >
                {localized(edu.major, locale)}
              </p>
              <p
                className={
                  dark
                    ? 'text-xs text-slate-400 mt-1'
                    : 'mt-2 text-xs text-slate-500'
                }
              >
                {edu.period}
              </p>
            </div>
          ))
        : null}
    </div>
  )
}

function ExperienceSection({
  cv,
  locale,
  title,
}: {
  cv: CVData
  locale: Locale
  title: string
}) {
  const experience = cv.experience || []

  return (
    <div>
      {sectionHeading(title)}
      <div className="relative space-y-8 pl-8 before:absolute before:left-[6px] before:top-3 before:bottom-3 before:w-px before:bg-slate-200">
        {experience.length > 0 ? (
          experience.map(exp => (
            <div
              key={uniqueKey([
                'experience',
                exp.company,
                localized(exp.role, locale),
                localized(exp.period, locale),
              ])}
              className="relative"
            >
              <div className="absolute -left-8 top-2.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-slate-400 shadow-sm" />
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold leading-tight text-slate-800">
                    {localized(exp.role, locale)}
                  </h3>
                  <div className="text-sm font-medium text-amber-600">
                    {exp.company}
                  </div>
                  <time className="text-sm font-medium text-slate-500">
                    {localized(exp.period, locale)}
                  </time>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {(exp.descriptions?.[locale] || []).map(desc => (
                    <li key={uniqueKey(['description', exp.company, desc])}>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 italic">
            No experience added yet.
          </p>
        )}
      </div>
    </div>
  )
}

export function CVDesktopLayout({
  cv,
  locale,
  messages,
  documentId,
  desktopMinWidthClassName = '',
}: LayoutProps) {
  return (
    <div
      id={documentId}
      className={`mx-auto min-h-[1056px] max-w-4xl border border-gray-100/50 text-gray-800 shadow-xl ${desktopMinWidthClassName}`.trim()}
    >
      <div className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-y-0 left-0 w-[33.333333%] bg-slate-800"
          aria-hidden="true"
        />
        <div className="relative z-10 grid min-h-[1056px] grid-cols-3">
          <div className="col-span-1 bg-slate-800 p-8 text-slate-100">
            <div className="flex h-full flex-col gap-10">
              <ContactSection
                cv={cv}
                locale={locale}
                title={messages.contact}
                dark
              />
              <SkillsSection
                cv={cv}
                locale={locale}
                title={messages.skills}
                dark
              />
              <EducationSection
                cv={cv}
                locale={locale}
                title={messages.education}
                dark
              />
            </div>
          </div>

          <div className="col-span-2 bg-white p-8 md:p-12">
            <div className="mb-6">
              <h1 className="text-3xl font-black uppercase tracking-tight text-slate-800 md:text-4xl">
                {cv.personalInfo?.name || 'PHAN THỊ CẨM QUYÊN'}
              </h1>
              <p className="mt-2 text-lg text-slate-500 max-w-md">
                {cv.personalInfo?.birthYear || '2002'}
              </p>
            </div>

            <div className="space-y-10">
              <SummarySection
                content={localized(cv.summary, locale)}
                title={messages.summary}
              />
              <SummarySection
                content={localized(cv.objective, locale)}
                title={messages.objective}
              />
              <ExperienceSection
                cv={cv}
                locale={locale}
                title={messages.experience}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CVSimpleLayout({ cv, locale, messages }: LayoutProps) {
  return (
    <div className="mx-auto max-w-4xl rounded-4xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
      <div className="space-y-10">
        <InformationSection cv={cv} title={messages.information} />
        <ContactSection cv={cv} locale={locale} title={messages.contact} />
        <SummarySection
          content={localized(cv.summary, locale)}
          title={messages.summary}
        />
        <SummarySection
          content={localized(cv.objective, locale)}
          title={messages.objective}
        />
        <SkillsSection cv={cv} locale={locale} title={messages.skills} />
        <EducationSection cv={cv} locale={locale} title={messages.education} />
        <ExperienceSection
          cv={cv}
          locale={locale}
          title={messages.experience}
        />
      </div>
    </div>
  )
}

export type { CVMessages }

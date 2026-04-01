import { getTranslations } from 'next-intl/server'
import dbConnect from '@/lib/mongodb'
import CVModel from '@/models/CV'
import { CVDownloadButton } from '@/components/cv-download-button'
import { Mail, MapPin, Phone, Globe, Home } from 'lucide-react'
import { Link } from '@/i18n/navigation'

// Basic type to infer mongoose document
type MongooseCV = any 

export default async function CVPage({
  params,
}: {
  params: Promise<{ locale: 'en' | 'vi' }>
}) {
  const { locale } = await params
  const t = await getTranslations('CV')

  await dbConnect()
  const cvDoc: MongooseCV = await CVModel.findOne({}).lean() || {
    personalInfo: {},
    education: [],
    experience: [],
    skills: { vi: [], en: [] }
  }

  const cv = cvDoc

  return (
    <main className="min-h-screen py-12 px-2 sm:px-6 bg-slate-100 print:bg-white print:py-0 print:px-0 relative">
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 print:hidden">
        <Link 
          href="/" 
          className="flex flex-col items-center justify-center p-3 sm:px-4 sm:py-2.5 bg-white/90 backdrop-blur-md hover:bg-slate-100 text-slate-700 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 border border-slate-200 group"
          title="Back to Home"
        >
          <Home className="w-5 h-5 sm:w-4 sm:h-4 group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>

      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 print:hidden">
        <CVDownloadButton targetId="cv-document" label={t('DownloadPDF')} />
      </div>
      
      {/* CV Paper */}
      <div 
        id="cv-document" 
        className="max-w-4xl mx-auto bg-white shadow-xl min-h-[1056px] border border-gray-100/50 relative text-gray-800 print:shadow-none print:border-none print:max-w-none print:w-full"
      >
        <div className="flex flex-col md:flex-row h-full w-full">
          {/* Left Column (Sidebar) */}
          <div className="w-full md:w-1/3 bg-slate-800 text-slate-100 p-8 flex flex-col gap-10">
            {/* Header / Name mobile fallback if needed, but here we just put Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-wider uppercase border-b border-slate-600 pb-2 mb-6">
                {t('Contact')}
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{cv?.personalInfo?.phone || '093 7519 105'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="break-all">{cv?.personalInfo?.email || 'quyenphanthicam@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{cv?.personalInfo?.address?.[locale] || 'Thành Phố Thủ Đức'}</span>
              </div>
              {cv?.personalInfo?.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={`https://${cv.personalInfo.website}`} className="hover:text-amber-400">{cv.personalInfo.website}</a>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-wider uppercase border-b border-slate-600 pb-2 mb-6">
                {t('Skills')}
              </h2>
              <ul className="space-y-2 text-sm list-disc list-inside">
                {(cv?.skills?.[locale] || []).length > 0 ? (
                  cv.skills[locale].map((skill: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{skill}</li>
                  ))
                ) : (
                  <>
                    <li>Tin học văn phòng</li>
                    <li>Làm việc nhóm</li>
                    <li>Quản lý thời gian</li>
                    <li>Kỹ năng giao tiếp</li>
                    <li>Giải quyết vấn đề</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-wider uppercase border-b border-slate-600 pb-2 mb-6">
                {t('Education')}
              </h2>
              {cv?.education?.length > 0 ? (
                cv.education.map((edu: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-semibold text-amber-400 text-sm uppercase">{edu.institution?.[locale]}</h3>
                    <p className="text-sm mt-1">{edu.major?.[locale]}</p>
                    <p className="text-xs text-slate-400 mt-1">{edu.period}</p>
                  </div>
                ))
              ) : (
                <div>
                  <h3 className="font-semibold text-amber-400 text-sm uppercase">ĐẠI HỌC TÔN ĐỨC THẮNG</h3>
                  <p className="text-sm mt-1">Chuyên ngành: Du lịch & Quản lý du lịch</p>
                  <p className="text-xs text-slate-400 mt-1">2020 - 2024</p>
                </div>
              )}
            </div>
            
          </div>

          {/* Right Column (Main content) */}
          <div className="w-full md:w-2/3 p-10 md:p-14">
            <div className="mb-14">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-800 mb-2">
                {cv?.personalInfo?.name || 'PHAN THỊ CẨM QUYÊN'}
              </h1>
              <p className="text-lg text-slate-500 max-w-md">
                {cv?.personalInfo?.birthYear || '2002'}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-wider uppercase text-slate-800 mb-8 border-b-2 border-slate-200 pb-2 inline-block">
                 {t('Experience')}
              </h2>
              
              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {cv?.experience?.length > 0 ? (
                  cv.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-slate-300 text-slate-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 -ms-3 md:mx-auto md:ms-0 absolute left-2 md:left-1/2 top-0 z-10" />
                       <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-[2.5rem] md:ml-0 md:group-even:pr-8 md:group-odd:pl-8 pb-8">
                         <div className="flex flex-col mb-2">
                           <h3 className="font-bold text-slate-800 text-lg">{exp.role?.[locale]}</h3>
                           <div className="flex items-center text-sm font-medium text-amber-600">
                             {exp.company}
                           </div>
                           <time className="text-sm text-slate-500 mt-1 font-medium">{exp.period?.[locale]}</time>
                         </div>
                         <ul className="text-slate-600 text-sm space-y-2 list-disc ml-4">
                           {exp.descriptions?.[locale]?.map((desc: string, i: number) => (
                             <li key={i}>{desc}</li>
                           ))}
                         </ul>
                       </div>
                    </div>
                  ))
                ) : (
                   <p className="text-sm text-slate-500 italic ml-10">No experience added yet.</p>
                )}
                
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  )
}

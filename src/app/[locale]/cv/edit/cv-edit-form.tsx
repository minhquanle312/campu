'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Save, Plus, Trash2 } from 'lucide-react'

type CVFormValues = any; // Typing can be expanded later for strictness

export default function CVEditForm({ initialData }: { initialData: CVFormValues }) {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const { register, control, handleSubmit } = useForm<CVFormValues>({
    defaultValues: initialData
  })

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: 'education'
  })

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: 'experience'
  })

  const onSubmit = async (data: CVFormValues) => {
    setIsSaving(true)
    
    // Convert comma separated skills strings to array for skills fields if they are sent as strings
    try {
      const formattedData = { ...data };
      
      if (typeof formattedData.skills?.vi === 'string') {
        formattedData.skills.vi = formattedData.skills.vi.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (typeof formattedData.skills?.en === 'string') {
        formattedData.skills.en = formattedData.skills.en.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      // Format descriptions in experience
      formattedData.experience = formattedData.experience.map((exp: any) => {
        return {
          ...exp,
          descriptions: {
            vi: typeof exp.descriptions?.vi === 'string' ? exp.descriptions.vi.split('\n').map((s: string) => s.trim()).filter(Boolean) : exp.descriptions?.vi,
            en: typeof exp.descriptions?.en === 'string' ? exp.descriptions.en.split('\n').map((s: string) => s.trim()).filter(Boolean) : exp.descriptions?.en
          }
        }
      });

      const res = await fetch('/api/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      })

      if (res.ok) {
        alert('Saved successfully!')
        router.refresh()
      } else {
        alert('Failed to save.')
      }
    } catch (e) {
      console.error(e)
      alert('An error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-32">
      {/* SECTION: Personal Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input {...register('personalInfo.name')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input {...register('personalInfo.phone')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input {...register('personalInfo.email')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Birth Year</label>
            <input {...register('personalInfo.birthYear')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Address (VI)</label>
            <input {...register('personalInfo.address.vi')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Address (EN)</label>
            <input {...register('personalInfo.address.en')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Website</label>
            <input {...register('personalInfo.website')} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      {/* SECTION: Skills */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-6">Skills (Comma separated)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Skills (VI)</label>
            <textarea 
              {...register('skills.vi')} 
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[100px]"
              defaultValue={initialData?.skills?.vi?.join(', ')}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Skills (EN)</label>
            <textarea 
              {...register('skills.en')} 
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[100px]"
              defaultValue={initialData?.skills?.en?.join(', ')}
            />
          </div>
        </div>
      </div>

      {/* SECTION: Education */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Education</h2>
          <button type="button" onClick={() => appendEdu({ period: '', institution: { vi: '', en: '' }, major: { vi: '', en: '' }})} className="text-sm flex items-center gap-1 text-rose-600 hover:text-rose-700">
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
        
        {eduFields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-slate-200 rounded-lg relative bg-slate-50/50 group">
             <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500">
               <Trash2 className="w-4 h-4" />
             </button>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Institution (VI)</label>
                  <input {...register(`education.${index}.institution.vi` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Institution (EN)</label>
                  <input {...register(`education.${index}.institution.en` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Major (VI)</label>
                  <input {...register(`education.${index}.major.vi` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Major (EN)</label>
                  <input {...register(`education.${index}.major.en` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Period (e.g. 2020 - 2024)</label>
                  <input {...register(`education.${index}.period` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* SECTION: Experience */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Experience</h2>
          <button type="button" onClick={() => appendExp({ company: '', period: {vi:'',en:''}, role: {vi:'', en:''}, descriptions: {vi:'',en:''} })} className="text-sm flex items-center gap-1 text-rose-600 hover:text-rose-700">
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>

        {expFields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-slate-200 rounded-lg relative bg-slate-50/50 group">
             <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500">
               <Trash2 className="w-4 h-4" />
             </button>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-xs font-medium text-slate-600">Company Name</label>
                  <input {...register(`experience.${index}.company` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Period (VI)</label>
                  <input {...register(`experience.${index}.period.vi` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Period (EN)</label>
                  <input {...register(`experience.${index}.period.en` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Role (VI)</label>
                  <input {...register(`experience.${index}.role.vi` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Role (EN)</label>
                  <input {...register(`experience.${index}.role.en` as const)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Description (VI, split by newline)</label>
                  <textarea 
                    {...register(`experience.${index}.descriptions.vi` as const)} 
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[120px]"
                    defaultValue={initialData?.experience?.[index]?.descriptions?.vi?.join('\n')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-600">Description (EN, split by newline)</label>
                  <textarea 
                    {...register(`experience.${index}.descriptions.en` as const)} 
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm min-h-[120px]"
                    defaultValue={initialData?.experience?.[index]?.descriptions?.en?.join('\n')}
                  />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-center z-50">
        <button 
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium shadow-xl transition-transform active:scale-95 disabled:opacity-70"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save CV'}
        </button>
      </div>

    </form>
  )
}

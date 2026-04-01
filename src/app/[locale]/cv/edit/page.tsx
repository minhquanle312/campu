import { auth } from '@/lib/auth'
import { ADMIN_USER_EMAIL } from '@/config/admin-user'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import CVEditForm from './cv-edit-form'
import dbConnect from '@/lib/mongodb'
import CVModel from '@/models/CV'

export default async function CVEditPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user || !ADMIN_USER_EMAIL.includes(session.user.email)) {
    redirect('/')
  }

  // Fetch current data serverside to avoid client hydration mismatch
  await dbConnect()
  const cvDoc = await CVModel.findOne({}).lean() || {
    personalInfo: { name: '', phone: '', email: '', address: { vi: '', en: '' }, birthYear: '', website: '' },
    education: [],
    skills: { vi: [], en: [] },
    experience: []
  }

  // Convert mongoose _id to string for serialization
  const cvData = JSON.parse(JSON.stringify(cvDoc))

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit CV Data</h1>
          <p className="text-sm text-slate-500 mt-2">Update the bilingual fields below. The CV page will automatically reflect these changes.</p>
        </div>
        
        <CVEditForm initialData={cvData} />
      </div>
    </main>
  )
}

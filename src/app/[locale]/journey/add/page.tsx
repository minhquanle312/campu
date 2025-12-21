import { AddTripForm } from './_components/add-trip-form'

export default async function Page() {
  return (
    <main className="container py-8 min-h-screen flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700">
          Add Trip
        </h1>
        <p className="text-pink-700">Add a new trip to your journey map.</p>
      </div>
      <AddTripForm />
    </main>
  )
}

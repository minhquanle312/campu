import { getTrips } from '@/services/trips.service'
import JourneyClient from './journey-client'

export const dynamic = 'force-dynamic'

export default async function JourneyPage() {
  const trips = await getTrips()

  return (
    <main className="container py-8 min-h-screen flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700">
          My Journey Map
        </h1>
        <p className="text-muted-foreground text-pink-700">
          Explore the memories across Vietnam. Click on a highlighted province
          to see the stories.
        </p>
      </div>

      <JourneyClient trips={trips} />
    </main>
  )
}

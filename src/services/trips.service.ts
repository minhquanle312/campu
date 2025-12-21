import { getSheetValues } from '@/lib/google-sheets'
import { Trip } from '@/models/trips.model'
import { getUsers } from './users.service'

export const getTrips = async (): Promise<Trip[]> => {
  const trips = await getSheetValues('Trips')
  const users = await getUsers()

  return trips.map(row => {
    return {
      id: row[0],
      title: row[1],
      date: row[2],
      summary: row[3],
      provinceName: row[4],
      provinceId: Number(row[5]),
      participants: row[7]
        ? row[7].split(',').map((id: string) => users.find(u => u.id === id))
        : [],
      participantIds: row[7] ? row[7].split(',') : [],
      images: row[8] ? row[8].split(',') : [],
      videos: row[9] ? row[9].split(',') : [],
    }
  })
}

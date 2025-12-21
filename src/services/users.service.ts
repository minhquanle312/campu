import { getSheetValues } from '@/lib/google-sheets'
import { User } from '@/models/users.model'

export const getUsers = async (): Promise<User[]> => {
  const response = await getSheetValues('Users')

  return response.map(row => {
    return {
      id: row[0],
      name: row[1],
      avatarUrl: row[2],
      email: row[3],
    }
  })
}

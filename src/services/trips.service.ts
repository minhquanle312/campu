import { getSheetValues } from "@/lib/google-sheets";

export const getTrips = async () => {
  return await getSheetValues("Trips");
};

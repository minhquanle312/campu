export interface Participant {
  name: string;
  avatar: string; // URL or path to image
}

export interface Trip {
  id: string;
  title: string;
  date: string; // ISO date or descriptive string
  summary: string;
  participants: Participant[];
  images: string[];
  video?: string; // Youtube link
  province: string; // Key to match map data
}

export const trips: Trip[] = [
  {
    id: "trip-1",
    title: "Summer in Da Nang",
    date: "2024-06-15",
    summary: "A wonderful week exploring the beaches and mountains of Da Nang. We visited Ba Na Hills, Hoi An Ancient Town, and enjoyed the best seafood.",
    province: "Đà Nẵng",
    participants: [
      { name: "Pu", avatar: "/placeholder-user.jpg" },
      { name: "Quan", avatar: "/placeholder-user.jpg" },
    ],
    images: [
      "/placeholder.jpg",
      "/placeholder.jpg",
    ],
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "trip-2",
    title: "Ha Giang Loop Adventure",
    date: "2023-11-20",
    summary: "Biking through the majestic Ma Pi Leng Pass. The weather was foggy but the experience was unforgettable.",
    province: "Hà Giang",
    participants: [
      { name: "Pu", avatar: "/placeholder-user.jpg" },
      { name: "Quan", avatar: "/placeholder-user.jpg" },
      { name: "Friends", avatar: "/placeholder-user.jpg" },
    ],
    images: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg",
    ],
  },
  {
    id: "trip-3",
    title: "Coffee Time in Buon Ma Thuot",
    date: "2024-01-10",
    summary: "Visiting the coffee capital of Vietnam. We learned how coffee is processed and tasted the best Robusta.",
    province: "Đắk Lắk",
    participants: [
      { name: "Pu", avatar: "/placeholder-user.jpg" },
    ],
    images: [
      "/placeholder.jpg",
    ],
  }
];

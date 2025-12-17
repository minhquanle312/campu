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
  provinceId: number; // Key to match map data
}

export const trips: Trip[] = [
  {
    id: "trip-1",
    title: "Đám cưới bên cồn",
    date: "2025-11-23",
    summary:
      "A beautiful wedding ceremony held on the river islet in Đà Nẵng. The atmosphere was filled with joy and traditional music.",
    provinceId: 17,
    participants: [
      { name: "Pu", avatar: "/placeholder-user.jpg" },
      { name: "MQL", avatar: "/placeholder-user.jpg" },
      { name: "Sơn", avatar: "/placeholder-user.jpg" },
      { name: "Thuỳ", avatar: "/placeholder-user.jpg" },
      { name: "Huy", avatar: "/placeholder-user.jpg" },
      { name: "Viên", avatar: "/placeholder-user.jpg" },
    ],
    images: [
      "/journey/bentre-2025-11-23/bentre-1.jpg",
      "/journey/bentre-2025-11-23/bentre-team-1.jpg",
    ],
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // {
  //   id: "trip-2",
  //   title: "Ha Giang Loop Adventure",
  //   date: "2023-11-20",
  //   summary:
  //     "Biking through the majestic Ma Pi Leng Pass. The weather was foggy but the experience was unforgettable.",
  //   provinceId: "Hà Giang",
  //   participants: [
  //     { name: "Pu", avatar: "/placeholder-user.jpg" },
  //     { name: "Quan", avatar: "/placeholder-user.jpg" },
  //     { name: "Friends", avatar: "/placeholder-user.jpg" },
  //   ],
  //   images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
  // },
  // {
  //   id: "trip-3",
  //   title: "Coffee Time in Buon Ma Thuot",
  //   date: "2024-01-10",
  //   summary:
  //     "Visiting the coffee capital of Vietnam. We learned how coffee is processed and tasted the best Robusta.",
  //   provinceId: "Đắk Lắk",
  //   participants: [{ name: "Pu", avatar: "/placeholder-user.jpg" }],
  //   images: ["/placeholder.jpg"],
  // },
];

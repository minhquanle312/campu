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
  videos: string[]; // Youtube links or video URLs
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
      "/journey/ben-tre-2025-11-23/bentre-1.jpg",
      "/journey/ben-tre-2025-11-23/bentre-team-1.jpg",
    ],
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  },
  {
    id: "trip-2",
    title: "Nam Cát Tiên adventure",
    date: "2025-12-13",
    summary:
      "A beautiful wedding ceremony held on the river islet in Đà Nẵng. The atmosphere was filled with joy and traditional music.",
    provinceId: 2,
    participants: [
      { name: "Pu", avatar: "/placeholder-user.jpg" },
      { name: "MQL", avatar: "/placeholder-user.jpg" },
      { name: "Sơn", avatar: "/placeholder-user.jpg" },
      { name: "Thuỳ", avatar: "/placeholder-user.jpg" },
      { name: "Bin", avatar: "/placeholder-user.jpg" },
    ],
    images: [
      "/journey/nam-cat-tien-2025-12-13/namcattien-spider-1.jpg",
      "/journey/nam-cat-tien-2025-12-13/namcattien-wc.jpg",
    ],
    // videos: [],
    videos: [
      "/journey/nam-cat-tien-2025-12-13/namcattien-sonthuy-1.mp4",
      "/journey/nam-cat-tien-2025-12-13/namcattien-zoo.mp4",
    ],
  },
];

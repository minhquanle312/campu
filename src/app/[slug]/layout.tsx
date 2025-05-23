import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cẩm Pu's Ceremony Invitation",
  description: "A cute invitation card for a special ceremony",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

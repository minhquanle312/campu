import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import localFont from "next/font/local";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cẩm Pu",
  description:
    "A little corner of the world for Cẩm Pu - lovingly crafted by Minh Quân Lê",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <NextIntlClientProvider>
          <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
            <MainNav />
            <main className="container mx-auto px-6 my-7">{children}</main>
            <footer className="container mx-auto pb-6 text-center bg-transparent">
              <p className="text-pink-500 mb-1">
                May the world be gentle with you
              </p>
              <p className="text-gray-600">Made with all of ❤️</p>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

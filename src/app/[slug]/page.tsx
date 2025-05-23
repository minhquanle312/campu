/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SwitchLanguage } from "@/components/switch-language";

export default function Page({ params }: any) {
  const { slug }: any = React.use(params);
  const t = useTranslations("");

  const [wishMessage, setWishMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<{ name: string; slug: string } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/sheets/${slug}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred fetching the data"
        );
      }
    };
    fetchData();
  }, [slug]);

  const submit = () => {
    fetch(`/api/sheets/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wish: wishMessage,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data submitted successfully:", data);
        setSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred submitting the data"
        );
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4 relative">
      <SwitchLanguage className="top-4 right-4 absolute z-50" />
      <Card className="w-full max-w-md mx-auto overflow-hidden relative bg-white shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="w-40 h-40 rounded-full bg-pink-100 absolute -top-20 -left-20"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20">
          <div className="w-40 h-40 rounded-full bg-pink-100 absolute -bottom-20 -right-20"></div>
        </div>

        {/* Top decorative border */}
        <div className="h-3 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300"></div>

        {/* Card content */}
        <div className="p-6 relative z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Heart className="text-pink-500 h-10 w-10 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-pink-700 mb-1">
              {t("InvitationTitle", { name: data?.name || "" })}
            </h1>
            <p className="text-pink-600 font-medium">
              {t("InvitationSubTitle")}
            </p>
          </div>

          {/* Girlfriend's Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-300">
              <Image
                src="/for-pu/avatar.jpg"
                alt="Girlfriend's Photo"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-pink-800 mb-2">
                {t("GraduationCeremony")}
              </h2>
              <p className="text-gray-600">{t("InvitationDescription")}</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-pink-700 italic mb-2">
              &quot;{t("Quote")}&quot;
            </p>
            <p className="text-gray-600">With love,</p>
            <p className="text-pink-600 font-bold text-lg">Cẩm Pu</p>
          </div>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="bg-pink-50 rounded-lg p-4 mb-6"
            >
              <h3 className="text-center text-pink-700 font-bold mb-4">
                {t("YourWishesForMe")}
              </h3>

              <div className="mb-4">
                <Label
                  htmlFor="wishMessage"
                  className="text-pink-700 mb-1 block"
                >
                  {t("YourWishesForMe")}
                </Label>
                <div className="relative">
                  <textarea
                    id="wishMessage"
                    placeholder={t("WishesDesc")}
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                    className="w-full min-h-[100px] p-3 rounded-lg border border-pink-300 focus:border-pink-500 focus:ring-pink-500 outline-none"
                    required
                  />
                  <div className="absolute -bottom-1 -right-1 text-pink-400 opacity-20">
                    <Heart className="h-12 w-12" fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2 rounded-full"
                >
                  {t("SendYourWishes")}
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-pink-50 rounded-lg p-4 mb-6 text-center">
              <h3 className="text-pink-700 font-bold mb-2">
                {t("ThankYou")}, {data?.name}!
              </h3>
              <p className="text-gray-600">{t("WishesSent")}</p>
              <div className="flex justify-center mt-2">
                <Heart
                  className="text-pink-500 h-6 w-6 animate-pulse"
                  fill="currentColor"
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom decorative elements */}
        <div className="flex justify-center -mb-2">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-pink-300"></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

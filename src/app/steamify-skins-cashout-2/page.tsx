import type { Metadata } from "next";
import { SoundProvider } from "@/components/sound/sound-provider";
import { SteamifyCaseContent } from "./_components/steamify-case-content";

export const metadata: Metadata = {
  title: "Steamify — Skins Cashout | Artem Suslov",
  description:
    "How I increased web-to-Telegram button CTR from 20% to 50% for Steamify.",
  alternates: { canonical: "https://artemsuslov.com/steamify-skins-cashout-2" },
};

export default function Page() {
  return <SoundProvider><SteamifyCaseContent /></SoundProvider>;
}

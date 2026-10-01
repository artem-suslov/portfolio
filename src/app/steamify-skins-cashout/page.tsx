import type { Metadata } from "next";
import { SoundProvider } from "@/components/sound/sound-provider";
import { CashoutCase } from "./_components/cashout-case";

export const metadata: Metadata = {
  title: "Steamify — Web-to-Telegram Conversion | Artem Suslov",
  description:
    "How I increased Steamify’s web-to-Telegram conversion from 20% to 50% through usability testing and a redesigned payout flow.",
  alternates: { canonical: "https://artemsuslov.com/steamify-skins-cashout" },
};

export default function SteamifySkinsCashoutPage() {
  return (
    <SoundProvider>
      <CashoutCase />
    </SoundProvider>
  );
}

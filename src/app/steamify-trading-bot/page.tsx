import type { Metadata } from "next";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SoundProvider } from "@/components/sound/sound-provider";
import { TradingCase } from "./_components/trading-case";

export const metadata: Metadata = {
  title: "Steamify — Steam Trading Dashboard | Artem Suslov",
  description:
    "How I designed Steamify’s trading bot dashboard, bringing Steam inventory, listings, prices, and sales into one workspace.",
  alternates: { canonical: "https://artemsuslov.com/steamify-trading-bot" },
};

export default function SteamifyTradingBotPage() {
  return (
    <SoundProvider>
      <MotionProvider>
        <TradingCase />
        <FeedbackWidget />
      </MotionProvider>
    </SoundProvider>
  );
}

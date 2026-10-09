import type { Metadata } from "next";
import { FeedbackWidget } from "@/components/feedback/feedback-widget";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SoundProvider } from "@/components/sound/sound-provider";
import { SafeCase } from "./_components/safe-case";

export const metadata: Metadata = {
  title: "Safe{Wallet} Design System | Artem Suslov",
  description:
    "How I built an open-source design system for Safe{Wallet}, aligned it with the frontend, and published it to the Figma Community.",
  alternates: { canonical: "https://artemsuslov.com/safe-design-system" },
};

export default function SafeDesignSystemPage() {
  return (
    <SoundProvider>
      <MotionProvider>
        <SafeCase />
        <FeedbackWidget />
      </MotionProvider>
    </SoundProvider>
  );
}

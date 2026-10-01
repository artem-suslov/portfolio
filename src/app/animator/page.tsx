import type { Metadata } from "next";
import { SoundProvider } from "@/components/sound/sound-provider";
import { AnimatorCaseContent } from "./_components/animator-case-en";

export const metadata: Metadata = {
  title: "Animator | Artem Suslov",
  description: "How I designed and built Animator, a browser tool for creating looping MP4 showcases.",
};

export default function AnimatorPage() {
  return (
    <SoundProvider>
      <AnimatorCaseContent />
    </SoundProvider>
  );
}

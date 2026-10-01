import type { Metadata } from "next";
import { SoundProvider } from "@/components/sound/sound-provider";
import { AnimatorCaseRussianContent } from "../_components/animator-case-ru";

export const metadata: Metadata = {
  title: "Animator | Артём Суслов",
  description: "Как я спроектировал и собрал Animator — браузерный инструмент для MP4-каруселей.",
};

export default function AnimatorRussianPage() {
  return (
    <SoundProvider>
      <AnimatorCaseRussianContent />
    </SoundProvider>
  );
}

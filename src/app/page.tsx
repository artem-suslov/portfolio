import { V2Hero } from "@/components/hero/v2-hero";
import { PaperIntro } from "@/components/portfolio/paper-intro";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";

export default function HomePage() {
  return (
    <>
      <PaperIntro />
      <PortfolioPage hero={<V2Hero />} showAbout={false} variant="v2" />
    </>
  );
}

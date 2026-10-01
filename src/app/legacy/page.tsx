import { DefaultHero } from "@/components/hero/default-hero";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";

export default function LegacyPortfolioPage() {
  return <PortfolioPage hero={<DefaultHero />} />;
}

import type { StaticImageData } from "next/image";
// Imported so the URL carries a content hash and the gallery knows each image's proportions.
import tovConcept from "../../public/images/Concept/ToV_Concept.png";
import agentsConcept from "../../public/images/Concept/Agents_Concept.png";
import loopConcept from "../../public/images/Concept/Loop_Concept.png";
import whispConcept from "../../public/images/Concept/Whisp_Concept.png";

export interface Concept {
  alt: string;
  src: StaticImageData;
}

export const concepts: Concept[] = [
  { alt: "Tone of voice picker for an AI chat assistant", src: tovConcept },
  { alt: "Dashboard for monitoring AI agent logs, latency, and cost", src: agentsConcept },
  { alt: "Whisp: an AI chat assistant next to a Solana wallet", src: whispConcept },
  { alt: "Coding agent run ready for review, with its prompt and sources", src: loopConcept },
];

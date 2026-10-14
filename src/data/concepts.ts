import type { StaticImageData } from "next/image";
// Imported so the URL carries a content hash and the gallery knows each image's proportions.
import tovConcept from "../../public/images/Concept/ToV_Concept.png";
import agentsConcept from "../../public/images/Concept/Agents_Concept.png";
import loopConcept from "../../public/images/Concept/Loop_Concept.png";
import whispConcept from "../../public/images/Concept/Whisp_Concept.png";

export interface Concept {
  alt: string;
  id: string;
  src: StaticImageData;
}

export const concepts: Concept[] = [
  { id: "concept-tov", alt: "Tone of voice picker for an AI chat assistant", src: tovConcept },
  { id: "concept-agents", alt: "Dashboard for monitoring AI agent logs, latency, and cost", src: agentsConcept },
  { id: "concept-whisp", alt: "Whisp: an AI chat assistant next to a Solana wallet", src: whispConcept },
  { id: "concept-loop", alt: "Coding agent run ready for review, with its prompt and sources", src: loopConcept },
];

export const conceptsById = new Map(concepts.map((concept) => [concept.id, concept]));

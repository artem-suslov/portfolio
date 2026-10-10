import {
  CaseLabel,
  CaseMeta,
  CaseOverview,
  CaseStudyLayout,
} from "@/components/case-study/case-study-layout";
import { CaseImage } from "@/components/case-study/case-media";
import { CaseMorph } from "@/components/case-study/case-morph";
import shared from "@/components/case-study/case-study.module.css";
import { TextLink } from "@/components/ui/text-link";
import styles from "./safe-case.module.css";

const assets = "/images/safe-case";
const figmaCommunity =
  "https://www.figma.com/design/iBppnJXYHDohsGz13mmHIi/Safe-Design-System--Community-?node-id=12668-9306";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "about-project", label: "About project" },
  { id: "idea-and-challenge", label: "Idea and challenge" },
  { id: "success-metrics", label: "Success metrics" },
  { id: "foundations", label: "Foundations" },
  { id: "components", label: "Components" },
  { id: "organisms", label: "Organisms" },
  { id: "results", label: "Outcomes and learnings" },
];

const meta = [
  { label: "Scope", value: "Design System" },
  { label: "Timeline", value: "Aug – Oct, 2023" },
  { label: "Live", value: <TextLink href={figmaCommunity}>Figma Community</TextLink> },
];

// Screens are 2560×1396 exports of the Figma Community file.
function Screen({ alt, name }: { alt: string; name: string }) {
  return <CaseImage caseId="safe-design-system" className={shared.media} src={`${assets}/${name}.jpg`} width={2560} height={1396} alt={alt} />;
}

// Spacing tokens shared with the frontend: an 8px step from --space-1 to --space-12.
function SpacingTokens() {
  return <table className={styles.tokens}>
    <thead><tr><th scope="col">Token</th><th scope="col">Value</th></tr></thead>
    <tbody>
      {Array.from({ length: 12 }, (_, i) => <tr key={i}><th scope="row"><code>--space-{i + 1}</code></th><td>{(i + 1) * 8}px</td></tr>)}
    </tbody>
  </table>;
}

function Metrics() {
  return <dl className={styles.metrics}>
    <div><dt>Likes in the Figma Community</dt><dd>85+</dd></div>
    <div><dt>Users</dt><dd>1,400+</dd></div>
    <div><dt><TextLink href="https://x.com/safe/status/1755592590794334674">Post views on X</TextLink></dt><dd>33,000+</dd></div>
    <div><dt><TextLink href="https://ethereum.org/en/developers/docs/design-and-ux/">Mentioned in an article</TextLink></dt><dd>Ethereum.org</dd></div>
  </dl>;
}

export function SafeCase() {
  return <CaseStudyLayout sections={sections}>
      <CaseOverview eyebrow="Safe{Wallet} · Web3, Design System" title={<>Open-source design system <br />for Safe{"{"}Wallet{"}"}</>}>
        <CaseMorph slug="safe-design-system">
          <CaseImage expandable={false} caseId="safe-design-system" className={shared.media} src="/images/safe_thumb_case.png" width={3816} height={2082} preload alt="Tag component from the Safe design system in light and dark themes" />
        </CaseMorph>
        <CaseMeta items={meta} />
      </CaseOverview>

      <section id="about-project" className={shared.divided}>
        <h2>About project</h2>
        <p>I was invited to help establish a unified design foundation, aligning design and frontend standards while shaping a system that could serve both internal needs and the broader Web3 community.</p>
      </section>

      <section id="idea-and-challenge" className={`${shared.divided} ${shared.spacious}`}>
        <h2>Idea and challenge</h2>
        <div className={shared.block}>
          <CaseLabel prominent>Problem</CaseLabel>
          <p>The absence of a centralized design system led to inconsistencies between design and frontend implementation, creating misalignment in visual standards and component usage.</p>
        </div>
        <div className={shared.block}>
          <CaseLabel prominent>Goal</CaseLabel>
          <p>Strengthen Safe’s presence in the Web3 design community by creating a publicly accessible design system.</p>
        </div>
        <div className={shared.block}>
          <CaseLabel prominent>Requirements</CaseLabel>
          <ul>
            <li>Use structured color variables.</li>
            <li>Support both Light and Dark modes based on shared color variables.</li>
            <li>Follow consistent technical naming conventions.</li>
            <li>Set up typography styles.</li>
          </ul>
        </div>
      </section>

      <section id="success-metrics" className={shared.divided}>
        <h2>Success metrics</h2>
        <ol className={styles.goals}>
          <li>Publish the design system before the end of 2023.</li>
          <li>Reach 50+ copies in the Figma Community before the end of 2023.</li>
          <li>Maintain an average rating of 4.5+ from Figma Community users.</li>
        </ol>
      </section>

      <section id="foundations" className={shared.divided}>
        <h2>Foundations</h2>
        <div className={shared.prose}>
          <p>I began by auditing an existing Figma file containing draft components and styles. I migrated all colors into Figma Variables and synchronized spacing tokens with the frontend codebase to ensure design-development consistency.</p>
          <p>The Safe{"{"}Wallet{"}"} frontend is built on <TextLink href="https://mui.com/">Material UI</TextLink> components, so it was sometimes crucial to rely on their standard components to verify behavior.</p>
          <p>I also configured layout grids and added missing color tokens based on the frontend library to fully align the design system with the implemented UI.</p>
        </div>
        <SpacingTokens />
        <div className={styles.screens}>
          <Screen name="colors" alt="Light mode color variables: background, border, text, primary, secondary, success and error groups" />
          <Screen name="grids" alt="Layout grids with fixed margins at 1920px, with and without the sidebar" />
        </div>
      </section>

      <section id="components" className={shared.divided}>
        <h2>Components</h2>
        <p>After configuring colors, spacing, and typography, I designed the foundational components along with their interaction states: buttons, selects, input fields, checkboxes, radio buttons, and more.</p>
        <div className={styles.screens}>
          <Screen name="input-field" alt="Input field states in light and dark themes" />
          <Screen name="tag" alt="Network, default and status tags in light and dark themes" />
        </div>
      </section>

      <section id="organisms" className={shared.divided}>
        <h2>Organisms</h2>
        <div className={shared.prose}>
          <p>With the foundations and base components in place, I moved on to the organism level of atomic design. At this stage, I assembled higher-level composite components such as cards, sidebars, headers, and pagination.</p>
          <p>All organisms support both light and dark themes.</p>
        </div>
        <div className={styles.screens}>
          <Screen name="file-upload" alt="File upload dialog in light and dark themes" />
          <Screen name="navigation" alt="Sidebar navigation states and the multi-wallet account switcher" />
          <Screen name="notifications" alt="Notification center and transaction flow components" />
          <Screen name="wallet-modals" alt="Wallet modals with network selection in light and dark themes" />
        </div>
      </section>

      <section id="results" className={`${shared.divided} ${styles.results}`}>
        <h2>Outcomes and learnings</h2>
        <Metrics />
        <div className={shared.prose}>
          <p>I built a scalable, structured design foundation aligned with the frontend implementation, improving consistency and long-term maintainability across the product.</p>
          <p>The system gained strong traction in the Figma Community, validating its relevance beyond internal use and contributing to the broader Web3 design ecosystem.</p>
          <p>This project significantly strengthened my expertise in building complex design systems and structuring scalable workflows.</p>
        </div>
      </section>
  </CaseStudyLayout>;
}

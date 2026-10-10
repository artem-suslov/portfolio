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
import styles from "./trading-case.module.css";
// Same file as the home page cover, imported so the URL carries a content hash.
import heroScreen from "../../../../public/images/tradingbot_thumb_case.png";

const assets = "/images/steamify-trading-case";
const caseId = "steamify-trading-bot";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "about-product", label: "About product" },
  { id: "idea-and-problem", label: "Idea and problem" },
  { id: "process", label: "Process" },
  { id: "success-metrics", label: "Success metrics" },
  { id: "overview-page", label: "Overview page" },
  { id: "profiles", label: "Profiles" },
  { id: "prices", label: "Prices" },
  { id: "results", label: "Outcomes and learnings" },
];

const meta = [
  { label: "Scope", value: "UI/UX Design, Product Strategy" },
  { label: "Timeline", value: "2023 – 2024" },
  { label: "Tags", value: "B2C, Web App, Design System" },
];

// Screens are 2560×1396 exports of the Figma file.
function Screen({ alt, name, preload }: { alt: string; name: string; preload?: boolean }) {
  return <CaseImage caseId={caseId} className={shared.media} src={`${assets}/${name}.jpg`} width={2560} height={1396} preload={preload} alt={alt} />;
}

// Square close-ups, shown side by side.
function Detail({ alt, name }: { alt: string; name: string }) {
  return <CaseImage caseId={caseId} className={shared.media} src={`${assets}/${name}.jpg`} width={1280} height={1280} sizes="(max-width: 760px) calc(50vw - 24px), 310px" alt={alt} />;
}

function Metrics() {
  return <dl className={styles.metrics}>
    <div><dt>Steamify users in beta</dt><dd>70</dd></div>
    <div><dt>TradeLab users</dt><dd>≈ 50</dd></div>
    <div><dt>TradeOn users</dt><dd>≈ 40</dd></div>
  </dl>;
}

export function TradingCase() {
  return <CaseStudyLayout sections={sections}>
      <CaseOverview eyebrow="Steamify · B2C, Web App" title={<>Steam trading <br />management dashboard</>}>
        <CaseMorph slug="steamify-trading-bot">
          <CaseImage expandable={false} caseId={caseId} className={shared.media} src={heroScreen.src} width={heroScreen.width} height={heroScreen.height} preload alt="Steam trading management dashboard overview" />
        </CaseMorph>
        <CaseMeta items={meta} />
      </CaseOverview>

      <section id="about-product" className={shared.divided}>
        <h2>About product</h2>
        <p>Steamify is a web automation tool for Steam traders. Buy and sell items, track analytics, set price thresholds, monitor competitor prices, and more. It supports platforms like MarketCSGO, Waxpeer, ShadowPay, Buff, and others.</p>
      </section>

      <section id="idea-and-problem" className={`${shared.divided} ${shared.spacious}`}>
        <h2>Idea and problem</h2>
        <div className={shared.block}>
          <CaseLabel prominent>Market</CaseLabel>
          <p>There were only two bots available on the market.</p>
        </div>
        <div className={shared.block}>
          <CaseLabel prominent>Problem</CaseLabel>
          <p>Based on our analysis, the key issues we aimed to address were:</p>
          <ul>
            <li>Inconvenient and non-transparent account management.</li>
            <li>An unintuitive and uncomfortable user interface.</li>
            <li>No item-level analytics.</li>
            <li>Limited platform integrations for trading.</li>
          </ul>
        </div>
        <p>Competitors also tended to be passive in engaging with users and slow to respond to requests for product improvements.</p>
      </section>

      <section id="process" className={shared.divided}>
        <h2>Process</h2>
        <div className={shared.prose}>
          <p>While the CEO and I were in Thailand, we worked closely on the project on a daily basis. The pace felt similar to a hackathon — we made decisions quickly, iterated fast, and constantly refined the product together.</p>
          <p>At times, discussions were intense and complex, and misunderstandings naturally arose in such a fast-moving environment. In situations where we had different perspectives, I took ownership of validating ideas through user experience principles, business impact, and feasibility.</p>
          <p>This helped us evaluate options objectively and make aligned decisions. Ultimately, we always found common ground, clarified priorities, and moved forward with a shared vision.</p>
        </div>
        <div className={styles.screens}>
          <Screen name="login" alt="Steamify sign-in screen next to the Profiles page" />
          <div className={styles.details}>
            <Detail name="sidebar" alt="Sidebar navigation: Overview, Transactions, Profiles, Items, Steam accounts, Proxies and Items valuation" />
            <Detail name="status-cards" alt="Profile status cards: profiles in use, In progress, Inactive, Error and Done" />
          </div>
          <Screen name="user-profile" alt="User profile settings with security options and Steam, Telegram, Discord and Metamask integrations" />
        </div>
      </section>

      <section id="success-metrics" className={shared.divided}>
        <h2>How did we measure success?</h2>
        <div className={shared.prose}>
          <p>We evaluated product success with two core metrics: user growth and user feedback.</p>
          <p>As market benchmarks, we only had visibility into our competitors’ user numbers. As of March 3, 2024, we had already surpassed TradeOn, reaching 70 users in beta.</p>
        </div>
        <Metrics />
        <p>We measured qualitative performance through direct chat feedback. User responses were highly positive, with strong engagement and satisfaction signals.</p>
      </section>

      <section id="overview-page" className={shared.divided}>
        <h2>Overview</h2>
        <div className={shared.prose}>
          <p>The Overview page consists of two main sections: Widgets and Sales.</p>
          <p>The Widgets section functions as a centralized dashboard, displaying key performance indicators across all Steam accounts connected to Steamify. Users can filter data by selecting a specific time range via the integrated calendar, enabling more flexible performance analysis.</p>
          <p>The Sales section provides a complete sales history. Each transaction is assigned one of four statuses: Waiting, Retry, In Process, or Accepted, allowing users to clearly track the progress of their sales.</p>
          <p>All data updates in real time via WebSocket integration, ensuring immediate status changes and a responsive user experience.</p>
        </div>
        <div className={styles.screens}>
          <Screen name="overview-widgets" alt="Overview widgets: items sold, volume chart, balances, all items and all items cost" />
          <Screen name="overview-sales" alt="Sales history with marketplace, profile and status for each transaction, next to the Overview widgets" />
        </div>
      </section>

      <section id="profiles" className={shared.divided}>
        <h2>Profiles</h2>
        <div className={shared.prose}>
          <p>Profiles represent the bots responsible for selling users’ items. Each profile can have one of four statuses: Error, In Progress, Inactive or Done.</p>
          <p>Each profile displays key operational data, including current balance, total revenue from sales, estimated inventory value, total number of items, as well as API key and proxy status — ensuring transparency and control over the selling process.</p>
        </div>
        <Screen name="profiles" alt="Profiles page with bots grouped by status, showing balance, amount, items, API status and proxy" />
      </section>

      <section id="prices" className={shared.divided}>
        <h2>Prices</h2>
        <div className={shared.prose}>
          <p>On this page, users define minimum and maximum pricing thresholds for their items. Each item’s uniqueness is visually emphasized through background color coding, reflecting rarity standards familiar to Steam traders and improving quick recognition.</p>
          <p>One of our key features is a contextual drawer that includes a sales chart and order book, enabling users to make data-driven pricing decisions.</p>
          <p>To address cases where users own multiple similar items that differ in stickers, wear level, or other attributes affecting value, we introduced a structured subtable. This view provides detailed item-level information, allowing for more precise pricing and better inventory management.</p>
        </div>
        <div className={styles.screens}>
          <Screen name="prices" alt="Prices page with min–max thresholds and the analytics drawer showing the sales chart and sales history" />
          <Screen name="auto-prices" alt="Auto-prices dialog for setting minimum and maximum prices as a percentage of a price service" />
        </div>
      </section>

      <section id="results" className={shared.divided}>
        <h2>Outcomes and learnings</h2>
        <div className={shared.prose}>
          <p>Working in a fast-paced, hackathon-like environment taught me to prioritize momentum over perfection — shipping fast, validating early, and continuously improving based on feedback rather than overpolishing initial solutions.</p>
          <p>I enhanced my communication within the team by clearly articulating and confidently advocating for design decisions, ensuring they were aligned with user needs, business objectives, and technical feasibility.</p>
          <p>I deepened my frontend knowledge, which improved collaboration with engineers and allowed me to communicate in the same technical language. This enabled me to contribute to decisions around UI libraries and component architecture — for example, integrating the <TextLink href="https://sonner.emilkowal.ski/">Sonner</TextLink> library to enhance system feedback and interaction clarity.</p>
        </div>
      </section>
  </CaseStudyLayout>;
}

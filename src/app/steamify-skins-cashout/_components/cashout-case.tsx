import {
  CaseLabel,
  CaseMeta,
  CaseOverview,
  CaseStudyLayout,
} from "@/components/case-study/case-study-layout";
import { CaseImage } from "@/components/case-study/case-media";
import shared from "@/components/case-study/case-study.module.css";
import styles from "./cashout-case.module.css";

const assets = "/images/steamify-case-v2";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "about-product", label: "About product" },
  { id: "understanding-the-task", label: "Understanding the Task" },
  { id: "discovery", label: "Usability Testing" },
  { id: "hypotheses-and-solutions", label: "Hypotheses and solutions" },
  { id: "before-after", label: "Before/After" },
  { id: "ab-testing-offers", label: "A/B Testing Offers" },
  { id: "results", label: "Results" },
];

const meta = [
  { label: "Team", value: "CEO, Backend Dev, Frontend Dev, Product Designer (me)" },
  { label: "My role", value: "Product Design, Research, Design System, Handoff, Design Review, Analytics" },
  { label: "Timeline", value: "March, 2025" },
];

function Metrics() {
  return <dl className={styles.metrics}>
    <div><dt>Web to Telegram conversion</dt><dd>20 → 50%</dd></div>
    <div><dt>Winning offer CTR in A/B test</dt><dd>85%</dd></div>
  </dl>;
}

export function CashoutCase() {
  return <CaseStudyLayout sections={sections}>
      <CaseOverview eyebrow="Steamify · B2C, eCom" title={<>How I turned payout waiting into <br />Telegram conversion</>}>
        <CaseImage caseId="steamify-cashout" className={shared.media} src={`${assets}/steamify_before_after.png`} width={1472} height={720} sizes="(max-width: 760px) calc(100vw - 32px), 636px" preload alt="Before and after Steamify payout screens, showing the Telegram offer introduced earlier in the flow" />
        <CaseMeta items={meta} />
      </CaseOverview>

      <section id="about-product" className={shared.divided}>
        <h2>About product</h2>
        <p>Steamify is an ecosystem for gamers. This case study focuses on Skins Cash Out: a service that helps players sell skins for real money and receive payouts to a bank card or in cryptocurrency.</p>
      </section>

      <section id="understanding-the-task" className={`${shared.divided} ${shared.spacious}`}>
        <h2>Understanding the Task</h2>
        <div className={shared.block}>
          <CaseLabel prominent>Problem</CaseLabel>
          <div className={shared.prose}>
            <p>New users arriving through SEO needed to move to Telegram before their payout was complete. Without the bot, we couldn’t send order updates or bring people back to the product. Traffic landed on the website, but the bot link appeared only at the end of the skin-selling flow, about 10 minutes later, once we had sent the payout.</p>
            <p>Users who left before that step never reached Telegram. Conversion stayed at 20%.</p>
          </div>
        </div>
        <div className={shared.block}>
          <CaseLabel prominent>Task</CaseLabel>
          <p>Increase the share of new web users who join the Telegram bot before completing a sale, so we can send order updates and bring them back through notifications, promotions, and promo codes.</p>
        </div>
        <div className={shared.block}>
          <CaseLabel prominent>Constraints</CaseLabel>
          <ul>
            <li>Most traffic comes from SEO to the website, with no on-site notifications.</li>
            <li>The audience is in Russia, making Telegram the main retention channel.</li>
            <li>The existing skin-selling and payout flow must remain intact.</li>
            <li>The bot link needs to appear before the final step, without interrupting users who are already buying or selling.</li>
          </ul>
        </div>
      </section>

      <section id="discovery" className={shared.divided}>
        <h2>Usability Testing</h2>
        <div className={shared.block}>
          <div className={shared.prose}>
            <p>I ran usability tests with 7 participants, asking them to complete the item-selling flow. All sessions were remote, with screen sharing, and took place over 2 days.</p>
            <div>
              <p>What I learned:</p>
              <ul>
                <li>6 of 7 participants never reached the final screen, where the main call to action invited them to open Telegram and claim cashback.</li>
                <li>Users left at “Payout in progress” because they thought the process was complete.</li>
                <li>At that point, they didn’t want to wait and saw no reason to stay on the screen.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="hypotheses-and-solutions" className={`${shared.divided} ${styles.hypotheses}`}>
        <h2>Hypotheses and solutions</h2>
        <p>Based on the testing, I developed several hypotheses:</p>
        <ul className={styles.hypothesisList}>
          <li>Showing the Telegram entry point while users wait for a payout will encourage more of them to connect the bot before the flow ends.</li>
          <li>Explaining Telegram’s value through status updates and notifications will make joining the bot feel like part of the process, rather than an extra step.</li>
          <li>Offering a bonus for joining Telegram will give users an additional reason to open the bot.</li>
          <li>Introducing Telegram earlier will help bring users back through status updates, notifications, and follow-up offers.</li>
        </ul>
      </section>

      <section className={shared.block}>
        <CaseLabel>Solution</CaseLabel>
        <ul>
          <li>Add a Telegram entry point to the payout waiting step.</li>
          <li>Communicate its value through updates, notifications, and a joining bonus.</li>
          <li>Keep Telegram on the final screen as an additional entry point.</li>
          <li>Integrate the offer without disrupting the skin-selling flow.</li>
        </ul>
      </section>

      <section id="before-after" className={`${shared.divided} ${styles.comparison}`} aria-labelledby="before-after-heading">
        <h2 id="before-after-heading">Before/After</h2>
        <figure className={shared.block}>
          <figcaption className={styles.caption}>Before: Telegram appeared only after the payout was complete, when some users had already left the page.</figcaption>
          <CaseImage caseId="steamify-cashout" className={shared.media} src={`${assets}/steamify_before.png`} width={1470} height={802} sizes="(max-width: 760px) calc(100vw - 32px), 636px" alt="Before: two payout screens. The main Telegram CTA appears only after payout completion." />
        </figure>
        <figure className={`${shared.block} ${styles.after}`}>
          <figcaption className={styles.caption}>After: Telegram appeared earlier, while users waited for their payout, becoming a channel for updates and follow-ups.</figcaption>
          <CaseImage caseId="steamify-cashout" className={shared.media} src={`${assets}/steamify_after.png`} width={1478} height={807} sizes="(max-width: 760px) calc(100vw - 32px), 636px" alt="After: the free-skin CTA stays visible during payout waiting and after completion." />
        </figure>
      </section>

      <section id="ab-testing-offers" className={shared.divided}>
        <h2>A/B Testing Offers</h2>
        <div className={shared.prose}>
          <p>After launching the updated flow, we tested two button offers on the payout screen to learn which one was more effective at motivating users to open Telegram.</p>
          <ul>
            <li>A reward-led offer: a free skin and cashback.</li>
            <li>A utility-led offer: tracking payout status.</li>
          </ul>
          <p>The test ran for 1.5 weeks with a 50/50 traffic split. Together, the two offers received approximately 1,500–2,000 impressions.</p>
          <p>The reward-led offer performed best, with an 85% CTR, and became our primary message.</p>
        </div>
        <CaseImage caseId="steamify-cashout" className={shared.media} src={`${assets}/AB_test.png`} width={1472} height={720} sizes="(max-width: 760px) calc(100vw - 32px), 636px" alt="A/B test: offer A, Get free skin, achieved approximately 85% CTR. Offer B, Open Telegram to track a payout, had a lower CTR." />
      </section>

      <section id="results" className={`${shared.divided} ${styles.results}`}>
        <h2>Results</h2>
        <Metrics />
        <div className={shared.block}>
          <CaseLabel>What worked</CaseLabel>
          <ul><li>Introducing Telegram earlier in the skin-selling flow.</li><li>Offering a direct reward: a free skin and cashback.</li></ul>
        </div>
        <div className={shared.block}>
          <CaseLabel>What didn’t work</CaseLabel>
          <ul><li>An offer focused only on tracking payouts: users didn’t see it as a compelling enough reason to open Telegram.</li></ul>
        </div>
      </section>
  </CaseStudyLayout>;
}

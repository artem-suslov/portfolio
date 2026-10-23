import {
  CaseMeta,
  CaseOverview,
  CaseStudyLayout,
} from "@/components/case-study/case-study-layout";
import { CaseMorph } from "@/components/case-study/case-morph";
import shared from "@/components/case-study/case-study.module.css";
import { TextLink } from "@/components/ui/text-link";
import { AnimatorSlider } from "./animator-slider";
import styles from "./animator-case.module.css";
import {
  AnimatorClip,
  AnimatorFlow,
  AnimatorHeroVideo,
  AnimatorMetrics,
  CaseImage,
} from "./animator-case-parts";

const railSections = [
  { id: "overview", label: "Overview" },
  { id: "about-product", label: "Product" },
  { id: "understanding-the-task", label: "Problem" },
  { id: "user-flow", label: "User flow" },
  { id: "mvp", label: "MVP flow" },
  { id: "editing-panel", label: "Settings panel" },
  { id: "interface-and-presets", label: "Presets" },
  { id: "authentication", label: "Sign-in" },
  { id: "feedback", label: "Feedback" },
  { id: "decisions", label: "Trade-offs" },
  { id: "results", label: "Results" },
] as const;

const meta = [
  { label: "Role", value: "Design Engineer, solo" },
  { label: "Built in", value: "~2 weeks with Codex" },
  { label: "Status", value: "Live, 165 exports" },
];

const panelScreens = [
  { alt: "Animator settings", name: "01.png", width: 2914, height: 1666 },
  { alt: "Animator settings", name: "02.png", width: 2914, height: 1666 },
  { alt: "Animator settings", name: "05.png", width: 2914, height: 1666 },
];

const dataScreens = [
  { alt: "Yandex Metrica traffic since launch: 1,116 users, 3 min 24 s on site, 31.45% bounce rate", name: "metrics.png", width: 4491, height: 1361 },
  { alt: "Supabase profiles table: 81 accounts, emails blurred", name: "users.png", width: 3909, height: 2130 },
  { alt: "Supabase renders table: one row per successful export", name: "renders.png", width: 3909, height: 2130 },
];

export function AnimatorCaseContent() {
  return (
    <CaseStudyLayout sections={railSections}>
      <CaseOverview eyebrow="Animator · Creator tool" title="Animator: a looping MP4 tool I designed and built with AI">
        <CaseMorph slug="animator">
          <AnimatorHeroVideo />
        </CaseMorph>
        <CaseMeta items={meta} />
      </CaseOverview>

      <section className={shared.divided} id="about-product">
        <h2>Screenshots in, looping MP4 out</h2>
        <p>
          Animator is a browser tool: you drop in up to ten interface
          screenshots, pick how they move, and download a looping MP4.{" "}
          <TextLink href="https://getanimator.xyz/">Try it live</TextLink> or{" "}
          <TextLink href="https://youtu.be/d9Nve2VaHQ4?si=Jy_Wdt_buRd10kKW">
            watch how I built it
          </TextLink>
          .
        </p>
      </section>

      <section className={shared.divided} id="understanding-the-task">
        <h2>Problem</h2>
        <p>
          I edit YouTube videos and write posts for my Telegram channel, and I
          kept wanting interface screens to move instead of sitting there as
          static screenshots. Each time that meant laying out screens and
          keyframes by hand in Figma or a video editor, which took far too long
          for a few seconds of footage.
        </p>
        <p>
          What I wanted was simpler: upload the screens, pick the motion, get a
          finished loop.
        </p>
      </section>

      <section className={shared.divided} id="user-flow">
        <h2>First, the main user flow</h2>
        <p>
          Before writing a single prompt, I drew the flow in FigJam. You upload
          images and set the preset, image size, speed, and gap between
          screens; on export you choose quality and frame rate and check how
          big the MP4 will be, and then the browser renders the loop.
        </p>
        <CaseImage
          alt="Core user flow: upload images, adjust settings, export, render, and get a looping MP4"
          height={1530}
          name="user-flow.png"
          width={3486}
        />
      </section>

      <section className={shared.divided} id="mvp">
        <h2>MVP: three steps instead of a video editor</h2>
        <p>
          The quickest way to never ship this was to start rebuilding After
          Effects, so I cut the flow down to three steps:
        </p>
        <AnimatorFlow steps={["Upload images", "Adjust motion", "Export MP4"]} />
        <p>
          Music, dozens of presets, project saving, and a second export format
          all waited until after launch.
        </p>
      </section>

      <section className={shared.divided}>
        <h2>First prototype, built with Codex</h2>
        <p>
          I didn&apos;t try to make the first version pretty. I only needed to
          know that someone could upload images, set up the carousel, and walk
          away with a video.
        </p>
        <p>
          My first prompt to Codex had the flow diagram, the problem, and how I
          pictured the answer: a studio layout with presets on the left, the
          preview in the middle, and settings on the right.
        </p>
        <CaseImage alt="The first Animator interface" name="04.png" />
        <p>
          It came out pretty sloppy, with colors that were far too bright, crude
          controls, and a few small bugs, but the whole path from upload to
          download already worked.
        </p>
        <p>
          Everything renders in the browser. Canvas draws each frame, WebCodecs
          encodes the frames to H.264, and mp4-muxer wraps them into an MP4, so
          nobody&apos;s images ever go to a server.
        </p>
        <p>
          I tested the whole path before moving on, and it held up: images
          uploaded, the carousel played, and the MP4 downloaded.
        </p>
      </section>

      <section className={shared.divided} id="editing-panel">
        <h2>Settings panel: from DialKit to ToolCraft</h2>
        <p>
          Next came the settings panel on the right. I wanted every control to
          be compact and to show its effect right away, so you&apos;d know what
          it changes without reading the label twice.
        </p>
        <p>
          I started with{" "}
          <TextLink href="https://joshpuckett.me/dialkit">DialKit</TextLink>, a
          library for tuning animation and effect parameters. Its controls were
          too big for my layout, though, and the panel got so tall that people
          would have had to scroll through it all the time.
        </p>
        <p>
          Then I remembered{" "}
          <TextLink href="https://toolcraft.sh/">ToolCraft</TextLink>, which
          the Pixel Point team had shown off: an open-source kit of sliders,
          selects, segmented controls, and other inputs for animation and
          effect settings. I gave Codex its GitHub repository and, over the
          next iterations, asked for specific components in specific places.
          The panel below is what came out of that; I kept tuning it
          afterwards, but its structure stayed.
        </p>
        <AnimatorSlider images={panelScreens} labels={{ next: "Next screenshot", previous: "Previous screenshot", slider: "Settings panel screenshots" }} />
      </section>

      <section className={shared.divided} id="interface-and-presets">
        <h2>Presets with previews and iPhone frames</h2>
        <p>
          Once the first version worked, I reorganised the editor. Presets got
          previews in the left panel, so you see the motion before you pick it.
        </p>
        <p>
          Image uploads and background settings moved to the right, along with
          ready-made wallpapers, an iPhone frame, and automatic corner rounding
          that makes phone screenshots look right without any tweaking. I also
          cut shadows down to a few presets instead of a full set of controls.
        </p>
        <AnimatorClip label="The reworked editor: presets with previews on the left, uploads and background settings on the right" src="/videos/sidebar.mp4?v=20261023" />
      </section>

      <section className={shared.divided} id="authentication">
        <h2>Sign-in only before export</h2>
        <p>
          At first, sign-in came before everything: you couldn&apos;t upload an
          image or see a preview until you&apos;d entered an email.
        </p>
        <CaseImage
          alt="The first Animator version opened on a sign-in screen"
          height={1481}
          name="login-first.png"
          width={2363}
        />
        <p>
          Technically it worked. As a product decision it was weak, because a
          new tool nobody had heard of asked for an email before showing
          anything useful.
        </p>
        <p>
          So I moved sign-in into a modal that only appears when you export or
          send feedback; until then the whole editor is open.
        </p>
        <CaseImage
          alt="Animator asks for an email only when someone exports"
          height={1419}
          name="login-seconda.png"
          width={2606}
        />
        <p>
          Sign-in uses Magic Link: you type your email, get a link, and
          you&apos;re in without a password.{" "}
          <TextLink href="https://supabase.com/">Supabase</TextLink> handles
          accounts and data, and Resend delivers the emails.
        </p>
      </section>

      <section className={shared.divided} id="feedback">
        <h2>Feedback after the first render</h2>
        <p>
          The feedback prompt shows up right after a successful render, when
          someone has been through the whole flow and has a video in hand.
          That&apos;s the moment two questions are easy to answer: what the
          video is for, and what got in the way.
        </p>
        <CaseImage
          alt="Feedback dialog after export: what the video is for and what could be better"
          height={1091}
          name="feedback.webp"
          width={2000}
        />
        <p>
          Answers land in a Supabase table, 23 so far. I read through them and
          turned the concrete ones into tasks for Codex: people asked for
          iPhone mockups and reported images freezing and flickering during
          playback, and both are fixed now.
        </p>
        <CaseImage
          alt="Supabase feedback table with user messages and what each video was exported for"
          height={2130}
          name="feedback.png"
          width={3909}
        />
      </section>

      <section className={shared.divided}>
        <h2>Emails from the new domain landed in spam</h2>
        <p>
          Email took more effort than the animation did. Supabase&apos;s
          built-in mail sends only two emails an hour, which is fine for
          testing and useless once real people sign up, so I bought a domain,
          set up its DNS records, and connected{" "}
          <TextLink href="https://resend.com/">Resend</TextLink> as a custom
          SMTP service. For a while, some sign-in emails from the new domain
          still went to spam.
        </p>
      </section>

      <section className={shared.divided} id="decisions">
        <h2>Trade-offs</h2>
        <ul className={styles.tradeoffs}>
          <li>
            <strong>Magic Link instead of Google sign-in.</strong> A recent
            Russian law rules out Google sign-in for sites like mine, so people
            take one extra step and open an email.
          </li>
          <li>
            <strong>Rendering in the browser, not on a server.</strong>{" "}
            There&apos;s no server bill and images never leave the user&apos;s
            computer; the catch is that export speed depends on their machine.
          </li>
          <li>
            <strong>Analytics count successful exports, not visits.</strong>{" "}
            Emails, files, and images never reach analytics.
          </li>
          <li>
            <strong>One feedback form instead of a chat.</strong> Messages go
            straight into the database, where repeats are easy to spot.
          </li>
          <li>
            <strong>MP4 only, with just quality and frame rate in export.</strong>{" "}
            WebM is lighter and better for websites, but a second format meant
            more settings and more to test in the first version.
          </li>
        </ul>
      </section>

      <section className={shared.divided} id="results">
        <h2>81 sign-ups and 165 exports since launch</h2>
        <AnimatorMetrics
          items={[
            { label: "Users", value: "~1,100" },
            { label: "Sign-ups", value: "81" },
            { label: "MP4 exports", value: "165" },
          ]}
        />
        <AnimatorSlider images={dataScreens} labels={{ next: "Next screenshot", previous: "Previous screenshot", slider: "Animator data screenshots" }} />
        <p>
          Animator runs on its own domain, and I use it for my own videos.
          About 300 people came in the first three days from my YouTube,
          Telegram, Threads, and LinkedIn channels; on average they stay 3 min
          24 s, and the bounce rate is 31.5%.
        </p>
      </section>
    </CaseStudyLayout>
  );
}

import {
  CaseLabel,
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
  { label: "Team", value: "Solo project" },
  { label: "My role", value: "Product Design, Design System, Frontend Development" },
  { label: "Timeline", value: "2026" },
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
      <CaseOverview eyebrow="Animator · Creator tool" title="Animator: a tool for creating looping MP4 showcases">
        <CaseMorph slug="animator">
          <AnimatorHeroVideo />
        </CaseMorph>
        <CaseMeta items={meta} />
      </CaseOverview>

      <section className={shared.divided} id="about-product">
        <h2>Screenshots in, looping MP4 out</h2>
        <p>
          Animator is a web tool for uploading a set of images, choosing a
          motion preset, and quickly exporting a looping carousel as an MP4.{" "}
          <TextLink href="https://getanimator.xyz/">Try it live</TextLink>.
        </p>
      </section>

      <section className={shared.divided} id="understanding-the-task">
        <h2>Problem</h2>
        <p>
          I often edit videos for YouTube and create posts for Telegram. I
          need visually engaging looping galleries to showcase interface
          screens in motion. They make product moments easier to understand
          and give video and social content a more polished feel.
        </p>
        <p>
          Static screenshots were not enough, but manually animating screens
          in Figma Motion, After Effects, or a video editor took too much
          time.
        </p>
        <p>
          I wanted a simple tool: upload screens, choose a motion preset, and
          immediately get a finished looping MP4.
        </p>
      </section>

      <section className={shared.divided} id="user-flow">
        <h2>First, the main user flow</h2>
        <p>
          I started with the flow, before any code, and drew it in FigJam. You
          upload images and adjust the settings: preset, image size, speed,
          and the gap between screens. Then you export, picking quality and
          frame rate and checking the MP4 size, and the app renders a looping
          video.
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
          The main mistake in projects like this is trying to build a full
          video editor from day one. So I cut the flow down to three steps:
        </p>
        <AnimatorFlow steps={["Upload images", "Adjust motion", "Export MP4"]} />
        <p>
          At launch, I deliberately left out advanced formats, dozens of
          presets, project saving, and other secondary features.
        </p>
      </section>

      <section className={shared.divided}>
        <h2>First prototype, built with Codex</h2>
        <p>
          At first my goal was simple: build a working prototype without
          trying to make the interface perfect. What mattered was testing the
          main user path: upload images, set up the carousel, and get a video.
        </p>
        <p>
          I built the first prototype with Codex. In the initial prompt, I
          included the flow diagram, described the problem and the expected
          solution. I pictured the product as a studio: presets on the left,
          video preview in the center, and a settings panel on the right.
        </p>
        <CaseImage alt="The first Animator interface" name="04.png" />
        <p>
          Visually, the first version came out pretty sloppy: colors that were
          too bright, basic solutions, and a few small bugs. But the main flow
          already worked from start to finish.
        </p>
        <p>
          Rendering happens entirely in the browser. Canvas assembles the
          animation frame by frame, WebCodecs encodes those frames, and
          mp4-muxer packages them into an MP4. Images never need to be sent
          to a separate rendering server.
        </p>
        <p>
          I tested the whole path after that, and everything worked: images
          uploaded, the carousel played, and the MP4 exported.
        </p>
      </section>

      <section className={shared.divided} id="editing-panel">
        <h2>Settings panel: from DialKit to ToolCraft</h2>
        <p>
          Next I took on the right-hand settings panel. I wanted every control
          to be compact and give clear feedback, so it&apos;s obvious what it
          changes without any explanation.
        </p>
        <p>
          First I tried{" "}
          <TextLink href="https://joshpuckett.me/dialkit">DialKit</TextLink>,
          a library for tuning animation and effect parameters. Its look
          didn&apos;t suit me, though: the controls felt too large, and the
          panel was hard to fit into my interface. I didn&apos;t want it so
          tall that people would have to keep scrolling.
        </p>
        <p>
          Then I remembered{" "}
          <TextLink href="https://toolcraft.sh/">ToolCraft</TextLink>, which
          the Pixel Point team had shown. It&apos;s an open-source set of
          controls for animations, effects, and other parameters: sliders,
          selects, segmented controls, and more.
        </p>
        <p>
          I found its GitHub repository, gave it to Codex, and in later
          iterations asked it to use specific components for specific jobs.
          This is the panel that came out of it. I kept refining it later,
          but the core structure and logic stayed the same.
        </p>
        <AnimatorSlider images={panelScreens} labels={{ next: "Next screenshot", previous: "Previous screenshot", slider: "Settings panel screenshots" }} />
      </section>

      <section className={shared.divided} id="interface-and-presets">
        <h2>Presets with previews and iPhone frames</h2>
        <p>After the first version, I reworked the editor structure.</p>
        <p>
          The left panel gained presets with previews, so users could
          understand the result before choosing an animation.
        </p>
        <p>
          I moved image uploads and background controls to the right panel. I
          also added ready-made wallpapers, an iPhone format, and automatic
          corner rounding so mobile screens looked natural immediately.
        </p>
        <p>
          I limited shadow selection to a few clear options. It is a small
          decision, but it keeps the interface from becoming unnecessarily
          complex.
        </p>
        <AnimatorClip label="The reworked editor: presets with previews on the left, uploads and background settings on the right" src="/videos/sidebar.mp4" />
      </section>

      <section className={shared.divided} id="authentication">
        <h2>Sign-in only before export</h2>
        <p>
          Initially, I put authentication before the product. Users could not
          upload images or preview animation until they entered an email
          address.
        </p>
        <CaseImage
          alt="The first Animator version opened on a sign-in screen"
          height={1481}
          name="login-first.png"
          width={2363}
        />
        <p>
          It worked technically, but it was a weak product decision. Because
          the service was new and unfamiliar, I was blocking users from the
          first useful interaction with an authentication screen.
        </p>
        <p>
          I changed the flow. Users can explore the interface and try the
          basic path without signing in. Authentication is only required
          before export or feedback submission.
        </p>
        <CaseImage
          alt="Animator asks for an email only when someone exports"
          height={1419}
          name="login-seconda.png"
          width={2606}
        />
        <p>
          For sign-in, I chose Magic Link: a user enters an email address,
          receives a link, and signs in without a password.{" "}
          <TextLink href="https://supabase.com/">Supabase</TextLink>{" "}
          handles authentication and data storage, while Resend delivers
          email through the configured mail service.
        </p>
      </section>

      <section className={shared.divided} id="feedback">
        <h2>Feedback after the first render</h2>
        <p>
          I also thought about when to ask for feedback. Animator asks right
          after a successful render, once someone has gone through the whole
          core flow and has a finished video in hand.
        </p>
        <p>
          At that point the questions are easy to answer: what the video is
          for, and what worked or didn&apos;t along the way.
        </p>
        <CaseImage
          alt="Feedback dialog after export: what the video is for and what could be better"
          height={1091}
          name="feedback.webp"
          width={2000}
        />
      </section>

      <section className={shared.divided}>
        <h2>Emails from the new domain landed in spam</h2>
        <p>
          The most surprising work was not the animation itself, but the
          infrastructure around it.
        </p>
        <p>
          Default email delivery had limits, and some messages from the new
          domain landed in spam. I had to buy a domain, configure DNS
          records, and connect{" "}
          <TextLink href="https://resend.com/">Resend</TextLink> as a
          separate SMTP service.
        </p>
      </section>

      <section className={shared.divided} id="decisions">
        <h2>Trade-offs</h2>
        <ul className={styles.tradeoffs}>
          <li>
            <strong>Magic Link instead of Google sign-in.</strong> A new law
            bars Russian sites from Google sign-in, so people take one extra
            step and open an email.
          </li>
          <li>
            <strong>Rendering in the browser, not on a server.</strong>{" "}
            No server costs, and images never leave the user&apos;s computer. The
            catch is that export speed depends on their machine.
          </li>
          <li>
            <strong>Analytics count successful exports, not visits.</strong>{" "}
            Emails, files, and images never reach analytics.
          </li>
          <li>
            <strong>One feedback form instead of a chat.</strong> Messages go
            straight to the database, where repeated problems are easy to
            spot.
          </li>
          <li>
            <strong>MP4 only, with just quality and frame rate in export.</strong>{" "}
            WebM is lighter and suits websites, but a second format meant more
            settings and more test cases for the first version.
          </li>
        </ul>
      </section>

      <section className={shared.divided} id="results">
        <h2>80 sign-ups and 164 exports since launch</h2>
        <AnimatorMetrics
          items={[
            { label: "Users", value: "~1,100" },
            { label: "Sign-ups", value: "80" },
            { label: "MP4 exports", value: "164" },
          ]}
        />
        <AnimatorSlider images={dataScreens} labels={{ next: "Next screenshot", previous: "Previous screenshot", slider: "Animator data screenshots" }} />
        <p>In the end, I built a working web service that lets people:</p>
        <ul>
          <li>Upload interface screenshots</li>
          <li>Choose a motion preset</li>
          <li>Adjust animation parameters</li>
          <li>Preview the result on the canvas</li>
          <li>Export an MP4 video</li>
          <li>Leave feedback inside the product</li>
        </ul>
        <p>
          The service is deployed on its own domain and is already part of my
          video-making workflow. Around 300 visitors came in the first three
          days through my own YouTube, Telegram, Threads, and LinkedIn
          channels. Visitors stayed for 3 min 24 s on average, with a 31.5%
          bounce rate.
        </p>
        <div className={shared.block}>
          <CaseLabel>What I learned</CaseLabel>
          <ul>
            <li>
              For the first time, I used AI to build working authentication
              with users stored in a database.
            </li>
            <li>
              I implemented Magic Link sign-in and configured my own SMTP
              server through Resend.
            </li>
          </ul>
        </div>
      </section>
    </CaseStudyLayout>
  );
}

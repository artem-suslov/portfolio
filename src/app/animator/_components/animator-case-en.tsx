import {
  CaseLabel,
  CaseMeta,
  CaseOverview,
  CaseStudyLayout,
} from "@/components/case-study/case-study-layout";
import Image from "next/image";
import shared from "@/components/case-study/case-study.module.css";
import { TextLink } from "@/components/ui/text-link";
import {
  AnimatorHeroVideo,
  CaseImage,
  ImageTriptych,
  imagePath,
} from "./animator-case-parts";
import styles from "./animator-case.module.css";

const railSections = [
  { id: "overview", label: "Overview" },
  { id: "about-product", label: "About product" },
  { id: "understanding-the-task", label: "Understanding the Task" },
  { id: "mvp", label: "MVP" },
  { id: "editing-panel", label: "Editing panel" },
  { id: "design-direction", label: "Design direction" },
  { id: "interface-and-presets", label: "Interface and presets" },
  { id: "authentication", label: "Authentication" },
  { id: "results", label: "Results" },
] as const;

const meta = [
  { label: "Team", value: "Solo project" },
  { label: "My role", value: "Product Design, Design System, Frontend Development" },
  { label: "Timeline", value: "2026" },
];

const triptych = [
  { alt: "Animator settings", name: "01.png", width: 508 },
  { alt: "Animator settings", name: "02.png", width: 508 },
  { alt: "Animator settings", name: "05.png", width: 495 },
];

export function AnimatorCaseContent() {
  return (
    <CaseStudyLayout sections={railSections}>
      <CaseOverview eyebrow="Animator · Creator tool" title="Animator: a tool for creating looping MP4 showcases">
        <AnimatorHeroVideo />
        <CaseMeta items={meta} />
      </CaseOverview>

      <section className={shared.divided} id="about-product">
        <h2>About product</h2>
        <p>
          Animator is a web tool for uploading a set of images, choosing a
          motion preset, and quickly exporting a looping carousel as an MP4.
        </p>
      </section>

      <section
        className={`${shared.divided} ${shared.spacious}`}
        id="understanding-the-task"
      >
        <h2>Understanding the Task</h2>
        <div className={shared.block}>
          <CaseLabel prominent>Context</CaseLabel>
          <p>
            I often edit videos for YouTube and create posts for Telegram. I
            need visually engaging looping galleries to showcase interface
            screens in motion. They make product moments easier to understand
            and give video and social content a more polished feel.
          </p>
        </div>
        <div className={shared.block}>
          <CaseLabel prominent>Problem</CaseLabel>
          <div className={shared.prose}>
            <p>
              Static screenshots were not enough, but manually animating
              screens in Figma Motion, After Effects, or a video editor took
              too much time.
            </p>
            <p>
              I wanted a simple tool: upload screens, choose a motion preset,
              and immediately get a finished looping MP4.
            </p>
          </div>
        </div>
      </section>

      <section className={shared.divided} id="mvp">
        <h2>I started by limiting the MVP</h2>
        <p>
          The main mistake in projects like this is trying to build a full
          video editor from day one. So I started with the core flow:
        </p>
        <p className={styles.emphasis}>
          Upload images → adjust motion → export MP4.
        </p>
        <p>
          Before development, I mapped the flow. It helped separate essential
          features from later additions: motion presets, screen spacing,
          speed, easing, quality, and frame rate.
        </p>
        <CaseImage alt="Animator core flow diagram" name="03.png" />
        <p>
          At launch, I deliberately left out advanced formats, dozens of
          presets, project saving, and other secondary features.
        </p>
      </section>

      <section className={shared.divided}>
        <h2>The first version: function before polish</h2>
        <p>
          I built the first prototype with Codex. In the initial prompt, I
          included the flow diagram, described the problem and the expected
          solution. I pictured the product as a studio: presets on the left,
          video preview in the center, and a settings panel on the right.
        </p>
        <CaseImage alt="The first Animator interface" name="04.png" />
        <p>
          The first version looked rough: overly bright colors, simple
          controls, and an imperfect composition. But it already solved the
          core task: users could upload images, preview the animation, and
          export a video.
        </p>
        <p>
          Rendering happens entirely in the browser. Canvas assembles the
          animation frame by frame, WebCodecs encodes those frames, and
          mp4-muxer packages them into an MP4. Images never need to be sent
          to a separate rendering server.
        </p>
      </section>

      <section className={shared.divided} id="editing-panel">
        <h2>The editing panel</h2>
        <p>
          I experimented with the right-side panel. First, I used{" "}
          <TextLink href="https://joshpuckett.me/dialkit">
            DialKit
          </TextLink>
          , a library for tuning animation parameters. It quickly provided
          working controls, but the panel itself was too large and did not
          adapt well to my interface.
        </p>
        <p>
          Then I tried building the controls from custom components. They
          felt disconnected, though, and polishing the interaction would have
          taken too much time.
        </p>
        <p>
          I eventually found{" "}
          <TextLink href="https://toolcraft.sh/">ToolCraft</TextLink>.
          Its sliders, selects, and other controls were flexible enough to
          create a more compact and cohesive editing panel.
        </p>
        <ImageTriptych images={triptych} />
      </section>

      <section className={shared.divided} id="design-direction">
        <h2>A little Figma before the prompts</h2>
        <p>
          Over time, I realised it was inefficient to explain visual
          direction to Codex through long prompts: colors, typography, sizes,
          and layout.
        </p>
        <p>
          So I quickly made a rough layout in Figma using another file with
          existing color tokens, type styles, and components. I then passed
          that layout to Codex through Figma MCP.
        </p>
        <CaseImage alt="Animator Figma layout" name="06.png" />
        <p>
          That gave the agent a clear visual direction and saved me dozens of
          messages about minor refinements.
        </p>
      </section>

      <section className={shared.divided} id="interface-and-presets">
        <h2>Interface and presets</h2>
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
        <CaseImage alt="Updated Animator interface" name="07.png" />
      </section>

      <section className={shared.divided} id="authentication">
        <h2>Authentication with Supabase and Resend</h2>
        <p>
          Initially, I put authentication before the product. Users could not
          upload images or preview animation until they entered an email
          address.
        </p>
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
        <p>
          For sign-in, I chose Magic Link: a user enters an email address,
          receives a link, and signs in without a password.{" "}
          <TextLink href="https://supabase.com/">Supabase</TextLink>{" "}
          handles authentication and data storage, while Resend delivers
          email through the configured mail service.
        </p>
        <Image
          alt="Authentication screen comparison"
          className={shared.media}
          height={298}
          src={`${imagePath}/08.png`}
          width={508}
        />
      </section>

      <section className={shared.divided}>
        <h2>Decisions I chose not to pursue</h2>
        <p>
          I considered adding WebM as a second export format. It is often
          smaller and well suited to the web, but it would have introduced
          more technical details and test cases to the first version.
        </p>
        <p>
          So I kept MP4 only. It is familiar to most users and solves the
          core problem. WebM can return later, once the primary flow is
          stable.
        </p>
        <p>
          The control panel followed a similar path. I tried an off-the-shelf
          library and then custom components. Both approaches made the
          interface feel too heavy, so I stopped polishing endlessly,
          rebuilt the panel, and chose a simpler set of controls.
        </p>
      </section>

      <section className={shared.divided}>
        <h2>What was harder than expected</h2>
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

      <section className={shared.divided} id="results">
        <h2>The outcome</h2>
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
          video-making workflow.
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
            <li>
              I brought in the first 300 users in three days through my own
              YouTube, Telegram, Threads, and LinkedIn channels.
            </li>
          </ul>
        </div>
      </section>
    </CaseStudyLayout>
  );
}

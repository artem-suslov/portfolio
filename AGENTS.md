<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Repo workflow

- The active app lives at the workspace root. Run app commands from `/Users/artemsuslov/Downloads/Design/Code/portfolio`, not from `portfolio-app/`.
- Use the root scripts for validation and serving: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- There is no separate root test script or Playwright config right now; for pre-handoff validation, use `npm run build` and `npx eslint src`.
- For root-app-only lint checks, prefer `npx eslint src` until the workspace lint ignores are tightened; it avoids traversing the nested copy's generated files.
- Current validation baseline: `npm run build` passes and `npx eslint src` reports no problems. `npx react-doctor@latest --verbose --scope changed` should not regress.
- `next.config.ts` sets `turbopack.root` to the workspace root. Keep that in place unless the app is intentionally moved.
- Preserve the global scrollbar-stability approach in `src/app/globals.css`: keep scroll ownership on `html`, not on an inner layout wrapper.

## Code layout

- `src/app` holds routes only (plus route-private `_components/`). Reusable UI lives in `src/components/<area>/`, each component next to its own CSS module; shared helpers (media queries, site links, analytics, modal hooks) live in `src/lib`; portfolio card data and tabs live in `src/data/portfolio-cases.ts`.
- Use `TextLink` for inline external links, `CaseStudyLayout`/`CaseOverview`/`CaseMeta`/`CaseLabel` with `case-study.module.css` for case-study pages, and `useEscapeKey`/`useScrollLock` for modals.
- framer-motion runs through `MotionProvider` (`LazyMotion strict`): use `m.*`, not `motion.*`.
- The dev-only `/api/debug/case-media` route writes overrides between the `CASE_MEDIA_DEBUG_OVERRIDES` markers in `src/components/portfolio-case/portfolio-case.module.css`; keep those markers.

## UI conventions

- All button components must use fully rounded geometry. Text buttons should be pill-shaped; icon-only buttons should be circular.
- Do not introduce square or partially rounded buttons unless the user explicitly requests an exception.
- New production buttons, links, tabs, toggles, and clickable cards must call the shared `playTap()` interaction-sound API after a successful activation.
- Do not play interaction sounds on hover, individual keystrokes, slider movement, or repeated activation of an already-active control.
- Do not create standalone `Audio` instances outside the shared sound provider. Development-only and debug-panel controls are exempt from interaction sounds.

## Mobile layout consistency

- At `max-width: 760px`, portfolio case-study pages must use the same outer layout as the main page: a white full-viewport surface with no outer card, shadow, or gray page gutter; `16px` inline content padding; and `72px` bottom padding. Keep page-specific content spacing inside that shared outer frame.

## Nested copy

- `portfolio-app/` is a separate nested Git repo with an older app copy/template. Do not change it unless the task explicitly targets that directory.
- Git commands from the workspace root fail because the root is not itself a Git repo; target `portfolio-app/` only when Git history/status is specifically needed there.
- `npm run lint` at the workspace root currently traverses generated files under `portfolio-app/.next` because the ESLint config only ignores the root `.next/**`; root-app findings are mixed with nested-copy noise until those ignores are tightened.

# CodeKro Design System

A restrained, developer-first design system inspired by LeetCode's minimalist focus and MongoDB's clean dark-green technical identity.

---

## 1. Principles

1. **Calm & Flat**: Visual hierarchy is created through spatial rhythm, typography size, and font weight — never through glowing dropshadows, blur blobs, or gradient text.
2. **Single Purpose Accent**: Green (`#00ED64` dark / `#00A344` light) is reserved exclusively for:
   - Primary action buttons
   - Interactive links and tab indicators
   - Focus rings (`:focus-visible`)
   - Success state confirmations & Accepted verdicts in product previews
   *Nothing else uses green.*
3. **Honest Copy**: Avoid marketing hype, buzzwords ("next-generation", "zero-latency", "microsecond", "revolutionary"), and unprovable numbers. Plain, factual descriptions for developers.
4. **Accessible by Default**: Semantic HTML, visible focus indicators, `aria-invalid` / `aria-describedby` integration on forms, accessible accordion controls with `aria-expanded`, WCAG AA color contrast, and respect for `prefers-reduced-motion`.

---

## 2. Design Tokens

Design tokens are defined as CSS Custom Properties in `src/index.css` and mapped to Tailwind via the `@theme` directive.

### Color Tokens

| Token | Dark (Default) | Light | Usage |
|---|---|---|---|
| `--bg-base` | `#0B1217` | `#F7F9FA` | Page root background, alternating landing sections |
| `--bg-surface` | `#111A21` | `#FFFFFF` | Primary cards, panels, headers, alternating landing sections |
| `--bg-surface-subtle` | `#16222B` | `#F0F3F5` | Segmented controls, subtle header bars |
| `--bg-surface-hover` | `#1A2833` | `#E4E8EC` | Button & list item hover states |
| `--bg-input` | `#0E161C` | `#FFFFFF` | Input field background |
| `--border-default` | `#1F2C35` | `#DCE2E6` | 1px borders on cards and inputs |
| `--border-subtle` | `#18232B` | `#E8ECEF` | Subtle dividing lines |
| `--text-primary` | `#E6EDF1` | `#0F172A` | Headings, active labels, body text |
| `--text-secondary` | `#8B9AA5` | `#475569` | Subtitles, input labels, secondary descriptions |
| `--text-muted` | `#5C6B76` | `#64748B` | Helper text, disabled states, placeholders |
| `--accent-primary` | `#00ED64` | `#00A344` | Primary actions, links, focus rings |
| `--accent-hover` | `#00C853` | `#008738` | Hover state for primary actions (no glow) |
| `--accent-text` | `#001E2B` | `#FFFFFF` | Text color on primary accent background |
| `--color-error` | `#EF4444` | `#DC2626` | Validation error text and borders |

### Typography

- **UI Sans**: `Inter`, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Code Mono**: `JetBrains Mono`, monospace (used for code editor snippets, numbers, and stats)

### Radius & Spacing

- Small: `var(--radius-sm)` (`6px`) — inputs, buttons, segmented pills
- Medium: `var(--radius-md)` (`10px`) — cards, dialogs, code blocks
- Large: `var(--radius-lg)` (`12px`) — major modal containers

---

## 3. UI Primitives (`src/components/ui`)

### `<Button />`
Supports `primary`, `secondary`, and `ghost` variants across `sm`, `md`, and `lg` sizes. Includes built-in spinner for `loading={true}` and accessible `disabled` handling.
- **Primary**: Solid accent green with dark text (`#001E2B`), no drop-shadow glow, no decorative arrow icon.
- **Secondary**: Neutral surface with 1px border.
- **Ghost**: Transparent with subtle hover fill.

### `<Input />` & `<PasswordInput />`
- Fixed height: `h-10` (40px)
- Neutral border (`border-border-default`)
- Green focus ring only on active focus (`focus:border-accent focus:ring-1 focus:ring-accent`)
- Error state: turns border red and announces error message via `role="alert"` and `aria-describedby`
- `<PasswordInput />` features an accessible show/hide password toggle button.

### `<Checkbox />`
- Custom accessible checkbox styling matching the design tokens.
- Accessible keyboard focus and label clicking.

### `<Tabs />`
- Provides clean `underline` (active bottom border) and `segmented` (flat pill) presentations.
- Contains `role="tablist"` and `aria-selected` for screen readers.

### `<Card />`
- Surface `#111A21`, 1px border `#1F2C35`, radius 10px, subtle shadow.
- No gradient border lines or glowing top highlights.

### `<Divider />`
- Faint neutral horizontal line with optional lowercase centered label (e.g. `"or"`).

### `<Logo />`
- Clean CodeKro code brackets wordmark without distracting version tags or pulsing indicator dots.

---

## 4. Layout Architecture

- **`AuthLayout`**: Split-screen 2-column layout on desktop; single-column on mobile.
- **`AppLayout`**: Reusable dashboard shell with header, optional sidebar slot, and main content area for Problems, Contests, and Profile pages.
- **`ProblemLayout`**: Dedicated full-height distraction-free workspace (`/problems/:slug`).
- **`LandingView`**: Public landing page shell coordinating the 10 core sections for signed-out visitors.
- **Centralized Copy (`src/constants/copy.js`)**: All user-facing strings are decoupled from JSX markup for maintainability and scalability.
- **API Client (`src/lib/api.js`)**: Isolated backend contract ready for endpoint integration without touching backend code.

---

## 5. Problem Workspace & Status Badge Rules

### Judge Status System & Color Rules

Status indicators **always** pair high-contrast text with an explicit geometric icon to satisfy WCAG AA requirements; status is never communicated through color alone.

| Status | Icon | Color Treatment | Description |
|---|---|---|---|
| `ACCEPTED` | Checkmark (`✓`) | Green (`#00ED64` dark / `#00A344` light) | All test cases passed within limits |
| `WRONG_ANSWER` | Cross (`✕`) | Amber/Red subtle text (`#FFA116` / `#FF6B6B`) | Output does not match expected output |
| `TIME_LIMIT_EXCEEDED` | Clock (`⏱`) | Amber (`#FFA116`) | Execution exceeded allotted CPU time |
| `MEMORY_LIMIT_EXCEEDED` | Chip (`💾`) | Amber (`#FFA116`) | Exceeded maximum allowable memory |
| `RUNTIME_ERROR` | Alert Circle (`⚠️`) | Red (`#FF6B6B`) | Non-zero exit code or uncaught exception |
| `COMPILE_ERROR` | File Warning (`📄!`) | Red (`#FF6B6B`) | Language compiler/transpiler failed |
| `QUEUED` / `RUNNING` | Spinner (`⏳` / `⟳`) | Neutral Secondary (`#8B9AA5`) | Asynchronous queue and worker execution |

### Difficulty Labels

Difficulty labels are applied exclusively to small text pill elements:
- **Easy**: Accent Green (`#00ED64` dark / `#00A344` light)
- **Medium**: Amber (`#FFA116`)
- **Hard**: Coral Red (`#FF6B6B`)

---

## 6. User Profile & Settings Guidelines

### Profile Layout Architecture (`/u/:username`)
- **Desktop (≥1024px)**: 4/8 two-column split.
- **Mobile (<1024px)**: Single column hierarchy.
- **AI-Evaluated Verdict Transparency**: Runtimes and memory allocations are captioned as **"estimated"** and tagged with an **"AI-evaluated"** badge.

---

## 7. Public Landing Page Guidelines (`/`)

### Routing Behavior
- Route `/` serves signed-out visitors.
- Authenticated visitors visiting `/` are automatically redirected to `/dashboard`.
- Theme selection persists across reloads via `localStorage.getItem('codekro_theme')`.

### Strict "No Decoration" Rules
- **BANNED**:
  - Gradient text
  - Glowing orbs or blurred color blobs
  - Glowing buttons / pulsing borders
  - Pulsing status dots
  - Sparkle / magic AI icons
  - Stacked colored status pills
  - Colored icon tiles on every feature
  - Fake "live" indicators or fabricated learner statistics
- **Green Accent Rule**: Green (`#00ED64`) is reserved strictly for the primary CTA, text links, focus rings, and the `Accepted` verdict inside the product preview mockup. Everything else is neutral.
- **Surface Rhythm**: Section backgrounds alternate between `--bg-base` (`#0B1217`) and `--bg-surface` (`#111A21`) to establish structure without heavy border dividers.

### Section Sequence & Components (`src/features/landing`)
1. **`LandingHeader`**: 56px sticky bar with Logo, navigation links (Problems `#problems`, Contests `#contests`, FAQ `#faq`), theme toggle, ghost "Sign in" button, and primary "Get started" button. Collapses to an accessible drawer on mobile.
2. **`Hero` & `ProductPreview`**: Single-color headline, supporting sentence, primary CTA "Start solving", secondary CTA "Browse problems", muted "Free to start. No credit card." note. Side-by-side on desktop with a static product preview card showing a split problem view and an Accepted solution with AI-evaluated caption.
3. **`ProblemPreviewTable`**: Live-looking sample of 5 problems (title, difficulty pill, topic) in a clean table with a "View all problems" link and loading skeleton.
4. **`HowItWorks`**: 3 numbered steps in plain monospace numerals (`01`, `02`, `03`) with zero decorative icon tiles.
5. **`FeatureGrid`**: 2x3 grid with small neutral line icons, short titles, and factual descriptions.
6. **`ContestTeaser`**: Dynamic upcoming contest preview showing start time in the visitor's local timezone, countdown timer, duration, and registration button. Silently omitted if no contest is scheduled.
7. **`ProgressPreview`**: Clean static view of the 12-month calendar heatmap and Easy / Medium / Hard progress ring and bars.
8. **`FaqAccordion`**: 5 accessible questions and answers with `aria-expanded` and `aria-controls` disclosures, fully transparent about AI evaluation benchmarks.
9. **`FinalCta`**: Single headline, supporting sentence, primary "Create free account" CTA, and secondary "Browse problem set" CTA.
10. **`LandingFooter`**: Semantic `<footer>` landmark with Logo, columns (`Product`, `Resources`, `Company`, `Legal`), GitHub link, and copyright.

### Responsive Breakpoints & Accessibility
- Tested and verified at `375px`, `768px`, `1024px`, and `1280px`.
- Touch targets on interactive elements are at least 44px x 44px.
- Skip-to-content link positioned at the top of the DOM for keyboard and screen reader users.

# CodeKro Design System

A restrained, developer-first design system inspired by LeetCode's minimalist focus and MongoDB's clean dark-green technical identity.

---

## 1. Principles

1. **Calm & Flat**: Visual hierarchy is created through spatial rhythm, typography size, and font weight — never through glowing dropshadows, blur blobs, or gradient text.
2. **Single Purpose Accent**: Green (`#00ED64` dark / `#00A344` light) is reserved exclusively for:
   - Primary action buttons
   - Interactive links and tab indicators
   - Focus rings (`:focus-visible`)
   - Success state confirmations
   *Nothing else uses green.*
3. **Honest Copy**: Avoid marketing hype and unprovable claims. Plain, factual descriptions for developers.
4. **Accessible by Default**: Semantic HTML, visible focus indicators, `aria-invalid` / `aria-describedby` integration on forms, WCAG AA color contrast, and respect for `prefers-reduced-motion`.

---

## 2. Design Tokens

Design tokens are defined as CSS Custom Properties in `src/index.css` and mapped to Tailwind via the `@theme` directive.

### Color Tokens

| Token | Dark (Default) | Light | Usage |
|---|---|---|---|
| `--bg-base` | `#0B1217` | `#F7F9FA` | Page root background |
| `--bg-surface` | `#111A21` | `#FFFFFF` | Primary cards, panels, headers |
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
- **Code Mono**: `JetBrains Mono`, monospace (used only for code editor snippets and terminal outputs)

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

- **`AuthLayout`**: Split-screen 2-column layout on desktop (short value proposition on the left, centered 420px card on the right); single-column on mobile.
- **`AppLayout`**: Reusable dashboard shell with header, optional sidebar slot, and main content area for Problems, Contests, and Profile pages.
- **`ProblemLayout`**: Dedicated full-height distraction-free workspace (`/problems/:slug`):
  - Desktop: Resizable horizontal split view (Left: 45% problem tabs, Right: 55% editor & console). Draggable divider with keyboard arrows support (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`). Right pane splits vertically into Monaco Editor (65%) and test/console panel (35%). Remembers layout dimensions in `localStorage`.
  - Mobile (<1024px): Single-column workspace with segmented switcher (`Description` | `Code` | `Results`) and a sticky bottom Run/Submit bar.
- **Centralized Copy (`src/constants/copy.js`)**: All user-facing strings are decoupled from JSX markup for maintainability and scalability.
- **API Stub (`src/lib/api.js`)**: Isolated backend contract ready for endpoint integration without touching backend code.

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

### Split Pane Accessibility & Keyboard Escapes

- **Dividers**: Fully keyboard operable using Arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) with `Home` and `End` keys to reset or snap panes.
- **Monaco Focus Trap Escape**: Press `Esc` then `Tab` to escape Monaco Editor's internal tab capture and resume normal page DOM tab navigation.
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + '`: Run sample test cases
  - `Ctrl/Cmd + Enter`: Submit solution to judge queue
  - `?`: Open keyboard shortcuts cheat sheet
  - `/`: Focus problem search / filter bar


---
name: Kragsta Elektriska — exploratory phone concept
description: A calm working day, from customer to invoice.
colors:
  paper: "#f7f7f2"
  ink: "#252923"
  muted: "#666b61"
  panel: "#edeee5"
  line: "#dddfd5"
  lemon: "#e9eca5"
  sage: "#e5ebdf"
  danger: "#924c3d"
  board: "#e9ebe5"
  brand-green: "#073a24"
  brand-orange: "#ff8508"
typography:
  headline:
    fontFamily: "App Sans, Segoe UI, sans-serif"
    fontSize: "31px"
    fontWeight: 450
    lineHeight: 1.12
    letterSpacing: "-1px"
  body:
    fontFamily: "App Sans, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "App Sans, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 400
rounded:
  panel: "16px"
  field: "11px"
  control: "50px"
spacing:
  small: "8px"
  medium: "16px"
  large: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "46px"
    padding: "10px 16px"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "46px"
    padding: "10px 16px"
  task-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "18px"
---

# Design System: Kragsta Elektriska

## Overview

**Creative North Star: "En lugnare arbetsdag"**

This records the built exploratory mockups, not an approved final brand. Calm, minimal screens with readable status text and a clear next action follow the user's brief and references. The visual system uses paper surfaces, dark primary controls, and restrained lemon emphasis.

**Key Characteristics:**
- One main action within each task.
- Quiet separators for repeated records.
- Status always includes a text label.
- Numbers align and use Swedish formatting.

## Colors

Paper is the app background; board surrounds the review canvases. Ink carries headings, active navigation, and primary actions. Panel groups a task without a shadow. Lemon highlights a useful next action or selected visit. Sage supports initials and routine statuses. Overdue statuses use a muted warm fill with dark rust text.

The confirmed company logo adds orange and dark green, limited to compact branding and the running-job indicator. The app header uses a 36px K/lightning symbol with orange fill, dark green outline and offset, and bracketed slab serifs on the stem. The upper right arm has a clean diagonal terminal without a serif, as requested. The review header uses the same symbol at 40px. `assets/kragsta-icon.svg` serves as the active app icon; its selected source is `assets/logo-proposals/kragsta-kraft-skylt-ren.svg`.

The user-approved full logo is the tall, tightly spaced Bernard MT Condensed version with the arched ELEKTRISKA contour, orange lettering and telephone line, and dark-green outline and offset. The K/lightning is integrated at the beginning of KRAGSTA. The user selected the comparison shown in codex-clipboard-7cf70036-1080-4ee1-b8bd-19b4ff6ef79e.png after reviewing the broad, equal-height alternative. Preserve this exact selection. `assets/kragsta-elektriska-full.svg` is the full master; `assets/kragsta-elektriska.svg` is its telephone-free invoice version. `design/build-brand.ps1` rebuilds both through `design/build-tight-logo.ps1`. The approved small icon remains unchanged.

## Typography

`App Sans` resolves locally to Segoe UI Variable Text or Segoe UI, a workhorse choice for this operational prototype. Screen headings range from 29–34px at 450 weight. Body and list labels use 12–14px; secondary metadata uses 11px. Primary actions use 13px. Inputs use 16px. Financial figures are formatted with Swedish decimal separators and spaces for grouping.

## Layout

Phone canvases are at most 390px wide and 844px tall, with 18–25px content insets and persistent bottom navigation. The app content scrolls for longer records. Review canvases use three columns, two below 1000px, and one below 720px. The focused prototype shows one phone, with supporting notes hidden on narrow screens.

## Elevation & Depth

Task surfaces are flat and separated by tone. Only review phone frames, temporary feedback, and the focused entry sheet use soft shadows. The phone shadow is `0 12px 26px -20px #45503250`.

## Shapes

Panels use 16px corners, fields 11px, and short controls pill corners. Icons use one family of 24-unit line SVGs with a 1.65 stroke. The review device frame is presentation chrome, not a proposed native-app component.

## Components

The invoice paper uses one header row: Faktura and the draft label on the left, the company wordmark at the top right. Customer and invoice details sit below. The logo keeps its aspect ratio and is capped at 40% of the paper's content width so it fits narrow phone previews.

Primary buttons use ink/paper and a 46px minimum height. Secondary buttons use panel/ink. Filters use 44px minimum height with text and dark selected state. Form fields have a thin neutral rule and 16px input text. Focus is a 2px olive outline with a 4px offset. Error copy states the correction needed. Bottom sheets contain quick, focused record entry and confirmation, with a close action, Escape handling, and keyboard containment.

On the job detail, a lemon inline timer appears inside the scrolling content with elapsed time and the stop/save action. Its duplicate stop action in the lower button group is hidden while the timer is active. Other app screens use a compact dark-green status element, 44px tall with 22px pill corners, at the top right of the app header. The 36px K logo stays on the left, separated by at least 8px. The header sits below the phone system indicators and above the scrolling content. It participates in the phone's flex layout, so it never overlays content. It includes a small orange dot, the Pågår label, a truncating job title, HH:MM:SS elapsed time, and a 44px stop control. Tapping the main row opens the current job; stopping saves the session once. There is only one timer surface per screen and no per-second assistive announcement. The home screen keeps its next visit compact while work is running.

## Do's and Don'ts

- Do keep the next visit and urgent items visible on Idag.
- Do reuse the job's recorded work in the invoice.
- Do keep ROT and exceptional details behind their relevant action.
- Don't rely on color alone for state.
- Don't imply example transactions were actually sent or paid.
- Don't carry this prototype's small PDF preview type or 36px material edit button into a production accessibility specification; real-device text and target sizing need further validation.

# Emerald Shadow Overlay Module

**Brief**: Implements the "Emerald Shadow" cinematic system for hero/background videos (LSIT / Rocinante Marketing v1.0). Pairs deep teal gradients with grain, vignette, and glass CTA container for AA+ legibility.

## Layer Stack & Tokens
- **Video base** .video-wrap video overlays autoplay hero footage (lsit-hero.(webm|mp4)) with poster fallback img/hero-poster.jpg (<20KB).
- **Gradient wash** .overlay--gradient (z=1) mixes gba(4,112,98,.85) → gba(0,0,0,.9) at 45° for Emerald → Shadow drift.
- **Animated grain** .overlay--grain (z=2) tiles 	extures/noise.png (192×192, 24KB) with ilmGrain keyframes; disabled under prefers-reduced-motion.
- **Vignette** .overlay--vignette (z=3) radial focus from center, pointer-events none.
- **Glass CTA** .text-glass (z=10) uses ackdrop-filter: blur(8px) with fallback to gba(0,0,0,.65) via @supports guard.

Key tokens live in :root (see css/reset_and_variables.css): --overlay-heading, --overlay-panel-gloss, etc.

## Usage
1. Link css/overlay.css after css/styles.css.
2. Wrap hero media with <section class="hero hero--emerald"> → <div class="video-wrap">.
3. Keep overlays ordered: gradient → grain → vignette → .text-glass.hero__content.
4. Primary CTA uses .hero__button.hero__button--primary (teal) and .hero__button--secondary (outlined) scoped via .hero--emerald.
5. Optional teal pulse: add .is-pulsing to .overlay--gradient (default on home hero).
6. Reduced-motion users automatically skip grain animation; add data-paused="true" to <video> if JS stops autoplay.

## Fallback Guidance
- No ackdrop-filter: @supports not (...) bumps panel background to gba(0,0,0,.65).
- No mix-blend-mode: gradient opacity increases to maintain contrast.
- prefers-reduced-motion: film grain + pulse animations disabled; video transitions halted via CSS + optional JS hook.

## Assets & Performance Notes
- ideo/lsit-hero.webm (VP9, 4.1 MB, 1080p@29.97).
- ideo/lsit-hero.mp4 (H.264 fallback, 6.0 MB copy of 	kd.mp4).
- img/hero-poster.jpg (1280×720 gradient, 18 KB) for quick LCP.
- 	extures/noise.png (tileable 192×192, 24 KB) under 40 KB budget.

## Integration TODOs
- When the hero component doc is published, link back to this brief.
- Future: wire analytics event for CTA clicks to measure +15% KPI.

# Emerald Shadow Performance Snapshot

| Asset | Size | Budget | Notes |
| --- | --- | --- | --- |
| ideo/lsit-hero.webm (VP9) | 4.1 MB | ≤ 6 MB | Encoded @ ~3 Mbps, 14 s loop, no audio. |
| ideo/lsit-hero.mp4 (H.264) | 6.0 MB | ≤ 6 MB | Copies existing 	kd.mp4 for fallback. |
| img/hero-poster.jpg | 18 KB | ≤ 150 KB | Gradient poster used as LCP placeholder. |
| 	extures/noise.png | 24 KB | ≤ 40 KB | Tileable 192×192 grain. |
| Overlay CSS (css/overlay.css) | 3 KB | — | Loaded after css/styles.css. |

Total overlay asset payload (noise + poster + CSS) = **45 KB**, well under the 100 KB overlay budget.

## Timing Targets
- Hero remains above-the-fold; ensure the poster eventually receives a <link rel="preload" as="image"> once HTML head control is available to keep LCP ≤ 2.5 s on 4G.
- CLS unchanged (hero height fixed, content anchored inside .text-glass).

## Test Status
- **Lighthouse**: Not run in CLI (Chrome headless unavailable). Run 
px lighthouse http://localhost:4173 --only-categories=performance,accessibility --preset=desktop after hosting to capture ≥90/95 targets.
- **WebPageTest**: Pending (external service). Suggested script: https://www.webpagetest.org/?url=https://<deploy>/&fvonly=1&video=1.
- **Poster lazy-load**: Verified via manual inspection—poster + preload="metadata" keep initial request lean.

## Follow-Up
1. Inline link rel="preload" as="video" + etchpriority="high" for the hero once traffic confirms uplift.
2. Monitor analytics for CTA click-through lift (+15% KPI) once deployed.

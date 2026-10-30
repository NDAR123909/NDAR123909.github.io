# CLAUDE.md

Personal website for Noah Riego. A simple, hand-built static site served by GitHub Pages at NDAR123909.github.io.

## About Noah
- B.S. Applied Physics, University of Arizona (W.A. Franke Honors College). Minors in Statistics & Data Science and Korean Culture. Expected graduation May 2028. Based in Tucson.
- Research interests: nonlinear dynamics and chaos. Plan: PhD, then industry research.
- Also builds websites freelance.

## Audience, in priority order
1. Faculty, REU committees, and later PhD admissions
2. Internship recruiters (ML/AI engineering, physics research, quant research)
3. Prospective web clients

## Content
- **Home:** short bio, research interests, headshot, links (GitHub, LinkedIn, email, CV).
- **Research project page (the centerpiece):** Noah's sole-author paper on parameter-aware echo state network extrapolation on the Lorenz system. Explain it clearly for a technical reader who isn't a specialist, with figures. If trajectory data is provided, build an animated comparison of the true and predicted attractors. Use only Noah's actual results. Never simulate or invent model output.
- **CV:** PDF of the research resume, linked from the site.
- **Other research:** one line on Noah's role in FRME, a student-led VIP study comparing a standard faculty directory with a research-interest search tool for finding mentors. Say nothing beyond the role; results aren't published.
- **Web work:** build the section, but keep it off the live site for now (not linked, not in nav). Client sites launch in December.

## Rules
- Don't invent facts, numbers, dates, or quotes. Use only what's in Noah's files or what Noah says; ask when something is missing.
- Don't post the full paper PDF (not yet submitted). Describe the work and show figures only.
- Don't list GPA.
- Don't mention the Korean Culture minor on the site; list only the Statistics & Data Science minor.
- Don't mention FRME co-authorship for now; role line only.
- Plain, direct language that sounds like Noah. No marketing tone.

## Source files
- Noah's source files live in `materials/`. It is in `.gitignore`. Never commit anything from it.
- When the site needs a file (headshot, CV PDF, figures), copy it into the site's own folders.

## Tech
- Plain HTML, CSS, minimal vanilla JS. No framework, no build step, nothing GitHub Pages can't serve as-is.
- Responsive down to phone width. Accessible: semantic HTML, alt text, keyboard navigation, good contrast.
- Fast. No trackers or analytics.
- Every page gets a title, meta description, and Open Graph tags.
- Clean, readable code (reviewed in Cursor).

## Skills and workflow
- `frontend-design` for design direction, `impeccable` for the final audit/polish pass, `unslop` on all written content before it goes live.
- Usage budget is limited: keep it lean. No subagents, no long multi-phase planning. Small steps, check in at milestones.
- Propose site map and design direction and get approval before building.

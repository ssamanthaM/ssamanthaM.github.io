# samanthavargasmarkham.com — source

Personal site for Samantha Vargas-Markham: policy, governance and applied AI.
Live at <https://ssamantham.github.io>.

Static HTML. No build step, no dependencies, no framework. Every page loads one stylesheet and one
script. Pushing to `main` publishes it.

```
index.html        Home — the argument, the numbers, what's being built now
about.html        Short bio, long bio, practical details, education
experience.html   Career record, with "what this means if you're hiring for X" notes per role
projects.html     Handa · WPS Maritime Tracker · the Margins Studio · SolBound · Canary in the Dragnet
writing.html      Research and policy work, described; full texts on request
interests.html    Animal welfare, and a filterable archive of 50 photographs
resume.html       Résumé, styled to print to two pages
contact.html      How to get in touch
assets/css/       Design system: colour, type, components, light + dark, print
assets/js/        Nav, scroll reveal, gallery filtering, lightbox, gallery.json manifest
assets/img/       Photographs — slug.jpg (full) and slug-t.jpg (thumbnail)
assets/docs/      The résumé PDF. Nothing else is published here by design.
```

## Local preview

```bash
node ../.claude/serve.js
```

Then <http://localhost:8777/site/>.

## Regenerating the résumé PDF

`assets/docs/SVMarkham-Resume.pdf` is `resume.html` printed to PDF. After editing the résumé, run
this with the local server going, then commit the new file:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="assets/docs/SVMarkham-Resume.pdf" http://localhost:8777/site/resume.html
```

## Adding a photograph

Put `slug.jpg` (about 1500px wide) and `slug-t.jpg` (about 700px) in `assets/img/`, then add an entry
to `assets/js/gallery.json`:

```json
{ "slug": "my-photo", "cat": "district", "caption": "What this shows.", "w": 700, "h": 466 }
```

Categories: `government`, `diplomacy`, `district`, `press`, `academic`, `animals`. The `portrait`
category is excluded from the gallery — it's the home page hero.

**Take `w` and `h` from the browser, not from `sips`.** `sips -g pixelWidth` reports dimensions
before EXIF rotation is applied, so its numbers can disagree with what a browser renders and the
photo will appear stretched. Load the thumbnail and read `naturalWidth` / `naturalHeight`.

## Notes

- Fully readable with JavaScript disabled; only the gallery needs it.
- Light and dark themes both ship, following the visitor's system setting.
- Research documents are deliberately not hosted. They live outside this repo, in
  `Personal work website/documents/`, and the site says they're available on request.
- `.nojekyll` stops GitHub Pages running Jekyll, which would otherwise drop `_headers`.

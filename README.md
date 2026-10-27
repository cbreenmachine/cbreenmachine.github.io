# colemanbreen — personal site

Static site for Coleman Breen (cbreenmachine.github.io). Plain HTML, CSS, and vanilla JS; no build step.

- Content lives in `content/*.js` (about text, Technical and Policy cards, Links). Edit those, not `index.html`.
- Tests: `node --test tests/`. Browser check (DOM dumps and screenshots into `tools/out/`): `tools/check.sh`.
- Refresh the CV: in `../cbreen-cv` run `latexmk -pdf main.tex`, then copy `main.pdf` to `assets/cv.pdf`.

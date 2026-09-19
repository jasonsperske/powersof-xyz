# powersof.xyz

A static, local-first mathematics learning platform. Available curriculum: Pre-algebra, Algebra I: First Principles, and Statistics Week 1, with shared concept evidence and portable progress.

## Available now

- Pre-algebra: signed numbers, fractions, powers/roots, ratios/rates/percentages.
- Algebra I: First Principles: expressions, equations, inequalities, and functions/linear relationships.
- Each algebra module includes four guides, two 8-question worksheets, two 5-question checkpoints, a 6-question diagnostic, two written challenges, and six fresh review questions (80 new questions total).

Statistics Week 1 and platform features:

- Eight-question prerequisite diagnostic.
- Three teaching guides with KaTeX equations, worked examples, and saved notes.
- Eighteen core problems, four derivations, eight quiz questions, and six fresh review problems.
- Numeric/fraction and multiple-choice grading; explicit rubric self-assessment for written reasoning.
- Per-question attempts, conceptual categories, answer-pattern misconception tags, and a transparent mastery heuristic.
- IndexedDB persistence, draft recovery, progress backups, and validated restore with review.
- Compact, full, and assessment-only learning context exports; companion prompt; reviewed external assessment imports.
- Public machine-readable curriculum and external assessment JSON Schema.
- Responsive interface and hash URLs compatible with static hosts and repository subpaths.

Statistics Weeks 2–8, later Algebra I topics (systems, polynomials, quadratics), calculus, and other advanced courses are planned. The two algebra offerings are introductory modules, not a full-year syllabus. No server, sign-in, cookies, telemetry, or paid AI API is needed.

## Run

Use Node 24 (minimum 22.13):

```sh
cd web
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`web/dist` is the complete static deployment. The runtime is React + TypeScript + Vite with KaTeX and selected scaffold-provided UI primitives. Unused scaffold dependencies are retained in the lockfile; no Worker or Next server is required by the application. The build publishes the multi-course registry in `web/courses/index.ts` (with content in `statistics.ts` and `algebra.ts`) to `public/curriculum.json`.

## GitHub Pages

The included workflow tests, builds, and publishes on pushes to `main` or manual dispatch. Connect this checkout to your GitHub repository, enable Pages with GitHub Actions as source, and push. This checkout initially has no Git remote configured, so it has not been published.

Configure powersof.xyz as the repository's Pages custom domain and configure its DNS when ready. No domain settings are changed by this project. The relative Vite asset base and hash routes also work under a repository subpath. Exports derive URLs from the current hosting address.

## Evidence and privacy

Mastery uses the last five normalized scores for a concept; ≥90% across at least three distinct questions among those five is labeled mastered. Self-assessments count but are labeled. External assessments remain separate. Retries and solution exposure can inflate estimates: this is a study aid, not certified assessment. Solutions are public static content, so tests are honor-system exercises.

Reviews become due after two days for developing concepts and seven days for mastered concepts. Each course has a fixed fresh-question review set; adaptive question generation and cross-course scheduling are future work. Timing is approximate elapsed session time per question and includes pauses. Answer changes count input events.

Browser storage is device- and origin-specific and can be cleared. Keep backups. Use one editing tab at a time; automatic multi-tab/device merge is not implemented. Full context includes notes; every export may include personal learner answers. Nothing is transmitted automatically. Restoring a backup replaces the current record only after review. Imported external assessments never update local mastery automatically.

## Validation

`npm test` covers grading edge cases, misconception matching, mastery/first-attempt calculations, malformed imports, export links, content references, course ownership/navigation, math rendering, independent algebra answer checks, mixed-course backup compatibility, shared-concept exports, and IndexedDB save/reload using fake-indexeddb. `npm run build` publishes the manifest, checks TypeScript, and produces static assets. Browser visual/interaction testing has not been performed. Optional WebMCP navigation is feature-detected; a supported WebMCP validation context was unavailable.

See `docs/learning-context-spec.md` and `docs/roadmap.md`.

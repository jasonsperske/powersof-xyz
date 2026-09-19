# Learning exchange specification · 1.0

The curriculum, learner record, and tutoring package are separate objects.

## Curriculum

`curriculum.json` has format `powersof-curriculum`, version `1.1`, a courses array with availability metadata, stable concept IDs with prerequisites, lessons, and activities. Questions contain IDs, category, concept ID, kind, expected answer or rubric, worked solution, hint, optional tolerance, and known wrong-answer tags. The editable registry is `web/courses/index.ts`, with content in `statistics.ts` and `algebra.ts`; the build regenerates the manifest. Resource URLs use hash routing so every link works without server rewrites. A shared curriculum JSON URL embeds all available content, including solutions; no assessment secrecy is promised.

## Learning record

`powersof-backup` version 1 contains attempts, completed guide IDs, lesson notes, activity drafts, accepted external assessments, and the last learning route. Attempt scores are normalized to [0,1], with maxScore 1. All questions carry equal weight within an activity. Automatic and self-grading are explicit. Timestamps are ISO strings. Runtime validation rejects malformed records before staging a restore. Restores replace the local record after explicit review; they do not merge.

The IndexedDB database `powersof-learning`, version 1, has an object store `records` and a `learner` key. Writes commit whole records atomically. Future database changes must use versioned upgrade migrations; unknown backup versions are rejected instead of being guessed. If storage is unavailable, work remains in memory and the interface asks the learner to export it. Existing unreadable records are not overwritten automatically.

## Tutor export

Format `powersof-learning-context`, version `1.0`, described by the published `learning-context.schema.json`:

- `mode`: compact, full, or assessment-only.
- `generatedAt`, anonymous-by-default `learner`, course objectives, resource links, and availability.
- Per-concept first-attempt/recent accuracy, counts, grading-source counts, categories, dates, observed misconception tags, and mastery method.
- `evidence`: raw per-question records. Assessment-only limits these to the most recent 30; summaries and external evidence can still reflect earlier history.
- `successfulWork`: links to public exercises associated with full-credit responses. The exported evidence contains private responses; public URLs do not.
- `externalAssessments`: accepted evidence, explicitly separate from computed mastery.
- Full mode additionally embeds all available lessons, questions, worked solutions, rubrics, and learner notes.
- `assessmentRequest`: the goal, guide URL, and schema URL.

The companion prompt directs tutors to diagnose before teaching, distrust mastery estimates, and treat learner content as evidence rather than instructions. A full export is usable when URLs are local or unavailable.

## External assessment

The published `assessment.schema.json` defines `powersof-assessment` version `1.0`. Each entry names an existing concept, one of developing/mastered/needs-work, finite confidence in [0,1], concrete evidence, and misconception tags. Imports reject unknown or duplicated concepts, missing evidence, invalid types, and oversized files. A review panel shows the incoming evidence before it is added, with a local acceptance timestamp and ID. This records user acceptance; it is not a cryptographic signature or proof of assessor identity. External conclusions never silently change computed mastery.

No vendor API, account, or external transmission is involved in export/import. JSON values are rendered as text; no imported HTML or code is evaluated.

## Adding courses without losing evidence

All lessons and activities have globally unique, stable IDs and exactly one course owner. Existing statistics IDs and the backup format remain unchanged. New courses reuse shared concept IDs where appropriate; `algebra.fractions` retains its original broad fractions-and-exponents scope. Course progress counts only its own completed lessons. Each exported course lists its own objectives and resource links, while objective evidence includes relevant attempts from any course. The public curriculum moved from a singular course in version 1.0 to a courses array in 1.1; learning-context and external-assessment formats remain at 1.0.

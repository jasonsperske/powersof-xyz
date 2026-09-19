import { ArrowUpRight, BookOpen, Network, ArrowRight } from 'lucide-react';
import ScaleJourney from './ScaleJourney';
export default function Home({
  continueRoute,
  started,
}: {
  continueRoute: string;
  started: boolean;
}) {
  return (
    <>
      <main className="shell">
        <div className="page-heading">
          <div>
            <p className="eyebrow">MATHEMATICS COURSES</p>
            <h1>Algebra and statistics</h1>
          </div>
          <span className="edition">01 / FOUNDATIONS</span>
        </div>
        <div className="home-grid">
          <section className="feature">
            <ScaleJourney />
            <div className="feature-copy">
              <p className="eyebrow">START LEARNING · FOUNDATIONS</p>
              <h2>
                Numbers, equations,
                <br />
                and functions
              </h2>
              <p>
                Calculate with fractions and signed numbers.
                <br />
                Solve equations and interpret linear relationships.
              </p>
              <a
                className="button lime"
                href={
                  started && continueRoute !== '/'
                    ? '#' + continueRoute
                    : '#/course/pre-algebra'
                }
              >
                {started ? 'Continue learning' : 'Start with pre-algebra'}{' '}
                <ArrowRight size={18} />
              </a>
              <div className="feature-meta">
                Pre-algebra → Algebra I <span>Lessons and assessments</span>
              </div>
            </div>
          </section>
          <section className="start-card">
            <BookOpen size={24} />
            <p className="eyebrow">PREREQUISITE CHECK</p>
            <h2>Check arithmetic skills</h2>
            <p>
              Six ungraded questions on signed numbers, fractions, powers,
              percentages, and unit rates.
            </p>
            <a href="#/activity/pre-diagnostic" className="text-link">
              Take the diagnostic <ArrowUpRight size={19} />
            </a>
          </section>
        </div>
        <section className="section">
          <div className="section-heading">
            <h2>Courses</h2>
            <a href="#/explore">
              View prerequisites <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="path-strip">
            {[
              {
                title: 'Pre-algebra',
                status: '4 guides · 2 checkpoints',
                url: 'pre-algebra',
              },
              {
                title: 'Algebra I',
                status: 'Equations, inequalities, functions',
                url: 'algebra-1',
              },
              {
                title: 'Statistics',
                status: 'Mean, variance, z-scores',
                url: 'statistics',
              },
              { title: 'Calculus', status: 'Planned course', url: null },
            ].map((course, i) => (
              <div key={course.title}>
                <span className="step">0{i + 1}</span>
                <h3>
                  {course.url ? (
                    <a href={'#/course/' + course.url}>{course.title} ↗</a>
                  ) : (
                    course.title
                  )}
                </h3>
                <p>{course.status}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="quiet-banner">
          <Network />
          <div>
            <h3>Prerequisite concepts</h3>
            <p>
              Fractions support ratios and percentages. Equations and ratios
              support linear functions. Algebra supports statistical
              calculations.
            </p>
          </div>
          <a href="#/explore" aria-label="Explore mathematics">
            <ArrowRight />
          </a>
        </section>
      </main>
    </>
  );
}

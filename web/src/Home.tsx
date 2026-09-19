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
            <p className="eyebrow">YOUR MATHEMATICS</p>
            <h1>A little further, a little deeper.</h1>
          </div>
          <span className="edition">01 / FOUNDATIONS</span>
        </div>
        <div className="home-grid">
          <section className="feature">
            <ScaleJourney />
            <div className="feature-copy">
              <p className="eyebrow">START LEARNING · FOUNDATIONS</p>
              <h2>
                Make sense of numbers.
                <br />
                Then make them work for you.
              </h2>
              <p>
                From fractions to functions, build understanding.
                <br />
                One idea, worked through carefully, at a time.
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
                Pre-algebra → Algebra I <span>Learn at your own pace</span>
              </div>
            </div>
          </section>
          <section className="start-card">
            <BookOpen size={24} />
            <p className="eyebrow">FIND YOUR STARTING POINT</p>
            <h2>What do you already know?</h2>
            <p>
              A short, ungraded diagnostic checks the foundations. No pressure,
              just a useful place to begin.
            </p>
            <a href="#/activity/pre-diagnostic" className="text-link">
              Take the diagnostic <ArrowUpRight size={19} />
            </a>
          </section>
        </div>
        <section className="section">
          <div className="section-heading">
            <h2>Your learning path</h2>
            <a href="#/explore">
              Explore the map <ArrowUpRight size={17} />
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
                status: 'First principles available',
                url: 'algebra-1',
              },
              {
                title: 'Statistics',
                status: 'Week 1 ready to explore',
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
            <h3>Mathematics connects.</h3>
            <p>
              Your understanding of each concept will travel with you from one
              course to the next.
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

import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { PROJECT_PROCESS_SECTIONS_EN } from '../data/projectProcessSections';
import './ProjectsGrid.css';

const HERO_IMAGE = '/imgs/category/hero-category.png';
const PAGE_TITLE = 'Grad project';

export default function GradProjectEN() {
  return (
    <Layout lang="en">
      <div className="projects-grid-page">
        <header className="projects-grid-hero" aria-label="Graduation project overview">
          <div className="container">
            <div className="projects-grid-hero__top">
              <Link className="back-link" to="/category">
                ← Category
              </Link>
            </div>
            <div className="projects-grid-hero__inner">
              <div className="projects-grid-hero__text">
                <p className="projects-grid-hero__eyebrow">Capstone</p>
                <h1 className="projects-grid-hero__title">{PAGE_TITLE}</h1>
                <p className="lead">
                  My graduation (capstone) project—documented end-to-end from research and brand
                  through UX, design system, and interactive prototype.
                </p>
              </div>
              <div className="projects-grid-hero__media">
                <img
                  src={HERO_IMAGE}
                  alt={`${PAGE_TITLE} — hero illustration`}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="projects-process-section container" aria-label="Grad project phases">
          <h2 className="projects-process-section__heading">Project structure</h2>
          <p className="projects-process-section__intro">
            Each block is a major chapter of the grad project. Open a section for a deeper write-up
            and links to related portfolio work.
          </p>
          <div className="projects-process-grid">
            {PROJECT_PROCESS_SECTIONS_EN.map(item => (
              <Link key={item.id} className="project-process-card" to={item.to}>
                <div className="project-process-card__media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="project-process-card__body">
                  <h3 className="project-process-card__title">{item.title}</h3>
                  <p className="project-process-card__blurb">{item.blurb}</p>
                  <span className="project-process-card__cta">Open section →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grad-project-footer-cta container" aria-label="Contact">
          <p className="grad-project-footer-cta__text">
            Questions about this capstone or collaboration?
          </p>
          <Link className="btn" to="/contact">
            Contact me
          </Link>
        </section>
      </div>
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { PROJECT_PROCESS_SECTIONS_AR } from '../data/projectProcessSections';
import './ProjectsGrid.css';

const HERO_IMAGE = '/imgs/category/hero-category.png';
const PAGE_TITLE = 'مشروع التخرج';

export default function GradProjectAR() {
  return (
    <Layout lang="ar">
      <div className="projects-grid-page" dir="rtl">
        <header className="projects-grid-hero projects-grid-hero--ar" aria-label="مشروع التخرج">
          <div className="container">
            <div className="projects-grid-hero__top">
              <Link className="back-link" to="/category-ar">
                التصنيفات ←
              </Link>
            </div>
            <div className="projects-grid-hero__inner">
              <div className="projects-grid-hero__text">
                <p className="projects-grid-hero__eyebrow">المشروع الختامي</p>
                <h1 className="projects-grid-hero__title">{PAGE_TITLE}</h1>
                <p className="lead">
                  مشروع التخرج موثّق من البحث والهوية البصرية إلى تجربة المستخدم ونظام التصميم والنموذج
                  التفاعلي.
                </p>
              </div>
              <div className="projects-grid-hero__media">
                <img
                  src={HERO_IMAGE}
                  alt={`${PAGE_TITLE} — صورة الغلاف`}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="projects-process-section container" aria-label="مراحل مشروع التخرج">
          <h2 className="projects-process-section__heading">هيكل المشروع</h2>
          <p className="projects-process-section__intro">
            كل جزء يمثّل فصلًا رئيسيًا في مشروع التخرج. افتحي القسم للاطلاع على التفاصيل وروابط ذات
            صلة بمعرض الأعمال.
          </p>
          <div className="projects-process-grid">
            {PROJECT_PROCESS_SECTIONS_AR.map(item => (
              <Link key={item.id} className="project-process-card" to={item.to}>
                <div className="project-process-card__media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="project-process-card__body">
                  <h3 className="project-process-card__title">{item.title}</h3>
                  <p className="project-process-card__blurb">{item.blurb}</p>
                  <span className="project-process-card__cta">افتحي القسم ←</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grad-project-footer-cta container" aria-label="التواصل">
          <p className="grad-project-footer-cta__text">استفسارات عن مشروع التخرج أو التعاون؟</p>
          <Link className="btn" to="/contact-ar">
            تواصلي معي
          </Link>
        </section>
      </div>
    </Layout>
  );
}

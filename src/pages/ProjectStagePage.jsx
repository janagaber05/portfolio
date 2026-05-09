import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import './ProjectsGrid.css';

const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
const FITUP_RESEARCH_PDF = `${publicUrl}/grad-project/FitUp_Expanded_Research-2.pdf`;

const STAGES = {
  research: {
    en: {
      eyebrow: 'Discovery',
      title: 'Research',
      lead: 'Evidence before pixels—so every design choice in the grad project answers a real need.',
      body:
        'This chapter of the capstone covers desk research, competitive scans, user interviews, and synthesis into insights, personas, and opportunity maps. It sets the direction for branding, UX, and prototypes that follow.',
      relatedLabel: 'More on process & stories',
      relatedHref: '/blogs',
      relatedText: 'Read the blog',
      heroImg: '/imgs/Frame 37.png',
    },
    ar: {
      eyebrow: 'الاستكشاف',
      title: 'البحث',
      lead: 'أدلة قبل التصميم—لكي يكون كل قرار في مشروع التخرج مرتبطًا باحتياج حقيقي.',
      body:
        'يشمل فصل مشروع التخرج هذا البحث المكتبي، تحليل المنافسين، مقابلات المستخدمين، والتلخيص في رؤى وشخصيات وخرائط فرص. يمهد الطريق للهوية البصرية وتجربة الاستخدام والنماذج التالية.',
      relatedLabel: 'المزيد عن العملية والقصص',
      relatedHref: '/blogs-ar',
      relatedText: 'المدونة',
      heroImg: '/imgs/Frame 37.png',
    },
  },
  branding: {
    en: {
      eyebrow: 'Brand',
      title: 'Branding & visual identity',
      lead: 'A coherent look and feel for the graduation project across touchpoints.',
      body:
        'Logo systems, color and type palettes, art direction, and brand guidelines for the capstone—so the thesis product and collateral stay consistent. Builds on research and is refined through prototype testing.',
      relatedLabel: 'See graphic work',
      relatedHref: '/graphic-design',
      relatedText: 'Graphic design',
      heroImg: '/imgs/graphic-desgin/hero-img.png',
    },
    ar: {
      eyebrow: 'العلامة',
      title: 'الهوية البصرية والبراند',
      lead: 'مظهر متناسق لمشروع التخرج عبر نقاط التماس.',
      body:
        'أنظمة الشعار، ألوان وخطوط، إخراج فني، ودليل هوية للمشروع الختامي—لتطبيق موحّد. يُبنى على نتائج البحث ويُحسَّن عبر النماذج التفاعلية.',
      relatedLabel: 'أعمال الجرافيك',
      relatedHref: '/graphic-design-ar',
      relatedText: 'تصميم جرافيك',
      heroImg: '/imgs/graphic-desgin/hero-img.png',
    },
  },
  'ux-design-system': {
    en: {
      eyebrow: 'Systems',
      title: 'UX & design system',
      lead: 'Structured UX, reusable UI, and documentation for the grad project product.',
      body:
        'Information architecture, flows, components, and a design system—tokens, patterns, and usage rules—so the capstone solution stays coherent from research through prototype.',
      relatedLabel: 'App & product UI',
      relatedHref: '/app-design',
      relatedText: 'App design',
      heroImg: '/imgs/Frame 41.png',
    },
    ar: {
      eyebrow: 'الأنظمة',
      title: 'تجربة المستخدم ونظام التصميم',
      lead: 'تجربة منظمة، واجهات قابلة لإعادة الاستخدام، وتوثيق لمنتج مشروع التخرج.',
      body:
        'هيكلة المعلومات، المسارات، المكوّنات، ونظام تصميم—رموز وأنماط وقواعد—ليبقى حل المشروع الختامي متناسقًا من البحث حتى النموذج.',
      relatedLabel: 'واجهات التطبيقات',
      relatedHref: '/app-design-ar',
      relatedText: 'تصميم تطبيقات',
      heroImg: '/imgs/Frame 41.png',
    },
  },
  prototype: {
    en: {
      eyebrow: 'Validation',
      title: 'Interactive prototype',
      lead: 'Clickable flows to validate the capstone before final handoff.',
      body:
        'High-fidelity interactive prototypes—in Figma or similar—for the grad project: walk reviewers through journeys, gather feedback, and finalize scope for submission or build.',
      relatedLabel: 'Web & product surfaces',
      relatedHref: '/web-design',
      relatedText: 'Web design',
      heroImg: '/imgs/home page/app-design.png',
    },
    ar: {
      eyebrow: 'التحقق',
      title: 'نموذج تفاعلي',
      lead: 'مسارات قابلة للنقر للتحقق من مشروع التخرج قبل التسليم.',
      body:
        'نماذج تفاعلية عالية الدقة—في Figma أو ما شابه—لمشروع التخرج: عرض الرحلات على المقيّمين وجمع الملاحظات وإغلاق النطاق للتسليم أو التطوير.',
      relatedLabel: 'تصميم الويب والمنتج',
      relatedHref: '/web-design-ar',
      relatedText: 'تصميم ويب',
      heroImg: '/imgs/home page/app-design.png',
    },
  },
};

export default function ProjectStagePage({ lang = 'en', stageId }) {
  const isAr = lang === 'ar';
  const locale = isAr ? 'ar' : 'en';
  const stage = STAGES[stageId]?.[locale] || STAGES[stageId]?.en;
  const backPath = isAr ? '/grad-project-ar' : '/grad-project';

  if (!stage) {
    return (
      <Layout lang={isAr ? 'ar' : 'en'}>
        <div className="projects-grid-state">
          <p>Page not found.</p>
          <Link to={backPath}>Back to grad project</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout lang={isAr ? 'ar' : 'en'}>
      <div className={`projects-grid-page ${isAr ? 'projects-stage--ar' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
        <header
          className={`projects-grid-hero ${isAr ? 'projects-grid-hero--ar' : ''}`}
          aria-label={stage.title}
        >
          <div className="container">
            <div className="projects-grid-hero__top">
              <Link className="back-link" to={backPath}>
                {isAr ? '← مشروع التخرج' : '← Grad project'}
              </Link>
            </div>
            <div className="projects-grid-hero__inner">
              <div className="projects-grid-hero__text">
                <p className="projects-grid-hero__eyebrow">{stage.eyebrow}</p>
                <h1 className="projects-grid-hero__title">{stage.title}</h1>
                <p className="lead">{stage.lead}</p>
                <p className="projects-grid-hero__sublead">{stage.body}</p>
                <p className="projects-grid-hero__cta">
                  <Link className="btn project-stage-related" to={stage.relatedHref}>
                    {stage.relatedText}
                  </Link>
                </p>
                <p className="project-stage-related-note">{stage.relatedLabel}</p>
              </div>
              <div className="projects-grid-hero__media">
                <img
                  src={stage.heroImg}
                  alt={stage.title}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </header>

        {stageId === 'research' && (
          <section
            className="stage-document-section container"
            aria-label={isAr ? 'وثيقة البحث FitUp' : 'FitUp research document'}
          >
            <div className="stage-document-card">
              <div className="stage-document-card__header">
                <div className="stage-document-card__titles">
                  <h2 className="stage-document-card__title">
                    {isAr ? 'FitUp — البحث الموسَّع' : 'FitUp — expanded research'}
                  </h2>
                  <p className="stage-document-card__meta">
                    {isAr ? 'مستند PDF · مشروع التخرج' : 'PDF document · Grad project deliverable'}
                  </p>
                </div>
                <div className="stage-document-card__actions">
                  <a
                    className="stage-doc-btn"
                    href={FITUP_RESEARCH_PDF}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {isAr ? 'فتح في نافذة جديدة' : 'Open in new tab'}
                  </a>
                  <a
                    className="stage-doc-btn stage-doc-btn--primary"
                    href={FITUP_RESEARCH_PDF}
                    download="FitUp_Expanded_Research-2.pdf"
                  >
                    {isAr ? 'تنزيل' : 'Download'}
                  </a>
                </div>
              </div>
              <div className="stage-document-card__viewer">
                <iframe
                  className="stage-pdf-iframe"
                  title={
                    isAr
                      ? 'معاينة FitUp — البحث الموسَّع'
                      : 'FitUp expanded research PDF preview'
                  }
                  src={FITUP_RESEARCH_PDF}
                />
              </div>
              <p className="stage-pdf-hint">
                {isAr
                  ? 'إذا لم تظهر المعاينة، استخدمي «فتح في نافذة جديدة» أو «تنزيل».'
                  : 'If the preview does not load, use Open or Download—some browsers limit inline PDFs.'}
              </p>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

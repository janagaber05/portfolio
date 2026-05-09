import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORY_NAV_AR } from '../data/categoryNavItems';
import { useSectionContent } from '../hooks/useHomeContent';
import './ProjectsGrid.css';
import './CategoryPages.css';

const CATEGORY_HERO_IMG = '/imgs/category/hero-category.png';
const CARD_HINT = 'عرض';

export default function CategoryAR() {
  const { getContent } = useSectionContent('category', 'ar');
  const [hero, setHero] = useState({ title: '', subline: '', muted: '' });

  useEffect(() => {
    setHero({
      title: getContent('category_hero_title') || 'أعمالي',
      subline: getContent('category_hero_subtitle') || 'استكشفي مشاريعي الإبداعية',
      muted: getContent('category_hero_description') || 'مجموعة من تصميمات UX/UI ومشاريع الويب والأعمال الإبداعية',
    });
  }, [getContent]);

  return (
    <Layout lang="ar">
      <header
        className="projects-grid-hero projects-grid-hero--ar category-hero"
        id="top"
        aria-label="غلاف الأعمال"
      >
        <div className="container">
          <div className="projects-grid-hero__inner">
            <div className="projects-grid-hero__text">
              <p className="projects-grid-hero__eyebrow">التصنيفات</p>
              <h1 className="projects-grid-hero__title">{hero.title}</h1>
              <p className="lead">{hero.subline}</p>
              {hero.muted ? <p className="projects-grid-hero__sublead">{hero.muted}</p> : null}
              <p className="projects-grid-hero__cta">
                <a className="btn" href="#cats">
                  استكشفي المزيد
                </a>
              </p>
            </div>
            <div className="projects-grid-hero__media">
              <img
                src={CATEGORY_HERO_IMG}
                alt={hero.title}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="cat-cards-section" id="cats" aria-label="تصنيفات الأعمال">
        <div className="container">
          <header className="cat-cards-section__head">
            <p className="cat-cards-section__eyebrow">تصفحي حسب النوع</p>
            <h2>اختاري تصنيفاً</h2>
            <p>كل بطاقة تؤدي إلى ذلك الجزء من الأعمال—تطبيقات، ويب، جرافيك، وغيرها.</p>
          </header>
          <ul className="cat-cards-grid">
            {CATEGORY_NAV_AR.map((item) => (
              <li key={item.href}>
                <Link
                  className="cat-card"
                  to={item.href}
                  aria-label={`${item.title}: ${CARD_HINT}`}
                >
                  <div className="cat-card__media">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="cat-card__body">
                    <h3 className="cat-card__title">{item.title}</h3>
                    <p className="cat-card__hint">{CARD_HINT}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cta-band" id="contact" aria-label="دعوة للتواصل" style={{ backgroundImage: "url('/imgs/us working together.png')" }}>
        <div className="container">
          <p className="muted muted-centered">{getContent('category_cta_text') || 'تعرفي ما الذي ينقص؟'}</p>
          <h3 className="section-title centered section-title-spaced">{getContent('category_cta_title') || 'أن نعمل معاً'}</h3>
          <p className="btn-wrapper-centered"><a className="btn" href="/ar#contact">{getContent('category_cta_button') || 'تواصلي معي'}</a></p>
        </div>
      </section>
    </Layout>
  );
}

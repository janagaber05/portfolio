import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORY_NAV_EN } from '../data/categoryNavItems';
import { supabase } from './Supabase';
import './ProjectsGrid.css';
import './CategoryPages.css';

const CATEGORY_HERO_IMG = '/imgs/category/hero-category.png';
const CARD_HINT = 'View';

export default function CategoryEN() {
  const [categoryContent, setCategoryContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllCategoryContentAPI() {
      try {
        let res = await supabase.from('home_about_category_content').select('*').eq('section', 'category');

        if (res.error) {
          res = await supabase.from('homeـ_about_category_content').select('*').eq('section', 'category');
        }

        if (res.error) {
          console.error('CategoryEN Error:', res.error);
        }

        if (res.data) {
          setCategoryContent(res.data || []);
        }
      } catch (err) {
        console.error('CategoryEN - Exception:', err);
      } finally {
        setLoading(false);
      }
    }

    getAllCategoryContentAPI();
  }, []);

  const getContent = (key) => {
    const item = categoryContent.find((row) => row.key === key);
    return item?.content_en || '';
  };

  if (loading) return <Layout lang="en"><div>Loading...</div></Layout>;

  const heroTitle = getContent('category_hero_title') || 'My Work';
  const heroSub = getContent('category_hero_subtitle') || 'Explore my creative projects';
  const heroDesc =
    getContent('category_hero_description') ||
    'A collection of UX/UI designs, web projects, and creative work';

  return (
    <Layout lang="en">
      <header className="projects-grid-hero category-hero" id="top" aria-label="Work hero">
        <div className="container">
          <div className="projects-grid-hero__inner">
            <div className="projects-grid-hero__text">
              <p className="projects-grid-hero__eyebrow">Categories</p>
              <h1 className="projects-grid-hero__title">{heroTitle}</h1>
              <p className="lead">{heroSub}</p>
              {heroDesc ? <p className="projects-grid-hero__sublead">{heroDesc}</p> : null}
              <p className="projects-grid-hero__cta">
                <a className="btn" href="#cats">
                  Explore More
                </a>
              </p>
            </div>
            <div className="projects-grid-hero__media">
              <img
                src={CATEGORY_HERO_IMG}
                alt={heroTitle}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </header>

      <section className="cat-cards-section" id="cats" aria-label="Work categories">
        <div className="container">
          <header className="cat-cards-section__head">
            <p className="cat-cards-section__eyebrow">Browse by type</p>
            <h2>Pick a category</h2>
            <p>Each card links to that part of the portfolio—apps, web, graphics, and more.</p>
          </header>
          <ul className="cat-cards-grid">
            {CATEGORY_NAV_EN.map((item) => (
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

      <section className="cta-band" id="contact" aria-label="Contact CTA" style={{ backgroundImage: "url('/imgs/us working together.png')" }}>
        <div className="container">
          <p className="muted muted-centered">{getContent('category_cta_text') || "Do you know what's Missing"}</p>
          <h3 className="section-title centered section-title-spaced">{getContent('category_cta_title') || 'Us Working Together'}</h3>
          <p className="btn-wrapper-centered"><a className="btn" href="/#contact">{getContent('category_cta_button') || 'Contact me'}</a></p>
        </div>
      </section>
    </Layout>
  );
}

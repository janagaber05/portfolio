import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TiltedCard from '../components/TiltedCard';
import LiquidEther from '../components/LiquidEther';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../lib/api/blogs';
import './BlogsEN.css';

export default function BlogsEN() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getAllBlogsAPI() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getAllBlogs();
      
      if (fetchError) {
        console.error('Error fetching blogs:', fetchError);
        setError(fetchError);
        setBlogPosts([]);
      } else {
        setBlogPosts(data || []);
      }
      setLoading(false);
    }
    
    getAllBlogsAPI();
  }, []);

  // Separate recent and past posts
  const recentPosts = blogPosts.slice(0, 3);
  const pastPosts = blogPosts.slice(3);
  return (
    <Layout lang="en">
      <div className="blogs-page">
        <div className="blogs-page__bg" aria-hidden="true">
          <LiquidEther
            colors={[ '#5227FF', '#FF9FFC', '#B19EEF', '#0D1017' ]}
            mouseForce={16}
            cursorSize={120}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.6}
            isBounce={false}
            autoDemo
            autoSpeed={0.45}
            autoIntensity={2}
            takeoverDuration={0.25}
            autoResumeDelay={2500}
            autoRampDuration={0.5}
          />
        </div>
        <div className="blogs-page__content">
          <section className="container blogs-hero" aria-label="Blogs hero">
            <div className="blogs-hero__text">
              <span className="blogs-hero__badge">Insights & Stories</span>
              <h1 className="blogs-hero__title">Jana Gaber Blog — Cairo UI/UX Designer Insights</h1>
              <p className="blogs-hero__intro">
                Welcome to my corner of the internet. I share process notes, Cairo-rooted case studies, and candid
                reflections on building charming, inclusive product experiences.
              </p>
              <div className="blogs-hero__cta">
                <a className="btn" href="/#contact">
                  Contact me
                </a>
              </div>
            </div>
            <div className="blogs-hero__media">
              <TiltedCard
                imageSrc="/imgs/blog page/blog-hero.png"
                altText="Blogs illustration"
                captionText="Blog hero art"
                containerHeight="360px"
                containerWidth="100%"
                imageHeight="360px"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.12}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>
          </section>

          <section className="container blogs-section" aria-label="Recent blogs">
            <div className="blogs-section__header">
              <h3 className="section-label">Recent Blogs</h3>
              <p className="blogs-section__sub">
                Fresh write-ups capturing what I&apos;m experimenting with right now—from client journeys to playful UI
                research.
              </p>
            </div>

            <div className="blogs-grid">
              {error && !loading ? (
                <p className="blogs-section__error" role="alert">
                  Could not load posts. Please try again later.
                </p>
              ) : null}
              {loading ? (
                <div>Loading...</div>
              ) : recentPosts.length > 0 ? (
                recentPosts.map(post => (
                  <article key={post.id} className="blog-card">
                    <div className="blog-card__media">
                      <TiltedCard
                        imageSrc={post.featured_image}
                        altText={post.title_en}
                        captionText={post.title_en}
                        containerHeight="260px"
                        containerWidth="100%"
                        imageHeight="260px"
                        imageWidth="100%"
                        rotateAmplitude={12}
                        scaleOnHover={1.12}
                        showMobileWarning={false}
                        showTooltip={false}
                        displayOverlayContent={false}
                      />
                    </div>
                    <h4 className="blog-card__title">
                      <Link className="blog-card__link" to={`/blog/${post.slug}`}>
                        {post.title_en}
                      </Link>
                    </h4>
                    <p className="blog-card__excerpt">{post.excerpt_en}</p>
                    <div className="blog-card__actions">
                      <Link className="pill" to={`/blog/${post.slug}`}>
                        Read Blog
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div>No blog posts found</div>
              )}
            </div>
          </section>

          <section className="container blogs-section" aria-label="Past blogs slider">
            <div className="blogs-section__header">
              <h3 className="section-label">Past Blogs</h3>
              <p className="blogs-section__sub">
                Missed an earlier drop? Scroll through the archive for timeless lessons, motion snippets, and product
                musings.
              </p>
            </div>

            <div className="blogs-slider">
              <button className="blogs-slider__arrow blogs-slider__arrow--prev" type="button" aria-label="Previous blog">
                ‹
              </button>
              <div className="blogs-slider__track">
                {loading ? (
                  <div>Loading...</div>
                ) : pastPosts.length > 0 ? (
                  pastPosts.map(post => (
                    <article key={post.id} className="blog-card blog-card--compact">
                      <div className="blog-card__media">
                        <img src={post.featured_image} alt={post.title_en} loading="lazy" />
                      </div>
                      <h4 className="blog-card__title">{post.title_en}</h4>
                      <p className="blog-card__excerpt">{post.excerpt_en}</p>
                      <div className="blog-card__actions">
                        <Link className="pill" to={`/blog/${post.slug}`}>
                          Read Blog
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div>No past blog posts found</div>
                )}
              </div>
              <button className="blogs-slider__arrow blogs-slider__arrow--next" type="button" aria-label="Next blog">
                ›
              </button>
            </div>

            <div className="blogs-dots" role="tablist" aria-label="Blog pagination">
              <button className="blogs-dots__dot blogs-dots__dot--active" type="button" aria-label="Page 1" />
              <button className="blogs-dots__dot" type="button" aria-label="Page 2" />
              <button className="blogs-dots__dot" type="button" aria-label="Page 3" />
            </div>
          </section>
        </div>
      </div>

      <section className="cta-band" id="contact" aria-label="Contact CTA" style={{ backgroundImage: "url('/imgs/us working together.png')" }}>
        <div className="container centered">
          <p className="muted">Do you know what’s Missing</p>
          <h3 className="section-title centered">Us Working Together</h3>
          <p>
            <a className="btn" href="/#contact">
              Contact me
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
}


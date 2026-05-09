import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SplitText from '../components/SplitText';
import LiquidEther from '../components/LiquidEther';
import BounceCards from '../components/BounceCards';
import TiltedCard from '../components/TiltedCard';
import CurvedLoop from '../components/CurvedLoop';
import MagicBento from '../components/MagicBento';
import './HomeTwo.css';
import Footer from '../components/Footer';
import { supabase } from './Supabase';

const socialIconSetAr = [
  { icon: 'youtube', label: 'يوتيوب' },
  { icon: 'instagram', label: 'إنستجرام' },
  { icon: 'linkedin', label: 'لينكد إن' },
  { icon: 'tiktok', label: 'تيك توك' },
  { icon: 'facebook', label: 'فيسبوك' },
];

const renderContactIconAr = icon => {
  switch (icon) {
    case 'youtube':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M28.7 10.1a3.8 3.8 0 0 0-2.7-2.8C24 6.8 16 6.8 16 6.8s-8 0-10 .5a3.8 3.8 0 0 0-2.7 2.8 40.6 40.6 0 0 0-.6 7.2 40.6 40.6 0 0 0 .6 7.2 3.8 3.8 0 0 0 2.7 2.8c2 .6 10 .5 10 .5s8 0 10-.5a3.8 3.8 0 0 0 2.7-2.8 40.6 40.6 0 0 0 .6-7.2 40.6 40.6 0 0 0-.6-7.2Z"
            fill="url(#ytGradientAr)"
          />
          <path d="m13.2 12 7.6 5-7.6 5Z" fill="#0d0b17" />
          <defs>
            <linearGradient id="ytGradientAr" x1="4" x2="28" y1="8" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff7add" />
              <stop offset="1" stopColor="#8d5bff" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="igGradientAr" x1="4" x2="28" y1="4" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff9ffc" />
              <stop offset="1" stopColor="#7054ff" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="22" height="22" rx="6" fill="url(#igGradientAr)" />
          <circle cx="16" cy="16" r="5.5" fill="none" stroke="#0d0b17" strokeWidth="2" />
          <circle cx="23" cy="9" r="1.5" fill="#0d0b17" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="liGradientAr" x1="8" x2="24" y1="8" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a38dff" />
              <stop offset="1" stopColor="#5b4ccf" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="20" height="20" rx="4" fill="url(#liGradientAr)" />
          <path
            d="M11.5 13.5v10m0-13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm4 13v-6.2m0 0c0-1.3.9-2.3 2.3-2.3 1.3 0 2.2.9 2.2 2.3V23.5"
            stroke="#0d0b17"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="ttGradientAr" x1="8" x2="26" y1="6" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#58f8ff" />
              <stop offset="1" stopColor="#f94cff" />
            </linearGradient>
          </defs>
          <path
            d="M18.5 9.4c0 4.2 3.4 6.3 6 6.3v3.6a8.4 8.4 0 0 1-4.7-1.4l-.2 5.5a6.8 6.8 0 1 1-6.8-6.2c.4 0 .8 0 1.2.1v3.8a3.2 3.2 0 1 0 2.9 3.1Z"
            fill="url(#ttGradientAr)"
            stroke="#0d0b17"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'facebook':
    default:
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="fbGradientAr" x1="6" x2="26" y1="6" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a78bff" />
              <stop offset="1" stopColor="#4a3ad1" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="20" height="20" rx="5" fill="url(#fbGradientAr)" />
          <path
            d="M19 11h-2.2a2 2 0 0 0-2 2v2h-2v3h2v6h3v-6H20l.4-3h-2.6v-1.2c0-.4.3-.8.8-.8H20Z"
            fill="#0d0b17"
          />
        </svg>
      );
  }
};

export default function HomeTwoAR() {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const startY = useRef(0);
  const [entering, setEntering] = useState(true);

  // API state
  const [homeContent, setHomeContent] = useState([]);
  const [strengthCards, setStrengthCards] = useState([]);
  const [valuesCards, setValuesCards] = useState([]);
  const [growingCards, setGrowingCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const strengthTransforms = [
    'rotate(5deg) translate(-150px)',
    'rotate(1deg) translate(-70px)',
    'rotate(-2deg)',
    'rotate(2deg) translate(70px)',
    'rotate(-4deg) translate(150px)',
  ];

  // Fetch data from Supabase
  useEffect(() => {
    async function getAllHomeContentAPI() {
      try {
        let res = await supabase.from("homeـ_about_category_content").select("*").eq("section", "home");
        if (res.error) {
          console.error("HomeTwoAR Error:", res.error);
        }
        if (res.data) {
          setHomeContent(res.data || []);
          res.data.forEach(item => {
            if (item.metadata) {
              try {
                const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
                // Handle strengths - can be metadata.cards or metadata.strengths
                if (item.key === 'strengths') {
                  const cards = metadata.cards || metadata.strengths || [];
                  if (cards.length > 0) setStrengthCards(cards);
                }
                // Handle values - can be metadata.cards or metadata.values
                if (item.key === 'values') {
                  const cards = metadata.cards || metadata.values || [];
                  if (cards.length > 0) setValuesCards(cards);
                }
                // Handle growing
                if (item.key === 'growing' && metadata.cards) {
                  setGrowingCards(metadata.cards);
                }
              } catch (e) {
                console.error('Error parsing metadata for', item.key, e);
              }
            }
          });
        }
      } catch (err) {
        console.error("HomeTwoAR - Exception:", err);
      } finally {
        setLoading(false);
      }
    }

    getAllHomeContentAPI();
  }, []);

  const getContent = (key) => {
    const item = homeContent.find(i => i.key === key);
    return item?.content_ar || '';
  };

  useEffect(() => {
    const timeout = setTimeout(() => setEntering(false), 40);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    let wheelUpTotal = 0;
    let locked = false;

    const triggerBack = () => {
      if (locked) return;
      locked = true;
      wheelUpTotal = 0;
      navigate('/ar', {
        replace: true,
        state: { from: 'home-two', carryScroll: location.state?.carryScroll || false },
      });
    };

    const onWheel = (event) => {
      if (event.deltaY < 0) {
        wheelUpTotal += event.deltaY;
        if (wheelUpTotal < -80) {
          wheelUpTotal = 0;
          triggerBack();
        }
      } else {
        wheelUpTotal = 0;
      }
    };

    const onTouchStart = (event) => {
      if (event.touches.length === 1) startY.current = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
      if (startY.current && event.touches[0].clientY - startY.current > 110) {
        triggerBack();
      }
    };

    node.addEventListener('wheel', onWheel, { passive: true });
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
    };
  }, [location.state, navigate]);

  return (
    <Layout lang="ar" hideFooter>
      <div className="home-two-page">
        <div className="home-two-page__bg" aria-hidden="true">
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

        <div className="home-two-page__content">
          <section
            ref={rootRef}
            className={`home-two ${entering ? 'home-two--enter' : ''}`}
            aria-label="تعرف عليّ"
          >
            <div className="home-two__inner container">
              <div className="home-two__photo" aria-hidden="true">
                <img src="/imgs/home page/hero-img.png" alt="صورة جنا أحمد" />
              </div>
              <div className="home-two__card" role="region" aria-label="تعرف عليّ">
                <h2>{getContent('know_me_title') || ''}</h2>
                <p>{getContent('know_me_description') || ''}</p>
              </div>
            </div>
          </section>

          <section className="home-two-services" aria-label="قسم تصميم المواقع">
            <div className="container home-two-services__layout">
              <div className="home-two-services__labels" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SplitText
                    key={index}
                    text="تصميم مواقع"
                    className="home-two-services__label-item"
                    tag="span"
                    delay={60}
                    duration={0.45}
                    ease="power3.out"
                    from={{ opacity: 0, y: 32 }}
                    to={{ opacity: index === 0 ? 1 : 0.24, y: 0 }}
                    threshold={0.2}
                    rootMargin="-120px"
                    textAlign="right"
                  />
                ))}
              </div>
              <figure className="home-two-services__figure" role="presentation">
                <div className="home-two-services__figure-glow" aria-hidden="true" />
                <img
                  src="/imgs/home page/web-design.png"
                  alt="عرض لتصميم مواقع"
                  loading="lazy"
                />
              </figure>
            </div>
          </section>

          <section className="home-two-approach" aria-label="منهجي في التصميم">
            <div className="container home-two-approach__grid">
              <figure className="home-two-approach__media">
                <img
                  src="/imgs/home page/my-approach.png"
                  alt="لوحة تعرض خطوات تصميم واجهة المستخدم"
                  loading="lazy"
                />
              </figure>
              <div className="home-two-approach__text">
                <h3>{getContent('approach_title') || ''}</h3>
                <p>
                  {getContent('approach_description') || ''}
                </p>
              </div>
            </div>
          </section>

          <section className="home-two-skills" aria-label="المهارات والتعليم">
            <div className="container home-two-skills__grid">
              <div className="home-two-skills__panel" dir="rtl">
                <div className="home-two-skills__title">
                  <h3>المهارات التقنية</h3>
                  <p>كمصممة UX/UI</p>
                </div>
                <div className="home-two-skills__matrix" role="list">
                  {[
                    { key: 'ps-1', label: 'PS' },
                    { key: 'pr', label: 'PR' },
                    { key: 'an', label: 'AN' },
                    { key: 'lr', label: 'LR' },
                    { key: 'figma', type: 'figma', label: 'Figma' },
                    { key: 'ps-2', label: 'PS' },
                    { key: 'adobe', type: 'adobe', label: 'Adobe' },
                    { key: 'ae', label: 'AE' },
                    { key: 'ai', label: 'AI' },
                    { key: 'css', label: 'CSS' },
                    { key: 'html', label: 'HTML' },
                    { key: 'js', label: 'JS' },
                  ].map(({ key, label, type }) => (
                    <span
                      key={key}
                      role="listitem"
                      className={`home-two-skills__icon ${type ? `home-two-skills__icon--${type}` : ''}`}
                      aria-label={type ? label : undefined}
                    >
                      {type === 'figma' ? (
                        <svg viewBox="0 0 60 90" className="home-two-skills__figma" aria-hidden="true">
                          <defs>
                            <clipPath id="figmaClipAr">
                              <rect x="0" y="0" width="60" height="90" rx="18" ry="18" />
                            </clipPath>
                          </defs>
                          <g clipPath="url(#figmaClipAr)">
                            <circle cx="30" cy="18" r="18" fill="#f24e1e" />
                            <circle cx="12" cy="30" r="18" fill="#ff7262" />
                            <circle cx="48" cy="30" r="18" fill="#a259ff" />
                            <circle cx="12" cy="60" r="18" fill="#0acf83" />
                            <circle cx="30" cy="72" r="18" fill="#1abcfe" />
                          </g>
                        </svg>
                      ) : type === 'adobe' ? (
                        <span aria-hidden="true">A</span>
                      ) : (
                        label
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <article className="home-two-education" aria-label="التعليم" dir="rtl">
                <h4>التعليم</h4>
                <ul>
                  <li>
                    <span className="home-two-education__year">2026–2025</span>
                    <span className="home-two-education__school">جامعة مصر للمعلوماتية</span>
                    <span className="home-two-education__program">الفنون الرقمية وتصميم UX/UI</span>
                  </li>
                  <li>
                    <span className="home-two-education__year">2024</span>
                    <span className="home-two-education__school">مركز CLS</span>
                    <span className="home-two-education__program">برمجة الواجهة الأمامية</span>
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <section className="home-two-strengths" aria-label="نقاط القوة">
            <div className="container">
              <h3>نقاط قوتي في تصميم UX/UI</h3>
              <div className="home-two-strengths__deck">
                {strengthCards.length > 0 ? (
                  <BounceCards
                    items={strengthCards}
                    transformStyles={strengthTransforms}
                    containerWidth={640}
                    containerHeight={320}
                    animationDelay={0.6}
                    animationStagger={0.1}
                    easeType="elastic.out(1, 0.6)"
                  />
                ) : (
                  <div style={{ color: '#ccc', textAlign: 'center' }}>{loading ? 'جار التحميل...' : 'لا توجد بيانات'}</div>
                )}
              </div>
            </div>
          </section>

          <section className="home-two-app" aria-label="تصميم التطبيقات">
            <div className="container home-two-app__grid">
              <div className="home-two-app__text">
                <h3>تصميم التطبيقات</h3>
                <p>
                  تدفقات سلسة، حالات UI واضحة وتفاعلات دقيقة تجعل التطبيقات اليومية ممتعة وسهلة.
                </p>
                <p>
                  أحب تحويل الرحلات المعقدة إلى تجارب محمولة مصقولة مع كتابة UX قوية.
                </p>
              </div>
              <div className="home-two-app__media" aria-hidden="true">
                <span className="home-two-app__label">تصميم التطبيقات</span>
                <img src="/imgs/home page/app-design.png" alt="" loading="lazy" />
              </div>
            </div>
          </section>

          <section className="home-two-values" aria-label="القيم">
            <div className="container">
              <h3>قيمــي كمصممة UX/UI</h3>
              <div className="home-two-values__tilted">
                {valuesCards.length > 0 ? (
                  valuesCards.map(({ title, description }, idx) => (
                    <div key={`${title}-${idx}`} className="home-two-values__item">
                      <TiltedCard
                        containerHeight="320px"
                        containerWidth="100%"
                        imageHeight="320px"
                        imageWidth="320px"
                        rotateAmplitude={12}
                        scaleOnHover={1.22}
                        showMobileWarning={false}
                        showTooltip={false}
                        isTextOnly
                        overlayContent={
                          <div className="home-two-values__cardtext home-two-values__cardtext--rtl">
                            <h4>{title}</h4>
                            <p>{description}</p>
                          </div>
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#ccc', textAlign: 'center' }}>{loading ? 'جار التحميل...' : 'لا توجد بيانات'}</div>
                )}
              </div>
            </div>
          </section>

          <section className="home-two-divider" aria-label="اعرفني أكثر">
            <div className="home-two-divider__strip home-two-divider__strip--rtl">
              <CurvedLoop
                marqueeText="اعرفني أكثر ✦ رحلة تصميم ✦ تجربة ثرية ✦"
                speed={4.2}
                curveAmount={0}
                interactive={false}
                className="curved-loop-text"
              />
            </div>
          </section>

          <section className="home-two-tabs" aria-label="ملاحظات شخصية">
            <div className="container" dir="rtl">
              <h3>{getContent('growing_title') || 'رحلتي كمصممة'}</h3>
              {growingCards.length > 0 ? (
                <MagicBento
                  textAutoHide
                  enableStars
                  enableSpotlight
                  enableBorderGlow
                  enableTilt
                  enableMagnetism
                  clickEffect
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="132, 0, 255"
                  cards={growingCards}
                />
              ) : (
                <ul>
                  <li>
                    <h4>أهدافي القادمة</h4>
                    <p>قيادة فرق متعددة التخصصات لصنع منتجات شاملة لعلامات جريئة.</p>
                  </li>
                  <li>
                    <h4>أسلوبي</h4>
                    <p>ألوان جريئة، حركة سينمائية ونبرة إنسانية دائمة.</p>
                  </li>
                  <li>
                    <h4>مصادري للإلهام</h4>
                    <p>التصوير الفوتوغرافي، تصميم السيارات والقصص اليومية المحيطة بي.</p>
                  </li>
                  <li>
                    <h4>تميّزي</h4>
                    <p>مصممة وقصاصة في آن واحد—أطرح الفكرة وأختبرها وأنفذها بثقة.</p>
                  </li>
                </ul>
              )}
            </div>
          </section>

          <section className="home-two-contact" aria-label="فلنبدأ العمل">
            <div className="container" dir="rtl">
              <h2 className="home-two-contact__title">فلنبدأ العمل معًا</h2>
              <div className="home-two-contact__grid home-two-contact__grid--dual">
                <div className="home-two-contact__panel">
                  <form className="home-two-contact__formgrid">
                    <label className="form-field">
                      <span className="form-icon">🙂</span>
                      <input type="text" name="firstName" placeholder="الاسم الأول" />
                    </label>
                    <label className="form-field">
                      <span className="form-icon">🙂</span>
                      <input type="text" name="lastName" placeholder="الاسم الأخير" />
                    </label>
                    <label className="form-field form-field--full">
                      <span className="form-icon">☎</span>
                      <input type="tel" name="phone" placeholder="رقم الهاتف" />
                    </label>
                    <label className="form-field form-field--full">
                      <span className="form-icon">✉</span>
                      <input type="email" name="email" placeholder="بريدك الإلكتروني" />
                    </label>
                    <label className="form-field form-field--full">
                      <span className="form-icon">💬</span>
                      <textarea name="request" rows={4} placeholder="طلبك" />
                    </label>
                    <button type="submit" className="form-submit form-field--full">
                      إرسال <span className="form-icon">✈</span>
                    </button>
                  </form>
                </div>

                <div className="home-two-contact__divider" aria-hidden="true">أو</div>

                <div className="home-two-contact__panel home-two-contact__panel--info">
                  <h3>تواصل معي</h3>
                  <p className="home-two-contact__line">
                    <span>البريد:</span>
                    JanaGaber9201@gamil.Com
                  </p>
                  <p className="home-two-contact__line">
                    <span>رقم الهاتف:</span>
                    01141120002
                  </p>
                  <h4>وسائل التواصل</h4>
                  <div className="home-two-contact__socials">
                    {socialIconSetAr.map(({ icon, label }) => (
                      <button key={icon} type="button" aria-label={label} className="soc-icon">
                        {renderContactIconAr(icon)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          
        </div>
      </div>
      <Footer lang="ar" />
    </Layout>
  );
}


import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SplitText from '../components/SplitText';
import LiquidEther from '../components/LiquidEther';
import BounceCards from '../components/BounceCards';
import TiltedCard from '../components/TiltedCard';
import CurvedLoop from '../components/CurvedLoop';
import MagicBento from '../components/MagicBento';
import Footer from '../components/Footer';
import { supabase } from './Supabase';
import './HomeTwo.css';

const socialIconSet = [
  { icon: 'youtube', label: 'YouTube' },
  { icon: 'instagram', label: 'Instagram' },
  { icon: 'linkedin', label: 'LinkedIn' },
  { icon: 'tiktok', label: 'TikTok' },
  { icon: 'facebook', label: 'Facebook' },
];

const renderContactIcon = icon => {
  switch (icon) {
    case 'youtube':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M28.7 10.1a3.8 3.8 0 0 0-2.7-2.8C24 6.8 16 6.8 16 6.8s-8 0-10 .5a3.8 3.8 0 0 0-2.7 2.8 40.6 40.6 0 0 0-.6 7.2 40.6 40.6 0 0 0 .6 7.2 3.8 3.8 0 0 0 2.7 2.8c2 .6 10 .5 10 .5s8 0 10-.5a3.8 3.8 0 0 0 2.7-2.8 40.6 40.6 0 0 0 .6-7.2 40.6 40.6 0 0 0-.6-7.2Z"
            fill="url(#ytGradient)"
          />
          <path d="m13.2 12 7.6 5-7.6 5Z" fill="#0d0b17" />
          <defs>
            <linearGradient id="ytGradient" x1="4" x2="28" y1="8" y2="24" gradientUnits="userSpaceOnUse">
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
            <linearGradient id="igGradientContact" x1="4" x2="28" y1="4" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff9ffc" />
              <stop offset="1" stopColor="#7054ff" />
            </linearGradient>
          </defs>
          <rect x="5" y="5" width="22" height="22" rx="6" fill="url(#igGradientContact)" />
          <circle cx="16" cy="16" r="5.5" fill="none" stroke="#0d0b17" strokeWidth="2" />
          <circle cx="23" cy="9" r="1.5" fill="#0d0b17" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="liGradientContact" x1="8" x2="24" y1="8" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a38dff" />
              <stop offset="1" stopColor="#5b4ccf" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="20" height="20" rx="4" fill="url(#liGradientContact)" />
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
            <linearGradient id="ttGradientContact" x1="8" x2="26" y1="6" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#58f8ff" />
              <stop offset="1" stopColor="#f94cff" />
            </linearGradient>
          </defs>
          <path
            d="M18.5 9.4c0 4.2 3.4 6.3 6 6.3v3.6a8.4 8.4 0 0 1-4.7-1.4l-.2 5.5a6.8 6.8 0 1 1-6.8-6.2c.4 0 .8 0 1.2.1v3.8a3.2 3.2 0 1 0 2.9 3.1Z"
            fill="url(#ttGradientContact)"
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
            <linearGradient id="fbGradientContact" x1="6" x2="26" y1="6" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a78bff" />
              <stop offset="1" stopColor="#4a3ad1" />
            </linearGradient>
          </defs>
          <rect x="6" y="6" width="20" height="20" rx="5" fill="url(#fbGradientContact)" />
          <path
            d="M19 11h-2.2a2 2 0 0 0-2 2v2h-2v3h2v6h3v-6H20l.4-3h-2.6v-1.2c0-.4.3-.8.8-.8H20Z"
            fill="#0d0b17"
          />
        </svg>
      );
  }
};

export default function HomeTwoEN() {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const startY = useRef(0);
  const [entering, setEntering] = useState(true);
  
  // Hardcoded skills (matching your design)
  const hardcodedSkills = [
    { id: 1, name: 'PS', type: 'adobe' },
    { id: 2, name: 'PR', type: 'adobe' },
    { id: 3, name: 'AN', type: 'adobe' },
    { id: 4, name: 'LR', type: 'adobe' },
    { id: 5, name: 'Figma', type: 'figma' },
    { id: 6, name: 'PS', type: 'adobe' },
    { id: 7, name: 'Adobe Acrobat', type: 'adobe-icon' },
    { id: 8, name: 'AE', type: 'adobe' },
    { id: 9, name: 'AI', type: 'adobe' },
    { id: 10, name: 'CSS', type: 'code' },
    { id: 11, name: 'HTML', type: 'code' },
    { id: 12, name: 'JS', type: 'code' },
  ];

  // API State
  const [homeContent, setHomeContent] = useState([]);
  const [skills] = useState(hardcodedSkills);
  const [experience, setExperience] = useState([]);
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
        // Try without special character first
        let res = await supabase.from("home_about_category_content").select("*").eq("section", "home");
        console.log("HomeTwoEN - First try (without special char):", res);
        
        // If that fails, try with special character
        if (res.error) {
          console.log("HomeTwoEN - Trying with special character...");
          res = await supabase.from("homeـ_about_category_content").select("*").eq("section", "home");
          console.log("HomeTwoEN - Second try (with special char):", res);
        }
        
        if (res.error) {
          console.error("HomeTwoEN Error:", res.error);
        }
        
        if (res.data) {
          console.log("HomeTwoEN - Data received:", res.data.length, "items");
          console.log("HomeTwoEN - Full data:", res.data);
          console.log("HomeTwoEN - All keys:", res.data.map(item => item.key));
          setHomeContent(res.data || []);
          
          // Parse metadata for cards
          res.data.forEach(item => {
            console.log(`📌 HomeTwoEN - Processing item:`);
            console.log(`   Key: "${item.key}"`);
            console.log(`   Section: "${item.section}"`);
            console.log(`   Has content_en: ${item.content_en ? 'YES' : 'NO'}`);
            if (item.content_en) {
              console.log(`   content_en preview: ${item.content_en.substring(0, 50)}...`);
            }
            if (item.metadata) {
              try {
                const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
                console.log(`Metadata for ${item.key}:`, metadata);
                
                // Handle strengths - can be metadata.cards or metadata.strengths
                if (item.key === 'strengths') {
                  const cards = metadata.cards || metadata.strengths || [];
                  if (cards.length > 0) {
                    console.log("✅ Setting strength cards:", cards.length);
                    setStrengthCards(cards);
                  }
                }
                // Handle values - can be metadata.cards or metadata.values
                if (item.key === 'values') {
                  const cards = metadata.cards || metadata.values || [];
                  if (cards.length > 0) {
                    console.log("✅ Setting values cards:", cards.length);
                    setValuesCards(cards);
                  }
                }
                // Handle growing - can be metadata.cards
                if (item.key === 'growing' && metadata.cards) {
                  console.log("✅ Setting growing cards:", metadata.cards.length);
                  setGrowingCards(metadata.cards);
                }
              } catch (e) {
                console.error('Error parsing metadata for', item.key, e);
              }
            }
          });
        } else {
          console.warn("HomeTwoEN - No data in response");
        }
      } catch (err) {
        console.error("HomeTwoEN - Exception:", err);
      } finally {
        setLoading(false);
      }
    }
    
    // Skills are now hardcoded, no need to fetch from API
    
    async function getAllExperienceAPI() {
      try {
        const res = await supabase.from("experience").select("*");
        console.log("Experience:", res);
        if (res.data) {
          setExperience(res.data || []);
        }
      } catch (err) {
        console.error("Experience API Error:", err);
      }
    }
    
    getAllHomeContentAPI();
    getAllExperienceAPI();
  }, []);

  // Helper function to get content by key
  const getContent = (key) => {
    const item = homeContent.find(item => item.key === key);
    if (!item) {
      console.log(`❌ Content not found for key: "${key}"`);
      console.log('📋 Available keys in database:', homeContent.map(c => c.key));
      console.log('📋 Full homeContent array:', homeContent);
    } else {
      console.log(`✅ Found content for key: "${key}"`);
      console.log(`   Content:`, item.content_en ? "HAS CONTENT" : "EMPTY");
    }
    return item?.content_en || '';
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
      navigate('/', {
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

  if (loading) return <Layout lang="en" hideFooter><div>Loading...</div></Layout>;

  return (
    <Layout lang="en" hideFooter>
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
            aria-label="Know Me section"
          >
            <div className="home-two__inner container">
              <div className="home-two__photo" aria-hidden="true">
                <img src="/imgs/home page/hero-img.png" alt="Jana Ahmed portrait side profile" />
              </div>
              <div className="home-two__card" role="region" aria-label="Know Me card">
                <h2>{getContent('know_me_title') || 'Know Me (No data from API)'}</h2>
                <div dangerouslySetInnerHTML={{ __html: getContent('know_me_content') || '<p>No content from API</p>' }} />
              </div>
            </div>
          </section>

          <section className="home-two-services" aria-label="Featured web design focus">
            <div className="container home-two-services__layout">
              <div className="home-two-services__labels" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SplitText
                    key={index}
                    text="Web design"
                    className="home-two-services__label-item"
                    tag="span"
                    delay={60}
                    duration={0.45}
                    ease="power3.out"
                    from={{ opacity: 0, y: 32 }}
                    to={{ opacity: index === 0 ? 1 : 0.24, y: 0 }}
                    threshold={0.2}
                    rootMargin="-120px"
                    textAlign="left"
                  />
                ))}
              </div>
              <figure className="home-two-services__figure" role="presentation">
                <div className="home-two-services__figure-glow" aria-hidden="true" />
                <img
                  src="/imgs/home page/web-design.png"
                  alt="Web design featured project"
                  loading="lazy"
                />
              </figure>
            </div>
          </section>

          <section className="home-two-approach" aria-label="Design approach">
            <div className="container home-two-approach__grid">
              <figure className="home-two-approach__media">
                <img
                  src="/imgs/home page/my-approach.png"
                  alt="Web design workflow boards and UI screens"
                  loading="lazy"
                />
              </figure>
              <div className="home-two-approach__text">
                <h3>{getContent('approach_title')}</h3>
                <div dangerouslySetInnerHTML={{ __html: getContent('approach_content') }} />
              </div>
            </div>
          </section>

          <section className="home-two-skills" aria-label="Skills and education">
            <div className="container home-two-skills__grid">
              <div className="home-two-skills__panel">
                <div className="home-two-skills__title">
                  <h3>Technical skills</h3>
                  <p>as a UX/UI designer</p>
                </div>
                <div className="home-two-skills__matrix" role="list">
                  {skills.map((skill) => {
                    const isFigma = skill.type === 'figma';
                    const isAdobeIcon = skill.type === 'adobe-icon';
                    
                    return (
                      <span
                        key={skill.id}
                        role="listitem"
                        className={`home-two-skills__icon ${isFigma ? 'home-two-skills__icon--figma' : ''} ${isAdobeIcon ? 'home-two-skills__icon--adobe' : ''}`}
                        aria-label={skill.name}
                      >
                        {isFigma ? (
                          <svg viewBox="0 0 60 90" className="home-two-skills__figma" aria-hidden="true">
                            <defs>
                              <clipPath id="figmaClip">
                                <rect x="0" y="0" width="60" height="90" rx="18" ry="18" />
                              </clipPath>
                            </defs>
                            <g clipPath="url(#figmaClip)">
                              <circle cx="30" cy="18" r="18" fill="#f24e1e" />
                              <circle cx="12" cy="30" r="18" fill="#ff7262" />
                              <circle cx="48" cy="30" r="18" fill="#a259ff" />
                              <circle cx="12" cy="60" r="18" fill="#0acf83" />
                              <circle cx="30" cy="72" r="18" fill="#1abcfe" />
                            </g>
                          </svg>
                        ) : isAdobeIcon ? (
                          <span className="home-two-skills__adobe-a" aria-hidden="true">A</span>
                        ) : (
                          skill.name
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <article className="home-two-education" aria-label="Education">
                <h4>Education</h4>
                <ul>
                  {experience
                    .filter(exp => exp.type === 'education')
                    .map((edu) => (
                      <li key={edu.id}>
                        <span className="home-two-education__year">
                          {edu.year_display || `${edu.year_start}${edu.year_end ? `–${edu.year_end}` : ''}`}
                        </span>
                        <span className="home-two-education__school">{edu.instution_en || edu.institution_en}</span>
                        <span className="home-two-education__program">{edu.program_en}</span>
                      </li>
                    ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="home-two-strengths" aria-label="Strengths">
            <div className="container">
              <h3>{getContent('strengths_title')}</h3>
              {strengthCards.length > 0 && (
                <div className="home-two-strengths__deck">
                  <BounceCards
                    items={strengthCards}
                    transformStyles={strengthTransforms}
                    containerWidth={640}
                    containerHeight={320}
                    animationDelay={0.6}
                    animationStagger={0.1}
                    easeType="elastic.out(1, 0.6)"
                  />
                </div>
              )}
            </div>
          </section>

          <section className="home-two-app" aria-label="App design">
            <div className="container home-two-app__grid">
              <div className="home-two-app__text">
                <h3>{getContent('app_design_title')}</h3>
                <div dangerouslySetInnerHTML={{ __html: getContent('app_design_content') }} />
              </div>
              <div className="home-two-app__media" aria-hidden="true">
                <span className="home-two-app__label">App design</span>
                <img src="/imgs/home page/app-design.png" alt="" loading="lazy" />
              </div>
            </div>
          </section>

          <section className="home-two-values" aria-label="Values">
            <div className="container">
              <h3>{getContent('values_title')}</h3>
              {valuesCards.length > 0 && (
                <div className="home-two-values__tilted">
                  {valuesCards.map((card, index) => (
                    <div key={index} className="home-two-values__item">
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
                          <div className="home-two-values__cardtext">
                            <h4>{card.title}</h4>
                            <p>{card.description}</p>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="home-two-divider" aria-label="Know me better strip">
            <div className="home-two-divider__strip">
              <CurvedLoop
                marqueeText="Know me better ✦ UX / UI Journey ✦ Motion ✦ Detail ✦"
                speed={4.2}
                curveAmount={0}
                interactive={false}
              />
            </div>
          </section>

          <section className="home-two-tabs" aria-label="Growing as a designer">
            <div className="container">
              <h3>{getContent('growing_title')}</h3>
              {growingCards.length > 0 && (
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
              )}
            </div>
          </section>

          <section className="home-two-contact" aria-label="Work together">
            <div className="container">
              <h2 className="home-two-contact__title">Let’s Work Together</h2>
              <div className="home-two-contact__grid home-two-contact__grid--dual">
                <div className="home-two-contact__panel">
                  <form className="home-two-contact__formgrid">
                    <label className="form-field">
                      <span className="form-icon">🙂</span>
                      <input type="text" name="firstName" placeholder="First Name" />
                    </label>
                    <label className="form-field">
                      <span className="form-icon">🙂</span>
                      <input type="text" name="lastName" placeholder="Last Name" />
                    </label>
                    <label className="form-field form-field--full">
                      <span className="form-icon">☎</span>
                      <input type="tel" name="phone" placeholder="Phone no" />
                    </label>
                    <label className="form-field form-field--full">
                      <span className="form-icon">✉</span>
                      <input type="email" name="email" placeholder="Your Email" />
                    </label>
                    <label className="form-field form-field--full">
                      <span className="form-icon">💬</span>
                      <textarea name="request" rows={4} placeholder="Your request" />
                    </label>
                    <button type="submit" className="form-submit form-field--full">
                      Send <span className="form-icon">✈</span>
                    </button>
                  </form>
                </div>

                <div className="home-two-contact__divider" aria-hidden="true">Or</div>

                <div className="home-two-contact__panel home-two-contact__panel--info">
                  <h3>Contact Me</h3>
                  <p className="home-two-contact__line">
                    <span>Email:</span>
                    JanaGaber9201@gamil.Com
                  </p>
                  <p className="home-two-contact__line">
                    <span>Phone no:</span>
                    01141120002
                  </p>
                  <h4>Social Media</h4>
                  <div className="home-two-contact__socials">
                    {socialIconSet.map(({ icon, label }) => (
                      <button key={icon} type="button" aria-label={label} className="soc-icon">
                        {renderContactIcon(icon)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          
        </div>
      </div>
      <Footer lang="en" />
    </Layout>
  );
}


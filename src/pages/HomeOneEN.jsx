import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LiquidEther from '../components/LiquidEther';
import { supabase } from './Supabase';
import './HomeOne.css';

export default function HomeOneEN() {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const startY = useRef(0);
  const allowScrollRef = useRef(true);
  const cameFromHomeTwo = location.state?.from === 'home-two';
  const [entering, setEntering] = useState(!cameFromHomeTwo);
  const [leaving, setLeaving] = useState(false);
  const [heroContent, setHeroContent] = useState({
    title: 'Hi, I\'m <span>Jana</span>',
    subtitle: 'UX/UI Designer',
    paragraph: 'Creating beautiful, user-centered digital experiences that bring ideas to life.'
  });
  useEffect(() => {
    async function getAllHomeContentAPI() {
      try {
        // Try without special character first (more reliable)
        let res = await supabase.from("home_about_category_content").select("*").eq("section", "home");
        console.log("First try (without special char):", res);
        
        // If that fails, try with special character
        if (res.error) {
          console.log("First try failed, trying with special character...");
          res = await supabase.from("homeـ_about_category_content").select("*").eq("section", "home");
          console.log("Second try (with special char):", res);
        }
        
        if (res.error) {
          console.error("❌ Error:", res.error);
          console.error("Error message:", res.error.message);
          console.error("Error details:", res.error.details);
          console.error("Error hint:", res.error.hint);
          console.error("Status:", res.status);
        }
        
        if (res.data && res.data.length > 0) {
          console.log("✅ Data received:", res.data.length, "items");
          console.log("📋 Full data array:", res.data);
          
          const contentMap = {};
          res.data.forEach(item => {
            console.log(`📌 Item key: "${item.key}", content_en:`, item.content_en ? "Has content" : "EMPTY");
            contentMap[item.key] = item;
          });
          
          console.log("🗺️ Content map keys:", Object.keys(contentMap));
          console.log("🔍 Looking for: hero_title, hero_subtitle, hero_paragraph");
          
          const newContent = {
            title: contentMap['hero_title']?.content_en || 'Hi, I\'m <span>Jana</span>',
            subtitle: contentMap['hero_subtitle']?.content_en || 'UX/UI Designer',
            paragraph: contentMap['hero_paragraph']?.content_en || 'Creating beautiful, user-centered digital experiences that bring ideas to life.'
          };
          
          console.log("💾 Setting heroContent:", newContent);
          console.log("Title:", newContent.title ? "HAS CONTENT" : "EMPTY");
          console.log("Subtitle:", newContent.subtitle ? "HAS CONTENT" : "EMPTY");
          console.log("Paragraph:", newContent.paragraph ? "HAS CONTENT" : "EMPTY");
          
          setHeroContent(newContent);
        } else {
          console.warn("⚠️ No data received or empty array");
          console.warn("Response data:", res.data);
        }
      } catch (err) {
        console.error("❌ Exception caught:", err);
        console.error("Error type:", err.constructor.name);
        console.error("Error message:", err.message);
      }
    }
    
    getAllHomeContentAPI();
  }, []);

  useEffect(() => {
    if (cameFromHomeTwo) {
      setEntering(false);
      navigate(location.pathname, { replace: true, state: null });
    } else {
      const timeout = setTimeout(() => setEntering(false), 40);
      return () => clearTimeout(timeout);
    }
  }, [cameFromHomeTwo, location.pathname, navigate]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    let unlockRAF;
    allowScrollRef.current = true;
    if (cameFromHomeTwo) {
      allowScrollRef.current = false;
      unlockRAF = requestAnimationFrame(() => {
        allowScrollRef.current = true;
      });
    }

    let locked = false;
    let wheelDownTotal = 0;

    const triggerLeave = () => {
      if (!allowScrollRef.current) return;
      if (locked || leaving) return;
      locked = true;
      setLeaving(true);
      wheelDownTotal = 0;
      allowScrollRef.current = false;
      setTimeout(() => navigate('/home-two'), 320);
    };

    const onWheel = (event) => {
      if (!allowScrollRef.current) return;
      if (event.deltaY > 0) {
        wheelDownTotal += event.deltaY;
        if (wheelDownTotal > 80) {
          wheelDownTotal = 0;
          triggerLeave();
        }
      } else {
        wheelDownTotal = 0;
      }
    };

    const onTouchStart = (event) => {
      if (event.touches.length === 1) startY.current = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
      if (!allowScrollRef.current) return;
      if (!startY.current) return;
      if (startY.current - event.touches[0].clientY > 110) triggerLeave();
    };

    node.addEventListener('wheel', onWheel, { passive: true });
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchmove', onTouchMove);
      if (unlockRAF) cancelAnimationFrame(unlockRAF);
    };
  }, [cameFromHomeTwo, leaving, navigate]);

  return (
    <Layout lang="en" hideFooter>
      <section ref={rootRef} className="home-one" aria-label="Hero section">
        <div className="home-one-liquid" aria-hidden="true">
          <LiquidEther
            colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.55}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div
          className={`home-one__inner container ${entering ? 'home-one__inner--enter' : ''} ${
            leaving ? 'home-one__inner--leave' : ''
          }`}
        >
          <div className="home-one-hero__text">
            <h1 className="home-one-hero__title" dangerouslySetInnerHTML={{ __html: heroContent.title }} />
            <p className="home-one-hero__subtitle">
              {heroContent.subtitle}
            </p>
            <p className="home-one-hero__paragraph">
              {heroContent.paragraph}
            </p>
          </div>
          <div className="home-one-hero__image" aria-hidden="true">
            <img src="/imgs/home page/hero-img.png" alt="Jana Ahmed portrait" />
          </div>
        </div>
      </section>
    </Layout>
  );
}


import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '../components/Layout';
import LiquidEther from '../components/LiquidEther';
import SplitText from '../components/SplitText';
import TiltedCard from '../components/TiltedCard';
import { submitContact } from '../lib/api/contact';
import './ContactEN.css';

gsap.registerPlugin(ScrollTrigger);

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

export default function ContactEN() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const tipsRef = useRef(null);
  const [focusedField, setFocusedField] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    request: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-section__panel',
        {
          opacity: 0,
          y: 60,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.contact-section__divider',
        {
          opacity: 0,
          scale: 0.5,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.soc-icon',
        {
          opacity: 0,
          scale: 0,
          rotation: -180,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(2)',
          stagger: 0.1,
          scrollTrigger: {
            trigger: infoRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.contact-tip-card-wrapper',
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: tipsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Layout lang="en">
      <div className="contact-page">
        <div className="contact-page__bg" aria-hidden="true">
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

        <div className="contact-page__floating-elements">
          <div className="floating-orb floating-orb--1" />
          <div className="floating-orb floating-orb--2" />
          <div className="floating-orb floating-orb--3" />
        </div>

        <div className="contact-page__content">
          <section ref={sectionRef} className="contact-section" aria-label="Contact Me">
            <div className="container">
              <div className="contact-section__title-wrapper">
                <SplitText
                  text="Let's Work Together"
                  className="contact-section__title"
                  tag="h2"
                  delay={50}
                  duration={0.6}
                  ease="power3.out"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.2}
                />
                <div className="contact-section__title-underline" />
              </div>
              <div className="contact-section__grid contact-section__grid--dual">
                <div ref={formRef} className="contact-section__panel contact-section__panel--form">
                  <div className="panel-glow panel-glow--form" />
                  <form
                    className="contact-section__formgrid"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      setSubmitError(null);
                      setSubmitSuccess(false);
                      const payload = {
                        name: `${formData.firstName} ${formData.lastName}`.trim(),
                        email: formData.email,
                        action: 'general',
                        message: formData.request,
                      };
                      const { error } = await submitContact(payload);
                      if (error) {
                        setSubmitError(error);
                      } else {
                        setSubmitSuccess(true);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          phone: '',
                          email: '',
                          request: '',
                        });
                      }
                      setSubmitting(false);
                    }}
                  >
                    <label 
                      className={`form-field ${focusedField === 'firstName' ? 'form-field--focused' : ''}`}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                    >
                      <span className="form-icon">🙂</span>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                      <div className="form-field__ripple" />
                    </label>
                    <label 
                      className={`form-field ${focusedField === 'lastName' ? 'form-field--focused' : ''}`}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                    >
                      <span className="form-icon">🙂</span>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                      <div className="form-field__ripple" />
                    </label>
                    <label 
                      className={`form-field form-field--full ${focusedField === 'phone' ? 'form-field--focused' : ''}`}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    >
                      <span className="form-icon">☎</span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone no"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                      <div className="form-field__ripple" />
                    </label>
                    <label 
                      className={`form-field form-field--full ${focusedField === 'email' ? 'form-field--focused' : ''}`}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    >
                      <span className="form-icon">✉</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                      <div className="form-field__ripple" />
                    </label>
                    <label 
                      className={`form-field form-field--full ${focusedField === 'request' ? 'form-field--focused' : ''}`}
                      onFocus={() => setFocusedField('request')}
                      onBlur={() => setFocusedField(null)}
                    >
                      <span className="form-icon">💬</span>
                      <textarea
                        name="request"
                        rows={4}
                        placeholder="Your request"
                        value={formData.request}
                        onChange={e => setFormData({ ...formData, request: e.target.value })}
                        required
                      />
                      <div className="form-field__ripple" />
                    </label>
                    <button type="submit" className="form-submit form-field--full">
                      <span className="form-submit__text">{submitting ? 'Sending...' : 'Send'}</span>
                      <span className="form-icon form-submit__icon">✈</span>
                      <div className="form-submit__glow" />
                    </button>
                    {submitError && <div style={{ color: 'red' }}>Error: {submitError}</div>}
                    {submitSuccess && <div style={{ color: 'green' }}>Submitted successfully!</div>}
                  </form>
                </div>

                <div className="contact-section__divider" aria-hidden="true">
                  <span className="divider-text">Or</span>
                  <div className="divider-line" />
                </div>

                <div ref={infoRef} className="contact-section__panel contact-section__panel--info">
                  <div className="panel-glow panel-glow--info" />
                  <h3 className="contact-info__title">
                    <SplitText
                      text="Contact Me"
                      tag="span"
                      delay={30}
                      duration={0.5}
                      ease="power2.out"
                      from={{ opacity: 0, x: -20 }}
                      to={{ opacity: 1, x: 0 }}
                      threshold={0.3}
                    />
                  </h3>
                  <div className="contact-info__details">
                    <p className="contact-section__line contact-section__line--animated">
                      <span className="line-label">Email:</span>
                      <span className="line-value">JanaGaber9201@gamil.Com</span>
                    </p>
                    <p className="contact-section__line contact-section__line--animated">
                      <span className="line-label">Phone no:</span>
                      <span className="line-value">01141120002</span>
                    </p>
                  </div>
                  <h4 className="contact-info__subtitle">Social Media</h4>
                  <div className="contact-section__socials">
                    {socialIconSet.map(({ icon, label }, index) => (
                      <button
                        key={icon}
                        type="button"
                        aria-label={label}
                        className="soc-icon"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {renderContactIcon(icon)}
                        <div className="soc-icon__glow" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section ref={tipsRef} className="contact-tips-section" aria-label="Tips you should know">
            <div className="container">
              <h3 className="contact-tips__title">Tips You Should Know</h3>
              <div className="contact-tips__grid">
                <div className="contact-tip-card-wrapper">
                  <TiltedCard
                    imageSrc="/imgs/Frame 37.png"
                    altText="Design with Purpose"
                    captionText=""
                    containerHeight="320px"
                    containerWidth="100%"
                    imageHeight="320px"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.15}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="tip-card-overlay-content">
                        <h5>Design with Purpose, Not Just Aesthetics</h5>
                        <p>Every visual element in your design should have a reason to exist, nothing is random. Whether it's color, typography, or spacing, each decision should support the message or emotion you're trying to convey.</p>
                      </div>
                    }
                  />
                </div>
                <div className="contact-tip-card-wrapper">
                  <TiltedCard
                    imageSrc="/imgs/IMG_4737 2.png"
                    altText="Master Typography"
                    captionText=""
                    containerHeight="320px"
                    containerWidth="100%"
                    imageHeight="320px"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.15}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="tip-card-overlay-content">
                        <h5>Master Typography: It's Half the Design</h5>
                        <p>Typography isn't just about choosing pretty fonts; it's about hierarchy, readability, and emotion. The right typography can completely transform how a design is perceived.</p>
                      </div>
                    }
                  />
                </div>
                <div className="contact-tip-card-wrapper">
                  <TiltedCard
                    imageSrc="/imgs/Frame 40.png"
                    altText="Think Like a Brand"
                    captionText=""
                    containerHeight="320px"
                    containerWidth="100%"
                    imageHeight="320px"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.15}
                    showMobileWarning={false}
                    showTooltip={false}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="tip-card-overlay-content">
                        <h5>Think Like a Brand, Not a Designer</h5>
                        <p>Consistency and focus across visuals build strong brand recognition. Design choices should reflect the brand's voice and goals, which makes the whole identity bigger and more effective.</p>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}


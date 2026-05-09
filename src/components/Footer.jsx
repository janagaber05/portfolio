import { Link } from 'react-router-dom';
import './Footer.css';

const DEFAULT_LOGO_PATH = '/imgs/logo/logo-big.png';

export default function Footer({ lang = 'en', logoSrc }) {
  const isAr = lang === 'ar';

  const navLinks = isAr
    ? [
        { to: '/about-ar', label: 'عني' },
        { to: '/category-ar', label: 'تصميم جرافيك' },
        { to: '/category-ar', label: 'تصميم ويب' },
        { to: '/category-ar', label: 'تصميم تطبيقات' },
        { to: '/category-ar', label: 'برمجة' },
        { to: '/category-ar', label: '3D' },
      ]
    : [
        { to: '/about', label: 'ABOUT ME' },
        { to: '/category', label: 'GRAPHIC DESIGN' },
        { to: '/category', label: 'WEB DESIGN' },
        { to: '/category', label: 'APP DESIGN' },
        { to: '/category', label: 'CODE' },
        { to: '/category', label: '3D' },
      ];

  const socials = [
    { label: isAr ? 'يوتيوب' : 'YouTube', icon: 'youtube' },
    { label: isAr ? 'إنستجرام' : 'Instagram', icon: 'instagram' },
    { label: isAr ? 'لينكد إن' : 'LinkedIn', icon: 'linkedin' },
    { label: isAr ? 'تيك توك' : 'TikTok', icon: 'tiktok' },
    { label: isAr ? 'فيسبوك' : 'Facebook', icon: 'facebook' },
  ];

  const renderIcon = icon => {
    switch (icon) {
      case 'youtube':
        return (
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path
              d="M28.7 10.1a3.8 3.8 0 0 0-2.7-2.8C24 6.8 16 6.8 16 6.8s-8 0-10 .5a3.8 3.8 0 0 0-2.7 2.8 40.6 40.6 0 0 0-.6 7.2 40.6 40.6 0 0 0 .6 7.2 3.8 3.8 0 0 0 2.7 2.8c2 .6 10 .5 10 .5s8 0 10-.5a3.8 3.8 0 0 0 2.7-2.8 40.6 40.6 0 0 0 .6-7.2 40.6 40.6 0 0 0-.6-7.2Z"
              fill="url(#youtubeGradient)"
            />
            <path d="m13.2 12 7.6 5-7.6 5Z" fill="#0d0b17" />
            <defs>
              <linearGradient id="youtubeGradient" x1="4" x2="28" y1="8" y2="24" gradientUnits="userSpaceOnUse">
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
              <linearGradient id="igGradient" x1="4" x2="28" y1="4" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff9ffc" />
                <stop offset="1" stopColor="#7054ff" />
              </linearGradient>
            </defs>
            <rect x="5" y="5" width="22" height="22" rx="6" fill="url(#igGradient)" />
            <circle cx="16" cy="16" r="5.5" fill="none" stroke="#0d0b17" strokeWidth="2" />
            <circle cx="23" cy="9" r="1.5" fill="#0d0b17" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect x="6" y="6" width="20" height="20" rx="4" fill="url(#liGradient)" />
            <defs>
              <linearGradient id="liGradient" x1="8" x2="24" y1="8" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a38dff" />
                <stop offset="1" stopColor="#5b4ccf" />
              </linearGradient>
            </defs>
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
              <linearGradient id="ttGradient" x1="8" x2="26" y1="6" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#58f8ff" />
                <stop offset="1" stopColor="#f94cff" />
              </linearGradient>
            </defs>
            <path
              d="M18.5 9.4c0 4.2 3.4 6.3 6 6.3v3.6a8.4 8.4 0 0 1-4.7-1.4l-.2 5.5a6.8 6.8 0 1 1-6.8-6.2c.4 0 .8 0 1.2.1v3.8a3.2 3.2 0 1 0 2.9 3.1Z"
              fill="url(#ttGradient)"
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
              <linearGradient id="fbGradient" x1="6" x2="26" y1="6" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bff" />
                <stop offset="1" stopColor="#4a3ad1" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="20" height="20" rx="5" fill="url(#fbGradient)" />
            <path
              d="M19 11h-2.2a2 2 0 0 0-2 2v2h-2v3h2v6h3v-6H20l.4-3h-2.6v-1.2c0-.4.3-.8.8-.8H20Z"
              fill="#0d0b17"
            />
          </svg>
        );
    }
  };

  const logoPath = logoSrc || `${process.env.PUBLIC_URL || ''}${DEFAULT_LOGO_PATH}`;

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__wrap">
        <div className="footer__panel" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="footer__section footer__section--brand">
            <div className="footer__logo">
              <img src={logoPath} alt={isAr ? 'شعار الفوتر' : 'Footer logo'} />
            </div>
            <div className="footer__contact">
              <p className="footer__heading">{isAr ? 'تواصل معي' : 'Contact Me'}</p>
              <p><span>{isAr ? 'البريد:' : 'Email:'}</span> JanaGaber9201@gamil.Com</p>
              <p><span>{isAr ? 'الهاتف:' : 'Phone no:'}</span> 01141120002</p>
              <p className="footer__heading">{isAr ? 'وسائل التواصل' : 'Social Media'}</p>
              <div className="footer__socials">
                {socials.map(({ label, icon }) => (
                  <button key={label} type="button" className="footer__social-btn" aria-label={label}>
                    {renderIcon(icon)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <nav className="footer__section footer__section--links" aria-label={isAr ? 'روابط الفوتر' : 'Footer navigation'}>
            <p className="footer__heading">{isAr ? 'روابط' : 'Navigate'}</p>
            <ul>
              {navLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__section footer__section--form">
            <p className="footer__heading">{isAr ? 'القائمة البريدية' : 'Mailing List'}</p>
            <p className="footer__copy">
              {isAr
                ? 'ابق على اطلاع بدراسات الحالة والموارد الإبداعية لتجربة المستخدم.'
                : 'Stay inspired with monthly UX case studies, motion explorations and design resources.'}
            </p>
            <form
              className="footer__form"
              onSubmit={event => {
                event.preventDefault();
                alert(isAr ? 'شكراً لاشتراكك!' : 'Thanks for subscribing!');
              }}
            >
              <label className="footer__input">
                <span className="icon">✉</span>
                <input type="email" placeholder={isAr ? 'بريدك الإلكتروني' : 'Your Email'} required />
              </label>
              <button type="submit" className="footer__submit">
                {isAr ? 'إرسال' : 'Send'} <span className="icon">✈</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}



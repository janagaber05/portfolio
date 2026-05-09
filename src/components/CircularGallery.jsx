import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    href,
    app,
    originalIndex
  }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.href = href;
    this.app = app;
    // Store originalIndex - this is critical for correct navigation
    // If originalIndex is provided, use it; otherwise calculate from index
    if (originalIndex !== undefined) {
      this.originalIndex = originalIndex;
    } else if (app && app.originalItems && app.originalItems.length > 0) {
      this.originalIndex = index % app.originalItems.length;
    } else {
      // Fallback: assume length is double the original (because we duplicate)
      this.originalIndex = index % (length / 2);
    }
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.imageLoaded = false;
    this.createShader();
    this.createMesh();
    // this.createTitle(); // Text under cards removed
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uScale;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.04 + uSpeed * 0.22);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uScale: { value: 1.0 }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.imageWidth = img.naturalWidth;
      this.imageHeight = img.naturalHeight;
      this.imageLoaded = true;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
      
      // Set shared size based on first loaded image
      if (this.app && !this.app.sharedImageSize && this.imageWidth > 0 && this.imageHeight > 0) {
        this.app.sharedImageSize = {
          width: this.imageWidth,
          height: this.imageHeight,
          aspect: this.imageWidth / this.imageHeight
        };
        // Trigger resize for all medias when first image loads
        if (this.app.medias) {
          this.app.medias.forEach(media => {
            if (media.screen && media.viewport) {
              media.onResize({ screen: media.screen, viewport: media.viewport });
            }
          });
        }
      } else if (this.screen && this.viewport) {
        // If shared size already exists, just resize this one
        this.onResize({ screen: this.screen, viewport: this.viewport });
      }
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font
    });
  }

  update(scroll, direction, { layoutOnly = false } = {}) {
    // Shared loop offset on App — wrapping is applied in App.update (one widthTotal step per pass)
    this.plane.position.x = this.x - scroll.current - this.app.loopExtra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;
    
    // Calculate distance from center for scaling
    const distanceFromCenter = Math.abs(x);
    const maxDistance = H;
    const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1.0);
    
    // Scale: 1.0 at center, 0.6 at edges
    const scale = 1.0 - (normalizedDistance * 0.4);
    this.plane.scale.x = this.baseScaleX * scale;
    this.plane.scale.y = this.baseScaleY * scale;
    
    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.program.uniforms.uScale.value = scale;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (!layoutOnly) {
      this.speed = scroll.current - scroll.last;
      this.program.uniforms.uTime.value += 0.04;
      this.program.uniforms.uSpeed.value = this.speed;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }

    // Use shared image size if available (from first loaded image), otherwise use this image's dimensions
    let imageAspect;
    if (this.app && this.app.sharedImageSize) {
      imageAspect = this.app.sharedImageSize.aspect;
    } else if (this.imageLoaded && this.imageWidth > 0 && this.imageHeight > 0) {
      imageAspect = this.imageWidth / this.imageHeight;
    } else {
      // Fallback to default aspect ratio
      imageAspect = 700 / 900;
    }

    // Detect smaller screens and increase card size
    const isSmallScreen = this.screen.width < 768;
    const sizeMultiplier = isSmallScreen ? 1.5 : 1.0; // 50% bigger on small screens

    // Calculate size based on viewport, maintaining image aspect ratio
    const baseHeight = this.viewport.height * 0.5 * sizeMultiplier;
    const calculatedWidth = baseHeight * imageAspect;
    
    // Ensure it fits within viewport bounds (adjusted for small screens)
    const maxWidth = this.viewport.width * (isSmallScreen ? 0.48 : 0.3);
    const maxHeight = this.viewport.height * (isSmallScreen ? 0.72 : 0.55);
    
    if (calculatedWidth > maxWidth) {
      this.baseScaleX = maxWidth;
      this.baseScaleY = maxWidth / imageAspect;
    } else if (baseHeight > maxHeight) {
      this.baseScaleY = maxHeight;
      this.baseScaleX = maxHeight * imageAspect;
    } else {
      this.baseScaleX = calculatedWidth;
      this.baseScaleY = baseHeight;
    }
    
    this.plane.scale.y = this.baseScaleY;
    this.plane.scale.x = this.baseScaleX;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    // Center-to-center stride: account for portrait cards + Z-rotation (coverflow) widening
    // the axis-aligned footprint, not just baseScaleX.
    const Hhalf = this.viewport.width * 0.5;
    const bendAbs = Math.abs(this.bend || 0);
    let thetaWorst = 0;
    if (bendAbs > 0.001) {
      const R = (Hhalf * Hhalf + bendAbs * bendAbs) / (2 * bendAbs);
      thetaWorst = Math.asin(Math.min(0.999, Hhalf / Math.max(R, 1e-6)));
    }
    const sx = this.baseScaleX;
    const sy = this.baseScaleY;
    const projectedHalfX =
      0.5 *
      (Math.abs(sx * Math.cos(thetaWorst)) + Math.abs(sy * Math.sin(thetaWorst)));
    const margin = Math.max(sx, sy) * 0.1;
    this.width = 1.18 * (2 * projectedHalfX + margin);

    const uniqueCount =
      this.app && this.app.originalItems && this.app.originalItems.length > 0
        ? this.app.originalItems.length
        : Math.max(1, Math.floor(this.length / 2));
    // One full loop of the duplicated strip = uniqueCount strides (not 2× duplicate length)
    this.widthTotal = this.width * uniqueCount;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      navigate
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.loopExtra = 0;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.navigate = navigate;
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.boundUpdate = this.update.bind(this);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }

  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const galleryItems = items && items.length ? items : [];
    this.originalItems = galleryItems; // Store original items for reference
    this.mediasImages = galleryItems.concat(galleryItems);
    this.sharedImageSize = null; // Will store common size for all cards
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        href: data.href,
        app: this, // Pass app reference to access shared size
        originalIndex: index % galleryItems.length // Store original index
      });
    });
  }

  getIntersection(_x, _y) {
    let closestMedia = null;
    let closestDistance = Infinity;
    
    this.medias.forEach(media => {
      const plane = media.plane;
      const planeSize = [plane.scale.x, plane.scale.y];
      const distanceFromCenter = Math.sqrt(
        Math.pow(plane.position.x, 2) + 
        Math.pow(plane.position.y, 2)
      );
      
      if (distanceFromCenter < planeSize[0] / 2 + 1) {
        const dist = distanceFromCenter;
        if (dist < closestDistance) {
          closestDistance = dist;
          closestMedia = media;
        }
      }
    });
    
    return closestMedia;
  }

  onClick(x, y) {
    if (!this.medias || this.medias.length === 0 || !this.originalItems) return;
    
    const rect = this.container.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    
    let closestMedia = null;
    const screenCenterX = this.screen.width / 2;
    
    // Find all cards that contain the click point
    const candidates = [];
    
    this.medias.forEach((media) => {
      const plane = media.plane;
      
      // Calculate card position on screen
      const cardScreenX = (plane.position.x / this.viewport.width) * this.screen.width + screenCenterX;
      const cardScreenY = (plane.position.y / this.viewport.height) * this.screen.height + this.screen.height / 2;
      
      const cardWidth = (plane.scale.x / this.viewport.width) * this.screen.width;
      const cardHeight = (plane.scale.y / this.viewport.height) * this.screen.height;
      
      // Check if card is visible (within screen bounds)
      const isVisible = 
        cardScreenX + cardWidth / 2 > 0 && 
        cardScreenX - cardWidth / 2 < this.screen.width &&
        cardScreenY + cardHeight / 2 > 0 && 
        cardScreenY - cardHeight / 2 < this.screen.height;
      
      if (!isVisible) return;
      
      // Calculate distance from click to card center
      const distanceX = relativeX - cardScreenX;
      const distanceY = relativeY - cardScreenY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Check if click is within card bounds
      if (Math.abs(distanceX) < cardWidth / 2 && Math.abs(distanceY) < cardHeight / 2) {
        // Calculate how close this card is to the center of the screen
        const distanceFromCenter = Math.abs(cardScreenX - screenCenterX);
        
        // Get the original index directly from the media instance
      // This is critical - we need to use the stored originalIndex, not calculate it
      const originalIndex = media.originalIndex !== undefined 
        ? media.originalIndex 
        : (media.index % this.originalItems.length);
      
      // Verify the originalIndex matches what we expect
      const expectedIndex = media.index % this.originalItems.length;
      if (originalIndex !== expectedIndex && media.originalIndex === undefined) {
        console.warn('OriginalIndex mismatch:', {
          mediaIndex: media.index,
          storedOriginalIndex: media.originalIndex,
          calculatedIndex: expectedIndex,
          mediaText: media.text
        });
      }
        
        candidates.push({
          media,
          distance,
          distanceFromCenter,
          originalIndex: originalIndex,
          mediaIndex: media.index,
          mediaText: media.text
        });
      }
    });
    
    // If we have candidates, prioritize by:
    // 1. Distance from click point (closer = better)
    // 2. Distance from center (more centered = better, but less important)
    if (candidates.length > 0) {
      // Sort primarily by click distance, then by center distance as tiebreaker
      candidates.sort((a, b) => {
        // Primary sort: distance from click (closer is better)
        const clickDiff = a.distance - b.distance;
        if (Math.abs(clickDiff) > 5) {
          return clickDiff;
        }
        // Secondary sort: distance from center (more centered is better)
        return a.distanceFromCenter - b.distanceFromCenter;
      });
      
      closestMedia = candidates[0].media;
    }
    
    if (closestMedia) {
      // Get the original item index - use the one from candidates to ensure accuracy
      const candidate = candidates.find(c => c.media === closestMedia);
      let originalIndex;
      
      if (candidate) {
        originalIndex = candidate.originalIndex;
      } else {
        // Fallback: calculate from media index
        originalIndex = closestMedia.originalIndex !== undefined 
          ? closestMedia.originalIndex 
          : (closestMedia.index % this.originalItems.length);
      }
      
      // Debug: log what we found
      console.log('Click detected:', {
        mediaIndex: closestMedia.index,
        mediaText: closestMedia.text,
        calculatedOriginalIndex: closestMedia.index % this.originalItems.length,
        storedOriginalIndex: closestMedia.originalIndex,
        candidateOriginalIndex: candidate ? candidate.originalIndex : null,
        finalOriginalIndex: originalIndex,
        allCandidates: candidates.map(c => ({
          text: c.media.text,
          originalIndex: c.originalIndex,
          distance: c.distance,
          distanceFromCenter: c.distanceFromCenter
        })),
        allItems: this.originalItems.map((item, idx) => ({ idx, text: item.text, href: item.href }))
      });
      
      // Ensure we have a valid index within bounds
      const safeIndex = Math.max(0, Math.min(originalIndex, this.originalItems.length - 1));
      const originalItem = this.originalItems[safeIndex];
      
      // Always use href from originalItems array, not from the media instance
      // This ensures we get the correct href even if cards are duplicated
      const href = originalItem ? originalItem.href : null;
      
      console.log('Navigation:', {
        safeIndex,
        originalItemText: originalItem ? originalItem.text : null,
        href
      });
      
      if (!href || href === '#') {
        // If href is empty or just '#', redirect to 404
        const isAr = window.location.pathname.includes('-ar') || window.location.pathname.startsWith('/ar');
        const errorPath = isAr ? '/404-ar' : '/404';
        if (this.navigate) {
          this.navigate(errorPath);
        } else {
          window.location.href = errorPath;
        }
        return;
      }
      
      if (href.startsWith('http')) {
        window.open(href, '_blank');
      } else if (href.startsWith('#')) {
        // Handle hash links - scroll to element
        const hash = href.substring(1);
        const element = document.getElementById(hash) || document.querySelector(`[id="${hash}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // If hash element doesn't exist, redirect to 404
          const isAr = window.location.pathname.includes('-ar') || window.location.pathname.startsWith('/ar');
          const errorPath = isAr ? '/404-ar' : '/404';
          if (this.navigate) {
            this.navigate(errorPath);
          } else {
            window.location.href = errorPath;
          }
        }
      } else {
        // List of valid/complete routes
        const validRoutes = [
          '/', '/ar',
          '/home-two', '/home-two-ar',
          '/about', '/about-ar',
          '/blogs', '/blogs-ar',
          '/contact', '/contact-ar',
          '/category', '/category-ar',
          '/graphic-design', '/graphic-design-ar',
          '/app-design', '/app-design-ar',
          '/web-design', '/web-design-ar',
          '/3d-design', '/3d-design-ar',
          '/egy-air', '/egy-air-ar',
          '/grad-project',
          '/grad-project/research',
          '/grad-project/branding',
          '/grad-project/ux-design-system',
          '/grad-project/prototype',
          '/grad-project-ar',
          '/grad-project-ar/research',
          '/grad-project-ar/branding',
          '/grad-project-ar/ux-design-system',
          '/grad-project-ar/prototype',
          '/projects',
          '/projects/research',
          '/projects/branding',
          '/projects/ux-design-system',
          '/projects/prototype',
          '/projects-ar',
          '/projects-ar/research',
          '/projects-ar/branding',
          '/projects-ar/ux-design-system',
          '/projects-ar/prototype',
          '/designing-with-emotion-how-colors-shape-user-experience-ui-designer-in-cairo',
          '/404', '/404-ar'
        ];
        
        // Check if the route is valid
        const isAr = window.location.pathname.includes('-ar') || window.location.pathname.startsWith('/ar');
        const isValidRoute = validRoutes.includes(href);
        
        if (!isValidRoute) {
          // Route doesn't exist or is not done, redirect to 404
          const errorPath = isAr ? '/404-ar' : '/404';
          if (this.navigate) {
            this.navigate(errorPath);
          } else {
            window.location.href = errorPath;
          }
          return;
        }
        
        // Use React Router navigation if available, otherwise fallback to window.location
        if (this.navigate) {
          this.navigate(href);
        } else {
          window.location.href = href;
        }
      }
    }
  }

  onTouchDown(e) {
    this.isDown = true;
    this.isDragging = false;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
    this.startY = e.touches ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    const distanceY = Math.abs(this.startY - y);
    
    if (Math.abs(distance) > 5 || distanceY > 5) {
      this.isDragging = true;
    }
    
    this.scroll.target = this.scroll.position + distance;

    if (this.isDragging && e.cancelable && e.type === 'touchmove') {
      e.preventDefault();
    }
  }

  onTouchUp(e) {
    const wasDown = this.isDown;
    this.isDown = false;
    if (!wasDown) return;

    if (!this.isDragging) {
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      this.onClick(x, y);
    }
    this.isDragging = false;
    this.onCheck();
  }

  onWheel(e) {
    const deltaX = e.deltaX || 0;
    const deltaY = e.deltaY || 0;
    // Map vertical wheel / trackpad to horizontal carousel motion (most users scroll vertically)
    const dominant = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    if (dominant === 0) return;

    const scale = 0.055 * this.scrollSpeed;
    this.scroll.target += dominant * scale;
    this.onCheckDebounce();
    e.preventDefault();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    const wtot = this.medias?.[0]?.widthTotal ?? 0;

    // Infinite strip: several cards can be past the edge in one frame (wheel / drag).
    // Each media used to subtract widthTotal — N times per frame — and everything jumped off-screen.
    // Apply at most one full period shift per inner pass until all tiles are back in range.
    if (this.medias && wtot > 0) {
      let guard = 0;
      while (guard < 24) {
        guard += 1;
        this.medias.forEach(media => media.update(this.scroll, direction, { layoutOnly: true }));
        const anyBefore = this.medias.some(m => m.isBefore);
        const anyAfter = this.medias.some(m => m.isAfter);
        if (!anyBefore && !anyAfter) break;
        if (anyBefore) this.loopExtra -= wtot;
        else if (anyAfter) this.loopExtra += wtot;
      }
    }

    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction, { layoutOnly: false }));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.boundUpdate);
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnClick = this.onClick.bind(this);
    this.isDragging = false;
    
    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('wheel', this.boundOnWheel, { passive: false });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('mousemove', this.boundOnTouchMove);
    this.boundOnDocumentMouseUp = this.onTouchUp.bind(this);
    document.addEventListener('mouseup', this.boundOnDocumentMouseUp);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, { passive: true });
    this.container.addEventListener('touchmove', this.boundOnTouchMove, { passive: false });
    this.container.addEventListener('touchend', this.boundOnTouchUp);

    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    this.resizeObserver.observe(this.container);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    document.removeEventListener('mouseup', this.boundOnDocumentMouseUp);
    if (this.container) {
      this.container.removeEventListener('wheel', this.boundOnWheel);
      this.container.removeEventListener('mousedown', this.boundOnTouchDown);
      this.container.removeEventListener('mousemove', this.boundOnTouchMove);
      this.container.removeEventListener('touchstart', this.boundOnTouchDown);
      this.container.removeEventListener('touchmove', this.boundOnTouchMove);
      this.container.removeEventListener('touchend', this.boundOnTouchUp);
    }
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.02
}) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;
    const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, navigate });
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, navigate]);

  return <div className="circular-gallery" ref={containerRef} />;
}


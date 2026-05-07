import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';


import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import TextPlugin from 'gsap/TextPlugin';
import Typed from 'typed.js';

@Component({
  selector: 'app-portfolio',
  imports: [],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio implements AfterViewInit{

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private points!: THREE.Points;

  private mouseX = 0;
  private mouseY = 0;

  private cx = 0;
  private cy = 0;
  private rx = 0;
  private ry = 0;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.initCursor();
    this.initLoader();
    this.initNavbar();
  }

  // ===========================
  // THREE JS
  // ===========================
  initThree() {
    const canvas = this.el.nativeElement.querySelector('#three-canvas');

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.camera.position.z = 50;

    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#4f6ef7'),
      new THREE.Color('#00e5c0'),
      new THREE.Color('#ff5f7e'),
      new THREE.Color('#7a84a6'),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const c = palette[Math.floor(Math.random() * palette.length)];

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });

    this.points = new THREE.Points(geo, mat);
    this.scene.add(this.points);

    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = Date.now() * 0.0001;

    this.points.rotation.y = t * 0.5 + this.mouseX;
    this.points.rotation.x = t * 0.2 + this.mouseY;

    this.renderer.render(this.scene, this.camera);
  }

  // ===========================
  // MOUSE TRACK
  // ===========================
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;

    this.cx = e.clientX;
    this.cy = e.clientY;

    gsap.set('#cursor', {
      x: this.cx - 6,
      y: this.cy - 6,
    });
  }

  // ===========================
  // CURSOR
  // ===========================
  initCursor() {
    const ring = this.el.nativeElement.querySelector('#cursor-ring');

    const animateRing = () => {
      this.rx += (this.cx - this.rx) * 0.1;
      this.ry += (this.cy - this.ry) * 0.1;

      gsap.set(ring, {
        x: this.rx - 20,
        y: this.ry - 20,
      });

      requestAnimationFrame(animateRing);
    };

    animateRing();

    const hoverEls = this.el.nativeElement.querySelectorAll(
      'a, button, .skill-card, .project-card, .highlight-item',
    );

    hoverEls.forEach((el: HTMLElement) => {
      el.addEventListener('mouseenter', () => {
        gsap.to('#cursor', { scale: 2.5, duration: 0.3 });
        gsap.to('#cursor-ring', { scale: 1.5, opacity: 0.5, duration: 0.3 });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to('#cursor', { scale: 1, duration: 0.3 });
        gsap.to('#cursor-ring', { scale: 1, opacity: 1, duration: 0.3 });
      });
    });
  }

  // ===========================
  // LOADER + GSAP
  // ===========================
  initLoader() {
    const hideLoader = () => {
      gsap.to('#loader', {
        opacity: 0,
        duration: 0.6,
        delay: 1.8,
        onComplete: () => {
          const loader = document.getElementById('loader');
          if (loader) loader.style.display = 'none';
          this.initAnimations();
        },
      });
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  }

  initAnimations() {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Hero animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.2 })
      .to('#firstName', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
      .to('#lastName', { opacity: 1, y: 0, duration: 0.9 }, '-=0.7')
      .to('.hero-role', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero-btns', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
      .to('#heroCard', { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }, '-=0.8');

    // Typed.js
    new Typed('#typed', {
      strings: [
        'Angular Apps^1200',
        'NestJS APIs^1200',
        'MongoDB Systems^1200',
        'Full Stack Solutions^1200',
      ],
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
    });

    // Counter animation
    gsap.utils.toArray('[data-count]').forEach((el: any) => {
      const target = parseInt(el.dataset.count);
      ScrollTrigger.create({
        trigger: el,
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(this['targets']()[0].val) + (target >= 5 ? '+' : '+');
              },
            },
          );
        },
      });
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((el: any, i: number) => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.7,
        delay: i * 0.15,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Skill cards
    gsap.utils.toArray('.skill-card').forEach((el: any, i: number) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    // Skill bars
    gsap.utils.toArray('.skill-bar-fill').forEach((bar: any) => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          bar.style.width = bar.dataset.width + '%';
        },
      });
    });

    // Project cards
    gsap.utils.toArray('.project-card').forEach((el: any, i: number) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: i * 0.12,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    // Section headings
    gsap.utils.toArray('.section-heading').forEach((el: any) => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Initialize vanilla-tilt for elements
    if (typeof (window as any).VanillaTilt !== 'undefined') {
      (window as any).VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
    }
  }

  // ===========================
  // NAVBAR
  // ===========================
  initNavbar() {
    const navbar = this.el.nativeElement.querySelector('#navbar');
    window.addEventListener('scroll', () => {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Mobile Nav
    const toggler = this.el.nativeElement.querySelector('#navToggler');
    const navLinks = this.el.nativeElement.querySelector('#navLinks');

    if (toggler && navLinks) {
      toggler.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = toggler.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
          gsap.to(spans[0], { rotate: 45, y: 7, duration: 0.3 });
          gsap.to(spans[1], { opacity: 0, duration: 0.2 });
          gsap.to(spans[2], { rotate: -45, y: -7, duration: 0.3 });
        } else {
          gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
          gsap.to(spans[1], { opacity: 1, duration: 0.2 });
          gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
        }
      });

      navLinks.querySelectorAll('a').forEach((a: HTMLElement) => {
        a.addEventListener('click', () => {
          navLinks.classList.remove('open');
          const spans = toggler.querySelectorAll('span');
          gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
          gsap.to(spans[1], { opacity: 1, duration: 0.2 });
          gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
        });
      });
    }
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf';
    link.download = 'Aditya_Hedau_Resume.pdf';
    link.click();
  }

  // ===========================
  // RESIZE
  // ===========================
  @HostListener('window:resize')
  onResize() {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

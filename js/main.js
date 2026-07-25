'use strict';

// ギャラリー写真リスト
// images/フォルダに写真を追加したら、ここにファイル名を1行足すだけで表示に反映されます（HTMLの編集は不要）。
const GALLERY_PHOTOS = [
  'gallery1.jpg',
  'gallery2.jpg',
  'gallery3.jpg',
  'gallery4.jpg',
  'gallery5.jpg',
];

// ギャラリーの写真を生成（無限ループスクロール用に、末尾に複製セットも自動生成）
const galleryGridEl = document.getElementById('gallery-grid');
if (galleryGridEl) {
  function buildGalleryImg(file, index, isClone) {
    const img = document.createElement('img');
    img.src = `images/${file}`;
    img.width = 400;
    img.height = 400;
    if (isClone) {
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
    } else {
      img.alt = `店内写真${index + 1}`;
    }
    return img;
  }
  GALLERY_PHOTOS.forEach((file, i) => galleryGridEl.appendChild(buildGalleryImg(file, i, false)));
  GALLERY_PHOTOS.forEach((file, i) => galleryGridEl.appendChild(buildGalleryImg(file, i, true)));
}

// ハンバーガーメニュー
const hamburger = document.getElementById('hamburger');
const gnav = document.getElementById('gnav');
const overlay = document.getElementById('nav-overlay');

function openMenu() {
  hamburger.classList.add('is-open');
  gnav.classList.add('is-open');
  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('is-open');
  gnav.classList.remove('is-open');
  overlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (hamburger.classList.contains('is-open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

overlay.addEventListener('click', closeMenu);

document.querySelectorAll('#gnav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const headerHeight = document.getElementById('header').offsetHeight;
    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

// ギャラリーの無限ループスクロール（複製セットの境目でこっそり先頭へ戻す）
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
  let setWidth = 0;

  function measureSetWidth() {
    setWidth = galleryGrid.scrollWidth / 2;
  }
  measureSetWidth();
  window.addEventListener('resize', measureSetWidth);

  galleryGrid.addEventListener('scroll', () => {
    if (!setWidth) return;
    if (galleryGrid.scrollLeft >= setWidth) {
      galleryGrid.scrollLeft -= setWidth;
    }
  });
}

// 画像拡大ポップアップ（ライトボックス）
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.menu-card img, .gallery-grid img').forEach(img => {
  img.addEventListener('click', () => {
    openLightbox(img.currentSrc || img.src, img.alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

// ポップアップの外側（背景）をクリックしたら閉じる
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
    closeLightbox();
  }
});

// スクロール時にヘッダーに影をつける
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

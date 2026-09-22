'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
const compact = window.matchMedia('(max-width: 720px)');
function closeMenu(focus = false) {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  if (focus) menu.focus();
}
function syncMenu() {
  menu.hidden = !compact.matches;
  if (!compact.matches) closeMenu();
}
syncMenu();
compact.addEventListener('change', syncMenu);
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', event => { if(event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', event => { if(!event.target.closest('.header')) closeMenu(); });
document.addEventListener('focusin', event => { if(!event.target.closest('.header')) closeMenu(); });
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduced.matches) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}
    });
  }, {threshold: .08});
  document.querySelectorAll('.section-top, .project, .about-grid, .service-row, .contact').forEach(el => {el.classList.add('reveal');reveal.observe(el);});
  reduced.addEventListener('change', () => {
    if(reduced.matches){reveal.disconnect();document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
  });
}
const progress = document.querySelector('.reading-progress');
let scheduled = false;
function updateScroll(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
  document.querySelector('.header').classList.toggle('scrolled',window.scrollY > 20);
  scheduled = false;
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}}, {passive:true});
window.addEventListener('resize',updateScroll);
updateScroll();
if('IntersectionObserver' in window){
  const active = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        nav.querySelectorAll('a').forEach(link=>{
          if(link.hash === '#' + entry.target.id) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  },{rootMargin:'-15% 0px -60% 0px',threshold:0});
  document.querySelectorAll('section[id]').forEach(section=>active.observe(section));
}

// Native navigation, media links, and disclosures also work without JavaScript.
const navigation = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = navigation.map(link => document.querySelector(link.hash)).filter(Boolean);
let pending = false;
function updateNavigation() {
  pending = false;
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  const offset = document.querySelector('.section-nav').offsetHeight + 45;
  const reached = sections.filter(section => section.getBoundingClientRect().top <= offset);
  const current = atBottom ? sections.at(-1) : reached.at(-1) || sections[0];
  for (const link of navigation) {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function scheduleNavigation() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(updateNavigation);
  }
}
window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('load', scheduleNavigation);
updateNavigation();

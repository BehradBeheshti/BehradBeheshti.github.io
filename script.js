const video = document.querySelector('#research-demo');
const label = document.querySelector('#demo-label');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('[data-demo]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-demo]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    video.src = 'assets/research/' + button.dataset.demo;
    label.textContent = 'Showing: ' + button.textContent;
    video.setAttribute('aria-label', button.textContent + ' demonstration');
    video.closest('figure').querySelector('figcaption').textContent = button.textContent + ' demonstration';
    video.load();
    video.play().catch(() => { label.textContent += ' — use the video controls to play'; });
  });
});
if (video && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !video.dataset.autoStarted) {
        video.muted = true;
        video.play().then(() => { video.dataset.autoStarted = 'true'; }).catch(() => {});
      } else if (!entry.isIntersecting) video.pause();
    });
  }, { threshold: 0.35 });
  observer.observe(video);
}

const stickyNavigation = document.querySelector('.sticky-nav');
const profileHeader = document.querySelector('.profile');
new IntersectionObserver(([entry]) => {
  const visible = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
  stickyNavigation.classList.toggle('visible', visible);
  stickyNavigation.inert = !visible;
}, {threshold: 0}).observe(profileHeader);
const topicPreviews = [...document.querySelectorAll('.topic-video')];
const previewToggle = document.querySelector('#preview-toggle');
let previewsPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
function updatePreviewButton() {
  previewToggle.setAttribute('aria-label', previewsPaused ? 'Play previews' : 'Pause previews');
  previewToggle.title = previewsPaused ? 'Play previews' : 'Pause previews';
  previewToggle.setAttribute('aria-pressed', String(previewsPaused));
}
if (previewToggle) {
  updatePreviewButton();
  const previewObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const clip = entry.target;
      clip.dataset.visible = String(entry.isIntersecting);
      clip.muted = true;
      if (entry.isIntersecting && !previewsPaused) clip.play().catch(() => {});
      else clip.pause();
    }
  }, {threshold: 0.15});
  topicPreviews.forEach(clip => previewObserver.observe(clip));
  previewToggle.addEventListener('click', () => {
    previewsPaused = !previewsPaused;
    updatePreviewButton();
    topicPreviews.forEach(clip => {
      if (previewsPaused) clip.pause();
      else if (clip.dataset.visible === 'true') clip.play().catch(() => {});
    });
  });
}

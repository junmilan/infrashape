// Videa „Jak se k nám dostat": načíst a přehrávat jen ve viewportu, mimo něj pauza.
// Karta s atributem data-pending ještě nemá video — zůstává poster a štítek „Video brzy".
// Po nahrání media/route-N.mp4 stačí u karty smazat data-pending.
const videos = [...document.querySelectorAll('.route-card:not([data-pending]) video[data-src]')];

videos.forEach((video) => {
  video.closest('.route-card').querySelector('.route-soon')?.remove();
});

if (videos.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting) {
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.4 });
  videos.forEach((v) => io.observe(v));
}

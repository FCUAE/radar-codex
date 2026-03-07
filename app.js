function scoreColor(score) {
  if (score >= 90) return '#DC2626';
  if (score >= 75) return '#EA580C';
  if (score >= 60) return '#D97706';
  if (score >= 40) return '#A8A29E';
  return '#D6D3D1';
}

function buildRing(el) {
  const score = Number(el.dataset.score || 0);
  const inline = el.classList.contains('inline');
  const size = inline ? 36 : 44;
  const radius = inline ? 14 : 18;
  const stroke = inline ? 3 : 4;
  const c = 2 * Math.PI * radius;
  const color = scoreColor(score);

  el.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="#F0EFED" stroke-width="${stroke}"/>
      <circle class="progress" cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c} ${c}" stroke-dashoffset="${c}"/>
    </svg>
    <span class="score-text" style="color:${color}">0</span>
  `;

  const progress = el.querySelector('.progress');
  const text = el.querySelector('.score-text');
  const start = performance.now();
  const duration = 800;

  function animate(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(score * eased);
    progress.style.strokeDashoffset = `${c * (1 - val / 100)}`;
    text.textContent = String(val);
    if (t < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

document.querySelectorAll('.score-ring').forEach(buildRing);

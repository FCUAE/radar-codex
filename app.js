function scoreColor(score) {
  if (score >= 90) return '#DC2626';
  if (score >= 75) return '#EA580C';
  if (score >= 60) return '#D97706';
  if (score >= 40) return '#A8A29E';
  return '#D6D3D1';
}

function buildRing(el) {
  const score = Number(el.dataset.score || 0);
  const isInline = el.classList.contains('inline');
  const isLarge = el.classList.contains('large');
  const size = isLarge ? 72 : isInline ? 36 : 44;
  const radius = isLarge ? 30 : isInline ? 14 : 18;
  const stroke = isLarge ? 5 : isInline ? 3 : 4;
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

  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function animate(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutBack(t);
    const clamped = Math.max(0, Math.min(1, eased));
    const value = Math.round(score * clamped);
    progress.style.strokeDashoffset = `${c * (1 - value / 100)}`;
    text.textContent = String(value);
    if (t < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.score-ring').forEach(buildRing);

document.querySelector('[data-open-scan]')?.addEventListener('click', () => openModal('scan-modal'));
document.getElementById('start-scan')?.addEventListener('click', () => {
  closeModal(document.getElementById('scan-modal'));
  showToast('Scan started');
});

document.querySelectorAll('.clickable-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    openModal('brief-modal');
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal('brief-modal');
    }
  });
});

document.querySelectorAll('[data-close-modal]').forEach((el) => {
  el.addEventListener('click', () => {
    const modal = el.closest('.modal');
    if (modal) closeModal(modal);
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(closeModal);
  }
});

document.querySelectorAll('.track-btn').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    btn.textContent = 'Tracked';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    btn.disabled = true;
    showToast('Tracked');
  });
});

document.querySelectorAll('.dismiss-btn').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.stopPropagation();
    const card = btn.closest('.grid-card,.featured-card');
    card?.remove();
    showToast('Dismissed');
  });
});

document.querySelector('.view-btn')?.addEventListener('click', (event) => {
  event.stopPropagation();
  openModal('brief-modal');
});

document.querySelector('.archive-btn')?.addEventListener('click', (event) => {
  event.stopPropagation();
  const card = event.currentTarget.closest('.tracked-card');
  card?.remove();
  showToast('Archived');
});

document.querySelectorAll('.segmented button').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.parentElement.querySelectorAll('button').forEach((sibling) => {
      sibling.classList.remove('active');
      sibling.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    showToast(`Filter: ${btn.textContent.trim()}`);
  });
});

document.querySelectorAll('.tabs button').forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab;
    document.querySelectorAll('.tabs button').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${key}`)?.classList.add('active');
  });
});

document.querySelectorAll('.mode-card').forEach((card) => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.mode-card').forEach((item) => item.classList.remove('selected'));
    card.classList.add('selected');
  });
});

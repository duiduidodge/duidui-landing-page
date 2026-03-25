/**
 * DuiDui's Crypto Handbook — Chapter Picker
 * Shared across all chapter files.
 */
(function () {
  'use strict';

  const PARTS = [
    { label: 'คำนำ', chapters: [
      { id: 'preface', num: '00', title: 'คำนำ — ทำไมคริปโตจึงสำคัญ', file: './preface.html' },
    ]},
    { label: 'Part 1 • Orientation & Survival', chapters: [
      { id: '01', num: '01', title: 'แผนที่โลกคริปโต', file: './chapter-01-crypto-map.html' },
      { id: '02', num: '02', title: 'กระเป๋าเงิน การเก็บรักษา & ความปลอดภัย', file: './chapter-02-wallets-custody-security.html' },
    ]},
    { label: 'Part 2 • Core Blockchain Systems', chapters: [
      { id: '03', num: '03', title: 'Bitcoin — เงินดิจิทัลเพื่อความขาดแคลน', file: './chapter-03-bitcoin.html' },
      { id: '04', num: '04', title: 'Ethereum — คอมพิวเตอร์การเงินของโลก', file: './chapter-04-ethereum.html' },
      { id: '05', num: '05', title: 'Solana — เครื่องจักรความเร็วสูง', file: './chapter-05-solana.html' },
      { id: '06', num: '06', title: 'L1 Blockchains — สนามรบสถาปัตยกรรม', file: './chapter-06-l1-blockchains.html' },
    ]},
    { label: 'Part 3 • Markets & On-Chain Finance', chapters: [
      { id: '07', num: '07', title: 'Market Structure — สนามซื้อขาย', file: './chapter-07-market-structure.html' },
      { id: '08', num: '08', title: 'DeFi — ระบบการเงินด้วยโค้ด', file: './chapter-08-defi.html' },
      { id: '09', num: '09', title: 'MEV — มูลค่าซ่อนใน Mempool', file: './chapter-09-mev.html' },
      { id: '10', num: '10', title: 'Stablecoins & RWA — เงินที่ไม่ผันผวน', file: './chapter-10-stablecoins-rwa.html' },
      { id: '11', num: '11', title: 'Hyperliquid — DEX ท้าทาย CEX', file: './chapter-11-hyperliquid.html' },
    ]},
    { label: 'Part 4 • Ownership, Community & Real-World Networks', chapters: [
      { id: '12', num: '12', title: 'NFTs — สินทรัพย์ดิจิทัลที่มีเอกลักษณ์', file: './chapter-12-nfts.html' },
      { id: '13', num: '13', title: 'DAO & Governance — Tokenomics', file: './chapter-13-governance-tokenomics.html' },
      { id: '14', num: '14', title: 'DePIN — โครงสร้างพื้นฐานกระจายศูนย์', file: './chapter-14-depin.html' },
    ]},
    { label: 'Part 5 • Advanced Themes & Future Risks', chapters: [
      { id: '15', num: '15', title: 'Prediction Markets — ตลาดเดิมพันความจริง', file: './chapter-15-prediction-markets.html' },
      { id: '16', num: '16', title: 'Quantum Resistance — อนาคตความปลอดภัย', file: './chapter-16-quantum-resistance.html' },
      { id: '17', num: '17', title: 'บทสรุป — อ่านโลกคริปโตต่อจากนี้', file: './chapter-17-conclusion.html' },
    ]},
  ];

  /** Convert #rrggbb → "r,g,b" for CSS custom property use */
  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : '156,201,209';
  }

  function build() {
    const btn = document.querySelector('.chapter-picker-btn');
    if (!btn) return;

    const currentId   = btn.dataset.current || '';
    const accentColor = btn.dataset.accent  || '#9cc9d1';
    const accentRgb   = hexToRgb(accentColor);

    // Inject accent vars on button so hover glow + num badge work immediately
    btn.style.setProperty('--cp-accent',     accentColor);
    btn.style.setProperty('--cp-accent-rgb', accentRgb);

    // Inject chapter-number badge into button (before the chevron)
    const chevron = btn.querySelector('.cp-chevron');
    if (currentId) {
      const numBadge = document.createElement('span');
      numBadge.className = 'cp-btn-num';
      numBadge.textContent = currentId === 'preface' ? '00' : currentId;
      btn.insertBefore(numBadge, chevron || null);
    }

    // ── Overlay ────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.className = 'chapter-picker-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    // ── Floating modal ─────────────────────────────────────────────
    const dropdown = document.createElement('div');
    dropdown.className = 'chapter-dropdown';
    dropdown.setAttribute('role', 'dialog');
    dropdown.setAttribute('aria-label', 'เลือกบท');
    dropdown.style.setProperty('--cp-accent',     accentColor);
    dropdown.style.setProperty('--cp-accent-rgb', accentRgb);

    // Header
    const header = document.createElement('div');
    header.className = 'cp-modal-header';

    const title = document.createElement('span');
    title.className = 'cp-modal-title';
    title.textContent = 'เลือกบท';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'cp-modal-close';
    closeBtn.setAttribute('aria-label', 'ปิด');
    closeBtn.innerHTML = `<svg viewBox="0 0 14 14" aria-hidden="true">
      <line x1="2" y1="2" x2="12" y2="12"/>
      <line x1="12" y1="2" x2="2" y2="12"/>
    </svg>`;

    header.appendChild(title);
    header.appendChild(closeBtn);
    dropdown.appendChild(header);

    // Content
    const inner = document.createElement('div');
    inner.className = 'chapter-dropdown-inner';

    PARTS.forEach(part => {
      const partLabel = document.createElement('div');
      partLabel.className = 'chapter-dropdown-part';
      partLabel.textContent = part.label;
      inner.appendChild(partLabel);

      const grid = document.createElement('div');
      grid.className = 'chapter-dropdown-grid';

      part.chapters.forEach(ch => {
        const a = document.createElement('a');
        a.className = 'chapter-dropdown-item';
        if (ch.id === currentId) a.classList.add('is-current');
        a.href = ch.file;

        const num = document.createElement('span');
        num.className = 'cp-num';
        num.textContent = ch.num;

        const chTitle = document.createElement('span');
        chTitle.className = 'cp-title';
        chTitle.textContent = ch.title;

        a.appendChild(num);
        a.appendChild(chTitle);
        grid.appendChild(a);
      });

      inner.appendChild(grid);
    });

    dropdown.appendChild(inner);
    document.body.appendChild(overlay);
    document.body.appendChild(dropdown);

    // ── Scroll to current item ─────────────────────────────────────
    function scrollToCurrent() {
      const cur = dropdown.querySelector('.is-current');
      if (cur) {
        requestAnimationFrame(() => {
          const innerTop = inner.getBoundingClientRect().top;
          const itemTop  = cur.getBoundingClientRect().top;
          inner.scrollTop += itemTop - innerTop - 80;
        });
      }
    }

    // ── Open / Close ───────────────────────────────────────────────
    function open() {
      dropdown.classList.add('is-open');
      overlay.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      scrollToCurrent();
      document.body.style.overflow = 'hidden';
    }

    function close() {
      dropdown.classList.remove('is-open');
      overlay.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', () => {
      btn.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();


/* VYRO CHAT SKIN */
(function () {
  function applySkin() {
    var btn = document.querySelector(".vc-btn");
    if (!btn || btn.dataset.vyroSkin) return;

    btn.dataset.vyroSkin = "1";

    var style = document.createElement("style");
    style.textContent = `
      .vc-btn {
        width: auto !important;
        min-width: 62px !important;
        height: 58px !important;
        padding: 0 17px !important;
        border-radius: 30px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 9px !important;
        background: linear-gradient(135deg,#8b5cf6,#4169ff,#00c6e8) !important;
        border: 1px solid rgba(255,255,255,.25) !important;
        box-shadow: 0 8px 30px rgba(80,100,255,.45) !important;
        color: white !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        z-index: 99999 !important;
        animation: vyroGlow 2.5s infinite alternate !important;
      }

      .vc-btn svg {
        width: 25px !important;
        height: 25px !important;
      }

      @keyframes vyroGlow {
        from { box-shadow: 0 0 12px #795bff66; }
        to { box-shadow: 0 0 28px #00c8ff99; }
      }
    `;
    document.head.appendChild(style);

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="white"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a9 9 0 0 1-9 9 9 9 0 0 1-3.3-.6L4 21l1.3-4A9 9 0 1 1 21 11.5Z"/>
        <path d="M8 10h8M8 14h5"/>
      </svg>
      <span>Ask VYRO</span>
    `;
  }

  applySkin();
  setInterval(applySkin, 1000);
})();

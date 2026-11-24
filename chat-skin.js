/* VYRO Assistant skin: new floating button design. Load after chat.js. */
(function () {
  var CHAT = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5c0 4.4-4 8-9 8-1.2 0-2.3-.2-3.3-.5L4 20.5l1.4-3.9C4.2 15.3 3 13.5 3 11.5c0-4.4 4-8 9-8s9 3.6 9 8z"/><path d="M12 7.3l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#fff" stroke="none"/></svg>';
  var CLOSE = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var css = ".vc-btn.vc-skin{width:auto;min-width:58px;height:58px;padding:0 16px;border-radius:29px;display:flex;align-items:center;justify-content:center;gap:0;font:600 15px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.2px;background:linear-gradient(135deg,#8744f9 0%,#5b6cff 50%,#12bfe5 100%);box-shadow:0 10px 28px rgba(110,70,250,.45),0 0 0 1px rgba(255,255,255,.14) inset;transition:transform .15s,box-shadow .2s}.vc-skin:active{transform:scale(.95)}.vc-skin .vc-ico{display:flex}.vc-skin .vc-lbl{max-width:140px;margin-inline-start:9px;overflow:hidden;white-space:nowrap;transition:max-width .35s ease,opacity .25s,margin .35s}.vc-skin.col .vc-lbl{max-width:0;opacity:0;margin-inline-start:0}.vc-skin::before{content:\"\";position:absolute;inset:-4px;border-radius:inherit;border:2px solid rgba(18,191,229,.6);animation:vcring 2.6s ease-out infinite;pointer-events:none}.vc-skin.seen::before{animation:none;opacity:0}@keyframes vcring{0%{transform:scale(.92);opacity:.9}100%{transform:scale(1.35);opacity:0}}.vc-skin:focus-visible{outline:3px solid #fff;outline-offset:3px}@media (prefers-reduced-motion:reduce){.vc-skin::before{animation:none;opacity:0}.vc-skin .vc-lbl{transition:none}}";

  function setup() {
    var btn = document.querySelector(".vc-btn");
    if (!btn) return false;
    if (btn.getAttribute("data-skin")) return true;
    btn.setAttribute("data-skin", "1"); btn.classList.add("vc-skin");
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var ico = document.createElement("span"); ico.className = "vc-ico";
    var lbl = document.createElement("span"); lbl.className = "vc-lbl";
    btn.textContent = ""; btn.appendChild(ico); btn.appendChild(lbl);
    function isAr() { return /[\u0600-\u06FF]/.test(btn.getAttribute("aria-label") || ""); }
    function paint() {
      var open = btn.getAttribute("aria-expanded") === "true";
      ico.innerHTML = open ? CLOSE : CHAT;
      lbl.textContent = isAr() ? "اسأل VYRO" : "Ask VYRO";
      if (open) { btn.classList.add("col"); btn.classList.add("seen"); }
    }
    paint();
    if (window.MutationObserver) new MutationObserver(paint).observe(btn, { attributes: true, attributeFilter: ["aria-expanded", "aria-label"] });
    var done = false;
    function collapse() { if (!done) { done = true; btn.classList.add("col"); } }
    setTimeout(collapse, 7000);
    window.addEventListener("scroll", function () { if (window.scrollY > 60) collapse(); }, { passive: true });
    return true;
  }
  if (!setup()) { var n = 0, iv = setInterval(function () { if (setup() || ++n > 40) clearInterval(iv); }, 250); }
})();

/* VYRO Assistant - chat widget. Works without a server. Set AI_URL later to use an AI backend. */
(function () {
  var AI_URL = ""; // optional: https://znysymqmjxpmcxfqpmqp.supabase.co/functions/v1/chat
  var KEY = "sb_publishable_3-UXEREhL_p90z6FOmUCig_vRpSpCyr";
  var lang = null;
  var ar = function () { return lang ? lang === "ar" : (typeof arabic !== "undefined" && arabic); };
  var setLang = function (q) { if (/[\u0600-\u06FF]/.test(q)) lang = "ar"; else if (/[A-Za-z]/.test(q)) lang = "en"; };
  var T = function (en, a) { return ar() ? a : en; };
  var nrm = function (v) { return (typeof norm === "function") ? norm(v) : String(v || "").toLowerCase(); };
  var last = { list: [], shown: 0 }, history = [];

  var css = ".vc-btn{position:fixed;inset-inline-end:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:58px;height:58px;border-radius:50%;border:0;background:linear-gradient(135deg,#8744f9,#12bfe5);color:#fff;font-size:26px;cursor:pointer;box-shadow:0 8px 24px #0008;z-index:20}.vc-panel{position:fixed;inset-inline-end:12px;bottom:calc(84px + env(safe-area-inset-bottom,0px));width:min(94vw,390px);height:min(72vh,560px);display:none;flex-direction:column;background:#0e1630;border:1px solid #3b5489;border-radius:20px;box-shadow:0 12px 40px #000a;z-index:20;overflow:hidden}.vc-panel.open{display:flex}.vc-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:#131e3e;border-bottom:1px solid #263152;font-weight:700}.vc-head small{display:block;color:#8fa0c6;font-weight:400;font-size:12px}.vc-x{background:transparent;border:0;color:#fff;font-size:20px;cursor:pointer}.vc-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}.vc-m{max-width:88%;padding:10px 12px;border-radius:14px;line-height:1.6;font-size:15px;overflow-wrap:anywhere;white-space:pre-wrap}.vc-m.bot{background:#172548;color:#e6ecff;align-self:flex-start;border-end-start-radius:4px}.vc-m.me{background:#5b3fd0;color:#fff;align-self:flex-end;border-end-end-radius:4px}.vc-card{background:#101a38;border:1px solid #2c3d68;border-radius:12px;padding:10px;margin-top:8px;white-space:normal}.vc-card b{display:block}.vc-card span{color:#9fb0d6;font-size:13px}.vc-card p{margin:6px 0;color:#c4cee8;font-size:13px;line-height:1.5}.vc-card a{display:inline-block;color:#fff;background:#1a2b53;border:1px solid #304777;border-radius:10px;padding:6px 12px;text-decoration:none;font-size:13px}.vc-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}.vc-chips button{background:#172548;color:#c8d4f1;border:1px solid #344872;border-radius:30px;padding:6px 10px;font-size:13px;cursor:pointer}.vc-form{display:flex;gap:8px;padding:10px;border-top:1px solid #263152}.vc-form input{flex:1;min-width:0;background:#080f24;color:#fff;border:1px solid #354a79;border-radius:12px;padding:11px;font-size:16px}.vc-form button{border:0;border-radius:12px;background:linear-gradient(120deg,#8744f9,#12bfe5);color:#fff;font-weight:700;padding:0 16px;cursor:pointer}.vc-form .vc-mic,.vc-form .vc-vl{background:#172548;border:1px solid #354a79;color:#fff;border-radius:12px;padding:0 10px;font-size:16px;font-weight:400}.vc-form .vc-mic.on{background:#c0392b;animation:vcp 1s infinite}@keyframes vcp{50%{opacity:.6}}.vc-say{display:block;margin-top:6px;background:transparent;border:1px solid #344872;color:#c8d4f1;border-radius:30px;padding:2px 10px;font-size:13px;cursor:pointer}.vc-note{color:#7f91b6;font-size:11px;text-align:center;padding:0 10px 8px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement("button"); btn.className = "vc-btn"; btn.type = "button"; btn.textContent = "💬"; btn.setAttribute("aria-expanded", "false");
  var panel = document.createElement("div"); panel.className = "vc-panel"; panel.setAttribute("role", "dialog");
  var head = document.createElement("div"); head.className = "vc-head";
  var title = document.createElement("div"); var h1 = document.createElement("span"); var sm = document.createElement("small"); title.appendChild(h1); title.appendChild(sm);
  var x = document.createElement("button"); x.className = "vc-x"; x.type = "button"; x.textContent = "✕"; head.appendChild(title); head.appendChild(x);
  var log = document.createElement("div"); log.className = "vc-log"; log.setAttribute("aria-live", "polite");
  var chips = document.createElement("div"); chips.className = "vc-chips";
  var form = document.createElement("form"); form.className = "vc-form";
  var inp = document.createElement("input"); inp.type = "text"; inp.maxLength = 200; inp.autocomplete = "off";
  var send = document.createElement("button"); send.type = "submit"; form.appendChild(inp);
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, vlang = "ar-EG", rec = null, listening = false;
  var vl = document.createElement("button"); vl.type = "button"; vl.className = "vc-vl"; vl.textContent = "ع";
  var mic = document.createElement("button"); mic.type = "button"; mic.className = "vc-mic"; mic.textContent = "🎙️";
  if (SR) { form.appendChild(vl); form.appendChild(mic); }
  form.appendChild(send);
  var note = document.createElement("div"); note.className = "vc-note";
  [head, log, chips, form, note].forEach(function (e) { panel.appendChild(e); });
  document.body.appendChild(btn); document.body.appendChild(panel);

  function labels() {
    h1.textContent = "✨ " + T("VYRO Assistant", "مساعد VYRO"); sm.textContent = T("Beta · suggests tools from the directory", "تجريبي · يرشّح أدوات من الدليل");
    inp.placeholder = T("Ask about a tool or the site…", "اسأل عن أداة أو عن الموقع…"); send.textContent = T("Send", "إرسال");
    btn.setAttribute("aria-label", T("Open assistant", "افتح المساعد")); x.setAttribute("aria-label", T("Close", "إغلاق"));
    note.textContent = T("Don't share personal data. Voice uses your browser's speech service. Verify prices on each tool's site.", "لا تكتب بيانات شخصية. الصوت بيستخدم خدمة التعرف على الكلام في المتصفح. راجع الأسعار على موقع كل أداة.");
    mic.setAttribute("aria-label", T("Speak", "تكلّم")); vl.setAttribute("aria-label", T("Voice language", "لغة الصوت"));
    var ex = ar() ? ["شيل خلفية صورة", "اعمل فيديو من نص", "حوّل النص لصوت", "ازاي استخدم الموقع؟"] : ["Remove image background", "Create a video from text", "Realistic voice", "How do I use this site?"];
    chips.textContent = ""; ex.forEach(function (q) { var b = document.createElement("button"); b.type = "button"; b.textContent = q; b.onclick = function () { ask(q); }; chips.appendChild(b); });
  }
  function bubble(kind, text) { var d = document.createElement("div"); d.className = "vc-m " + kind; d.textContent = text; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function cards(bot, tools) {
    tools.forEach(function (tl) {
      var c = document.createElement("div"); c.className = "vc-card";
      var b = document.createElement("b"); b.textContent = tl.name;
      var s = document.createElement("span"); var stt = (typeof stEn !== "undefined") ? (ar() ? stAr[tl.status] : stEn[tl.status]) : tl.status; s.textContent = (typeof catLabel === "function" ? catLabel(tl.category) : tl.category) + " · " + (stt || "");
      var p = document.createElement("p"); p.textContent = ar() ? (tl.desc_ar || tl.desc_en || "") : (tl.desc_en || tl.desc_ar || "");
      var a = document.createElement("a"); a.textContent = T("Open ↗", "فتح ↗"); a.target = "_blank"; a.rel = "noopener noreferrer";
      a.href = /^https?:\/\//i.test(tl.url) ? tl.url : "#";
      c.appendChild(b); c.appendChild(s); c.appendChild(p); c.appendChild(a); bot.appendChild(c);
    });
    log.scrollTop = log.scrollHeight;
  }

  function rank(q) {
    if (typeof finderScore !== "function" || typeof all === "undefined") return [];
    var r = all.map(function (t) { return { t: t, s: finderScore(t, q) }; }).filter(function (a) { return a.s > 0; }).sort(function (a, b) { return b.s - a.s || a.t.name.localeCompare(b.t.name); });
    var top = r.length ? r[0].s : 0;
    return r.filter(function (a) { return a.s >= top * 0.5; }).map(function (a) { return a.t; });
  }
  var FAQ = [
    [/^(hi|hello|hey|hola|مرحبا|اهلا|سلام|السلام|هاي|صباح|مساء)/, function () { return T("Hi! Tell me what you want to do (for example: remove a photo background) and I'll suggest tools.", "أهلاً! قولي عايز تعمل إيه (مثلاً: شيل خلفية صورة) وأرشحلك أدوات."); }],
    [/(thank|thx|شكرا|تسلم|مشكور)/, function () { return T("You're welcome! Ask anytime.", "العفو! اسأل في أي وقت."); }],
    [/(what is vyro|about vyro|about the site|vyro ايه|ايه هو vyro|ما هو|ايه الموقع|عن الموقع|تعريف)/, function () { return T("VYRO is a directory of AI tools. Search, filter by category or plan, and open each tool's official website.", "VYRO دليل لأدوات الذكاء الاصطناعي. ابحث، وفلتر بالتصنيف أو الخطة، وافتح الموقع الرسمي لكل أداة."); }],
    [/(how.*(use|work|search)|ازاي.*(استخدم|ابحث|اشتغل)|طريقه (الاستخدام|استخدام)|كيف استخدم|استخدام الموقع)/, function () { return T("1) Type what you want in the search box or the AI Finder. 2) Pick a category or plan chip to narrow results. 3) Tap Open Tool to visit the official site. The language button switches Arabic/English.", "١) اكتب اللي عايزه في البحث أو الـ AI Finder. ٢) اختار تصنيف أو خطة لتضييق النتائج. ٣) اضغط فتح الأداة لزيارة موقعها الرسمي. وزر اللغة بيبدّل عربي/إنجليزي."); }],
    [/(finder|الفايندر|مساعد vyro)/, function () { return T("The AI Finder ranks tools by the task you describe and shows only matching ones.", "الـ AI Finder بيرتّب الأدوات حسب المهمة اللي بتوصفها وبيعرض المطابق بس."); }],
    [/(freemium|unverified|معني.*(مجاني|مدفوع|غير مؤكد)|يعني ايه (مجاني|freemium)|what does.*(free|freemium|unverified))/, function () { return T("FREE: free to use. FREEMIUM: free tier with paid upgrades. PAID: paid. TRIAL: free trial. UNVERIFIED: not checked yet. Plans change, so confirm on the tool's site.", "FREE: مجاني. FREEMIUM: خطة مجانية بحدود وترقيات مدفوعة. PAID: مدفوع. TRIAL: تجربة مجانية. UNVERIFIED: لسه ما اتراجعتش. الخطط بتتغير، فتأكد من موقع الأداة."); }],
    [/(add.*tool|submit|suggest a tool|اضافه اداه|اضيف اداه|اقترح|ضيف اداه)/, function () { return T("Tools are added by the site owner; there's no public submission form yet.", "الأدوات بيضيفها صاحب الموقع، ومفيش نموذج إرسال عام لسه."); }],
    [/(broken|dead link|not working|رابط.*(مش شغال|معطل|خربان)|مش بيفتح)/, function () { return T("Some tool sites change links. Try the tool's name in a search engine, and report it to the site owner.", "بعض المواقع بتغير روابطها. جرّب اسم الأداة في محرك بحث، وبلّغ صاحب الموقع."); }]
  ];
  function filterPrev(q) {
    var n = nrm(q), l = last.list;
    if (!l.length) return null;
    if (/(more|المزيد|كمان|تاني)/.test(n) && n.split(" ").length <= 3) { var nx = l.slice(last.shown, last.shown + 4); if (!nx.length) return { text: T("That's all I have for this request.", "ده كل اللي عندي للطلب ده."), tools: [] }; last.shown += nx.length; return { text: T("More options:", "خيارات تانية:"), tools: nx }; }
    if (n.split(" ").length <= 4 && /(\bfree\b|مجان)/.test(n) && !/(mean|معني|يعني|freemium|unverified)/.test(n)) { var f = l.filter(function (t) { return t.status === "free" || t.status === "freemium"; }).slice(0, 4); return { text: f.length ? T("Free or free-tier options:", "خيارات مجانية أو بخطة مجانية:") : T("None of these are marked free.", "مفيش حاجة منهم معلّمة مجاني."), tools: f }; }
    if (n.split(" ").length <= 4 && /(paid|مدفوع)/.test(n)) { var p = l.filter(function (t) { return t.status === "paid"; }).slice(0, 4); return { text: p.length ? T("Paid options:", "الخيارات المدفوعة:") : T("None of these are marked paid.", "مفيش حاجة منهم معلّمة مدفوع."), tools: p }; }
    return null;
  }
  function localAnswer(q) {
    var fp = filterPrev(q); if (fp) return fp;
    var n = nrm(q);
    for (var i = 0; i < FAQ.length; i++) if (FAQ[i][0].test(n) || FAQ[i][0].test(q.toLowerCase())) return { text: FAQ[i][1](), tools: [] };
    var r = rank(q);
    if (!r.length) return { text: T("I couldn't find a close match. Try describing the task, e.g. \"create a video from text\" or \"write a script\".", "ما لقيتش أداة مطابقة. جرّب توصف المهمة، مثلاً \"اعمل فيديو من نص\" أو \"اكتب سكريبت\"."), tools: [] };
    last.list = r; last.shown = Math.min(4, r.length);
    var more = r.length > 4 ? T(" Say \"more\" for other options.", " قول \"المزيد\" لخيارات تانية.") : "";
    return { text: T("Here are the best matches:", "دي أنسب الأدوات:") + more, tools: r.slice(0, 4) };
  }
  function aiAnswer(q) {
    var msgs = history.slice(-7).concat([{ role: "user", content: q }]);
    return fetch(AI_URL, { method: "POST", headers: { "Content-Type": "application/json", apikey: KEY }, body: JSON.stringify({ lang: ar() ? "ar" : "en", messages: msgs }) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { if (!j.reply) throw 0; return { text: j.reply, tools: [] }; });
  }
  function ask(q) {
    q = String(q || "").trim().slice(0, 200); if (!q) return;
    setLang(q); labels();
    bubble("me", q); inp.value = ""; history.push({ role: "user", content: q });
    var done = function (res) {
      var b = bubble("bot", res.text); cards(b, res.tools || []); history.push({ role: "assistant", content: res.text });
      if (window.speechSynthesis) { var sp = document.createElement("button"); sp.type = "button"; sp.className = "vc-say"; sp.textContent = "🔊 " + T("Listen", "استمع"); sp.onclick = function () { sayIt(res.text + ". " + (res.tools || []).map(function (t) { return t.name; }).join(", ")); }; b.appendChild(sp); }
    };
    if (AI_URL) { aiAnswer(q).then(done, function () { done(localAnswer(q)); }); } else { done(localAnswer(q)); }
  }
  function stopRec() { try { if (rec) rec.stop(); } catch (e) {} }
  vl.onclick = function () { vlang = vlang === "ar-EG" ? "en-US" : "ar-EG"; vl.textContent = vlang === "ar-EG" ? "ع" : "EN"; };
  mic.onclick = function () {
    if (listening) { stopRec(); return; }
    try {
      rec = new SR(); rec.lang = vlang; rec.interimResults = true; rec.maxAlternatives = 1;
      rec.onstart = function () { listening = true; mic.classList.add("on"); inp.placeholder = T("Listening…", "بسمعك…"); };
      rec.onresult = function (e) {
        var t = "", fin = false;
        for (var i = e.resultIndex; i < e.results.length; i++) { t += e.results[i][0].transcript; if (e.results[i].isFinal) fin = true; }
        inp.value = t; if (fin) { stopRec(); ask(t); }
      };
      rec.onerror = function (e) {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") bubble("bot", T("Microphone access is blocked. Allow it from the site settings in your browser.", "الميكروفون مقفول. اسمح بيه من إعدادات الموقع في المتصفح."));
        else if (e.error === "no-speech") bubble("bot", T("I didn't hear anything. Tap the mic and try again.", "ما سمعتش حاجة. دوس على الميكروفون وجرّب تاني."));
        else if (e.error !== "aborted") bubble("bot", T("Voice input isn't available right now. Please type your question.", "الإدخال الصوتي مش متاح دلوقتي. اكتب سؤالك."));
      };
      rec.onend = function () { listening = false; mic.classList.remove("on"); labels(); };
      rec.start();
    } catch (e) { listening = false; bubble("bot", T("Voice input isn't available on this browser.", "الإدخال الصوتي مش متاح في المتصفح ده.")); }
  };
  function sayIt(text) {
    try { var ss = window.speechSynthesis; if (!ss) return; ss.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = /[\u0600-\u06FF]/.test(text) ? "ar-EG" : "en-US"; ss.speak(u); } catch (e) {}
  }
  function open(on) { panel.classList.toggle("open", on); btn.setAttribute("aria-expanded", String(on)); if (on) { labels(); if (!log.children.length) bubble("bot", T("Hi! I'm VYRO Assistant. Tell me what you want to do and I'll suggest AI tools, or ask how to use the site.", "أهلاً! أنا مساعد VYRO. قولي عايز تعمل إيه وأرشحلك أدوات ذكاء اصطناعي، أو اسأل عن استخدام الموقع.")); inp.focus(); } }
  btn.onclick = function () { open(!panel.classList.contains("open")); };
  x.onclick = function () { open(false); btn.focus(); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) { stopRec(); open(false); btn.focus(); } });
  form.onsubmit = function (e) { e.preventDefault(); ask(inp.value); };
  var lb = document.getElementById("langBtn"); if (lb) lb.addEventListener("click", function () { lang = null; setTimeout(labels, 0); });
  labels();
  window.__vyroAnswer = function (q) { setLang(q); return localAnswer(q); };
})();

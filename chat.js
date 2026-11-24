/* VYRO Assistant - chat widget. Works without a server. Set AI_URL later to use an AI backend. */
(function () {var AI_URL = "https://znysymqmjxpmcxfqpmqp.supabase.co/functions/v1/vyro-assistant";
  var KEY = "sb_publishable_3-UXEREhL_p90z6FOmUCig_vRpSpCyr";
  var lang = null;
  var ar = function () { return lang ? lang === "ar" : (typeof arabic !== "undefined" && arabic); };
  var setLang = function (q) { if (/[\u0600-\u06FF]/.test(q)) lang = "ar"; else if (/[A-Za-z]/.test(q)) lang = "en"; };
  var T = function (en, a) { return ar() ? a : en; };
  var nrm = function (v) { return (typeof norm === "function") ? norm(v) : String(v || "").toLowerCase(); };
  var last = { list: [], shown: 0 }, history = [];
  try { var bs = document.createElement("script"); bs.src = "chat-brain.js?v=1"; bs.async = true; document.head.appendChild(bs); } catch (e) {}
  function ext(q, phase) { try { return window.VYRO_BRAIN ? window.VYRO_BRAIN(q, { T: T, ar: ar, nrm: nrm, rank: rank, last: last }, phase) : null; } catch (e) { return null; } }

  
var css = ".vc-btn{position:fixed;inset-inline-end:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));width:62px;height:62px;border-radius:22px;border:1px solid #75dfff;background:linear-gradient(135deg,#704cff,#08c9ed);color:#fff;font-size:28px;cursor:pointer;box-shadow:0 0 28px #168cff88,0 8px 30px #0009;z-index:20;transition:.25s}.vc-btn:active{transform:scale(.92)}.vc-panel{position:fixed;inset-inline-end:2vw;bottom:calc(90px + env(safe-area-inset-bottom,0px));width:min(96vw,460px);height:min(86dvh,740px);display:none;flex-direction:column;background:radial-gradient(ellipse at top right,#202c61 0%,#10182f 48%,#080e20 100%);border:1px solid #536cae;border-radius:26px;box-shadow:0 0 35px #287bff33,0 20px 65px #000c;z-index:20;overflow:hidden;backdrop-filter:blur(22px)}.vc-panel.open{display:flex}.vc-head{display:flex;justify-content:space-between;align-items:center;padding:19px 17px;background:linear-gradient(120deg,#222b58cc,#102d4dcc);border-bottom:1px solid #526ca855;font-weight:800;color:#fff}.vc-head small{display:block;color:#8fdcff;font-weight:400;font-size:12px;margin-top:5px}.vc-x{background:#ffffff12;border:1px solid #ffffff22;color:#fff;font-size:19px;width:36px;height:36px;border-radius:12px;cursor:pointer}.vc-log{flex:1;overflow-y:auto;padding:17px;display:flex;flex-direction:column;gap:13px;scroll-behavior:smooth}.vc-m{max-width:89%;padding:13px 15px;border-radius:19px;line-height:1.7;font-size:15px;overflow-wrap:anywhere;white-space:pre-wrap;box-shadow:0 5px 18px #0003}.vc-m.bot{background:linear-gradient(135deg,#1d3155,#172440);border:1px solid #4a79a955;color:#e8f4ff;align-self:flex-start;border-end-start-radius:5px}.vc-m.me{background:linear-gradient(135deg,#744cff,#286cdb);color:#fff;align-self:flex-end;border-end-end-radius:5px}.vc-card{background:linear-gradient(135deg,#19294a,#111d36);border:1px solid #5278b466;border-radius:16px;padding:13px;margin-top:9px;white-space:normal}.vc-card b{display:block;color:#fff}.vc-card span{color:#a9c9ec;font-size:13px}.vc-card p{margin:7px 0;color:#cbdaf1;font-size:13px;line-height:1.6}.vc-card a{display:inline-block;color:#fff;background:linear-gradient(120deg,#6545d9,#087eaf);border:1px solid #74caff66;border-radius:12px;padding:8px 14px;text-decoration:none;font-size:13px}.vc-chips{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 12px}.vc-chips button{background:#1c3153;color:#cdeaff;border:1px solid #527bb477;border-radius:30px;padding:8px 12px;font-size:13px;cursor:pointer}.vc-form{display:flex;gap:8px;padding:13px;border-top:1px solid #526ca855;background:#0d1730cc}.vc-form input{flex:1;min-width:0;background:#101d36;color:#fff;border:1px solid #5275a9;border-radius:15px;padding:13px;font-size:16px;outline:none}.vc-form input:focus{border-color:#20c9f3;box-shadow:0 0 12px #12bde544}.vc-form button{border:0;border-radius:14px;background:linear-gradient(120deg,#754bff,#08bfe8);color:#fff;font-weight:700;padding:0 16px;cursor:pointer}.vc-form .vc-mic,.vc-form .vc-vl{background:#1b2d4d;border:1px solid #5275a9;color:#fff;border-radius:13px;padding:0 11px;font-size:16px;font-weight:400}.vc-form .vc-mic.on{background:#c0392b;animation:vcp 1s infinite}@keyframes vcp{50%{opacity:.6}}.vc-say{display:block;margin-top:7px;background:#182b4b;border:1px solid #527bb4;color:#c8eaff;border-radius:30px;padding:5px 12px;font-size:13px;cursor:pointer}.vc-note{color:#8ca9d0;font-size:11px;text-align:center;padding:0 12px 10px}@media(max-width:500px){.vc-panel{inset-inline:2vw;bottom:calc(88px + env(safe-area-inset-bottom,0px));width:96vw;height:min(86dvh,760px);border-radius:24px}.vc-head{padding:16px}.vc-log{padding:14px}.vc-form{padding:11px 9px;gap:6px}.vc-form button{padding:0 12px}}";

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
  var e1 = ext(q, "pre");
  if (e1) return e1;

  var fp = filterPrev(q);
  if (fp) return fp;

  var n = nrm(q);
  var raw = q.toLowerCase();

  // ردود متنوعة وطبيعية
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function reply(text) {
    return { text: text, tools: [] };
  }

  // التحيات
  if (/^(hi|hello|hey|hola|مرحبا|اهلا|أهلا|السلام|سلام|هاي|صباح|مساء)/i.test(raw)) {
    return reply(pick([
      "يا أهلااا 😄 نورت VYRO! عامل إيه النهارده؟",
      "أهلا بيك يا صاحبي ❤️ أخبارك إيه؟",
      "يا مرحب! 😎 داخل نكتشف حاجة جديدة ولا جاي نرغي شوية؟",
      "أهو ده الكلام! 😂 قولي الدنيا معاك ماشية إزاي؟"
    ]));
  }

  // الضحك
  if (/(هههه|😂|🤣|لول|lmao|haha|hehe)/i.test(raw)) {
    return reply(pick([
      "😂😂 طب واضح إننا دخلنا مود الضحك!",
      "ضحكتك وصلتني والله 😂 طب احكيلي إيه اللي ضحكك؟",
      "أهو كده بدأنا صح 😂",
      "استنى بس، شكلي هضحك معاك مش هساعدك النهارده 😂"
    ]));
  }

  // الزهق
  if (/(زهقان|ملل|ممل| bored|boring)/i.test(n)) {
    return reply(pick([
      "طب نطرد الزهق ده من هنا 😂 تحب نلعب لعبة، نتكلم في موضوع غريب، ولا أقولك معلومة تخلّي دماغك تلف؟",
      "الزهق ده عدو البشرية 😂 طب تعالى نغيّر الجو، عندي كذا فكرة ممكن تفوقك.",
      "ولا يهمك، نغيّر مود خالص 😎 تحب تحدي سريع ولا دردشة في أي موضوع؟"
    ]));
  }

  // الحزن أو الضيق
  if (/(زعلان|متضايق|مخنوق|حزين|تعبان نفسيا|مش مبسوط|مش طايق)/i.test(n)) {
    return reply(pick([
      "مالك يا صاحبي؟ ❤️ لو حابب تحكي أنا معاك، خد راحتك ومش لازم ترتّب كلامك.",
      "حاسس إن يومك مش أحسن حاجة.. تحب تحكي حصل إيه؟",
      "أنا معاك، فضفض براحتك ❤️ إيه اللي مضايقك؟"
    ]));
  }

  // الشكر
  if (/(thank|thx|شكرا|شكرًا|تسلم|مشكور|حبيبي|حبيبى)/i.test(n)) {
    return reply(pick([
      "حبيبي ❤️ ده أنا هنا علشانك!",
      "ولا يهمك يا صاحبي، تحت أمرك 😄",
      "العفو يا كبير، لسه معانا كلام كتير 😂"
    ]));
  }

  // السؤال عن حال فيرو
  if (/(عامل ايه|عامل إيه|اخبارك|أخبارك|how are you|how r u|you good)/i.test(n)) {
    return reply(pick([
      "أنا تمام وزي الفل 😎 إنت بقى عامل إيه؟",
      "كله تمام عندي، أحلى حاجة إنك دخلت 😂 أخبارك إيه؟",
      "فل الفل يا صاحبي ❤️ إنت يومك عامل إيه؟"
    ]));
  }

  // المجاملة
  if (/(انت جامد|أنت جامد|انت حلو|أنت حلو|بحبك|love you|you are great)/i.test(n)) {
    return reply(pick([
      "يا عم إنت اللي جامد 😂❤️",
      "حبيبي والله، كده هتخليني أصدق نفسي 😂",
      "❤️❤️ ده من ذوقك يا صاحبي!"
    ]));
  }

  // لو المستخدم بيقول إنه مش عارف
  if (/(مش عارف|معرفش|مش فاهم|مش عارف اعمل ايه)/i.test(n)) {
    return reply(pick([
      "ولا يهمك، ناخدها واحدة واحدة 😄 قولي بس إيه اللي محيّرك ونفكر فيه سوا.",
      "عادي جدًا، مش لازم تكون عارف من البداية. احكيلي اللي في دماغك وأنا أساعدك ترتّبه.",
      "طب خلينا نفكها سوا، إيه أول حاجة واقفة معاك؟"
    ]));
  }

  // متابعة الكلام
  if (/^(طب|طيب|وبعدين|كمل|كمّل|ليه|ازاي|إزاي|بجد|فعلا|فعلاً)/i.test(n)) {
    var prev = history.length > 1 ? history[history.length - 2].content : "";
    if (/(زهقان|ملل)/i.test(prev)) {
      return reply("طب عندي اقتراح 😄 نلعب لعبة أسئلة سريعة، ولا أقولك 3 حاجات غريبة يمكن واحدة تعجبك؟");
    }
    return reply(pick([
      "كمل معايا 😂 إنت تقصد نكمل في نفس الموضوع ولا عندك حاجة تانية في بالك؟",
      "أنا معاك، وضّحلي بس النقطة دي أكتر علشان أظبطلك الكلام 😄",
      "طب تعالى نفكر فيها سوا.. تقصد إيه بالظبط؟"
    ]));
  }

  // الأسئلة الخاصة بالموقع
  for (var i = 0; i < FAQ.length; i++) {
    if (FAQ[i][0].test(n) || FAQ[i][0].test(raw)) {
      return { text: FAQ[i][1](), tools: [] };
    }
  }

  // البحث عن أدوات الذكاء الاصطناعي
  var r = rank(q);

  if (r.length) {
    last.list = r;
    last.shown = Math.min(4, r.length);

    var more = r.length > 4
      ? T(" Say \"more\" for other options.", " قول \"المزيد\" لخيارات تانية.")
      : "";

    return {
      text: T("Here are the best matches:", "لقيتلك شوية أدوات ممكن تناسب طلبك 😎:") + more,
      tools: r.slice(0, 4)
    };
  }

  // الرد الطبيعي عند عدم فهم الرسالة
  return reply(pick([
    "طب احكيلي أكتر 😄 عايز تقول إيه بالظبط؟",
    "أنا معاك، بس وضّحلي قصدك شوية علشان أرد عليك صح ❤️",
    "ممكن توضحلي أكتر؟ حاسس إن فيه حكاية ورا الكلام ده 😂",
    "قولّي أكتر، خلينا ناخد الكلام واحدة واحدة.",
    "مش عايز أفتي عليك 😅 وضّحلي قصدك وأنا معاك."
  ]));
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

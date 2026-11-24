/* VYRO Assistant brain: extra conversation + tool-specific answers (no server). */
(function () {
  var nm = function (v) { return typeof norm === "function" ? norm(v) : String(v || "").toLowerCase(); };
  var catL = function (k) { return typeof catLabel === "function" ? catLabel(k) : k; };
  var cache = function (t) { return t._nn || (t._nn = nm(t.name)); };
  var STATUS_EN = { free: "FREE", freemium: "FREEMIUM", paid: "PAID", trial: "TRIAL", unverified: "UNVERIFIED" };
  var STATUS_AR = { free: "مجاني", freemium: "مجاني بحدود / مدفوع", paid: "مدفوع", trial: "تجربة مجانية", unverified: "غير مؤكد" };
  var MEAN_EN = { free: "free to use", freemium: "has a free tier with paid upgrades", paid: "paid", trial: "offers a free trial", unverified: "not checked yet" };
  var MEAN_AR = { free: "مجاني", freemium: "فيه خطة مجانية بحدود وترقيات مدفوعة", paid: "مدفوع", trial: "فيه تجربة مجانية", unverified: "لسه ما اتراجعتش" };

  function findNames(ctx, N) {
    if (typeof all === "undefined") return [];
    var pad = " " + N + " ", out = [];
    all.forEach(function (t) { var nn = cache(t); if (nn.length >= 2 && pad.indexOf(" " + nn + " ") >= 0) out.push({ t: t, nn: nn }); });
    out.sort(function (a, b) { return b.nn.length - a.nn.length; });
    var res = [], used = [];
    out.forEach(function (o) { if (!used.some(function (u) { return u.indexOf(o.nn) >= 0; })) { res.push(o); used.push(o.nn); } });
    return res;
  }
  function words(t) { var s = {}; ((t.desc_en || "") + " " + (t.keywords || "")).toLowerCase().split(/[^a-z0-9]+/).forEach(function (w) { if (w.length > 3) s[w] = 1; }); return s; }
  function stLabel(ctx, st) { return ctx.ar() ? (STATUS_AR[st] || st) : (STATUS_EN[st] || st); }
  function desc(ctx, t) { return ctx.ar() ? (t.desc_ar || t.desc_en || "") : (t.desc_en || t.desc_ar || ""); }
  function setList(ctx, list) { ctx.last.list = list; ctx.last.shown = Math.min(4, list.length); }

  var CHAT = [
    [/^(bye|goodbye|see you|مع السلامه|باي|الي اللقاء)( |$)/, function (c) { return c.T("Bye! Come back anytime.", "مع السلامة! ارجع في أي وقت."); }],
    [/^(ok|okay|good|nice|great|cool|تمام|حلو|اوك|ماشي|جميل|رائع|عظيم)$/, function (c) { return c.T("Great! Tell me what you want to do and I'll suggest tools.", "ممتاز! قولي عايز تعمل إيه وأرشحلك أدوات."); }],
    [/(how are you|how r u|ازيك|عامل ايه|اخبارك|كيف حالك)/, function (c) { return c.T("I'm doing well, thanks! What would you like to create today?", "أنا تمام، شكراً! عايز تعمل إيه النهارده؟"); }],
    [/(who are you|what are you|مين انت|انت مين|انت ايه|من انت|اسمك ايه)/, function (c) { return c.T("I'm VYRO Assistant. I help you find AI tools in this directory and explain how the site works.", "أنا مساعد VYRO. بساعدك تلاقي أدوات ذكاء اصطناعي في الدليل وبشرحلك استخدام الموقع."); }],
    [/(are you (an )?(ai|bot|robot|real|human)|انت (ذكاء|بوت|روبوت|انسان|حقيقي)|هل انت)/, function (c) { return c.T("I'm a rule-based assistant for now: I match what you ask against the tools in the directory. I don't invent answers, so if I don't know, I'll say so.", "أنا مساعد بقواعد جاهزة حالياً: بطابق كلامك مع أدوات الدليل. مبألفش إجابات، ولو مش عارف هقولك."); }],
    [/(what can you do|how can you help|help|بتعمل ايه|تقدر تعمل ايه|تعمل ايه|تساعدني في ايه|ساعدني|مساعده)$/, function (c) { return c.T("I can: suggest tools for a task, compare two tools, find alternatives to a tool, explain plan labels (FREE, PAID...), list categories, and explain how to use the site. Try: \"alternatives to Canva\" or \"Runway vs Pika\".", "أقدر: أرشحلك أدوات لمهمة، وأقارن بين أداتين، وأجيبلك بدائل لأداة، وأشرح معنى الخطط (FREE وPAID...)، وأعرض الأقسام، وأشرح استخدام الموقع. جرّب: \"بدائل Canva\" أو \"Runway vs Pika\"."); }],
    [/(who (made|built|created|owns)|مين (عمل|صمم|انشا|صاحب)|صاحب الموقع)/, function (c) { return c.T("VYRO is built and curated by its owner. I don't have more details to share.", "VYRO من عمل وإدارة صاحب الموقع. ما عنديش تفاصيل أكتر أقولها."); }],
    [/(is (this|the) (site|website) free|الموقع مجاني|ببلاش|بفلوس)/, function (c) { return c.T("Browsing the directory and using this assistant is free. Individual tools have their own pricing.", "تصفح الدليل واستخدام المساعد مجاني. وكل أداة ليها أسعارها الخاصة."); }],
    [/(privacy|my data|do you (store|save|collect)|بياناتي|خصوصيه|بتحفظ|بتسجل)/, function (c) { return c.T("This chat runs in your browser and isn't saved on our servers. If you use the mic, your browser's speech service handles the audio. Please don't share personal data.", "الشات ده بيشتغل في متصفحك وما بيتحفظش على سيرفراتنا. ولو استخدمت الميكروفون، خدمة الكلام في متصفحك هي اللي بتعالج الصوت. من فضلك ما تكتبش بيانات شخصية."); }],
    [/(feedback|complain|contact|support|report a bug|شكوي|تواصل|دعم|اقتراح)/, function (c) { return c.T("There's no public contact form yet. Suggestions go to the site owner directly.", "مفيش نموذج تواصل عام لسه. الاقتراحات بتروح لصاحب الموقع مباشرة."); }]
  ];

  window.VYRO_BRAIN = function (q, ctx, phase) {
    var N = ctx.nrm(q), T = ctx.T;
    if (phase === "none") {
      return { text: T("I'm not sure I understood. I can suggest tools for a task, compare two tools, find alternatives, or explain the site. Try: \"create a video from text\", \"alternatives to Canva\", or \"Runway vs Pika\".", "مش متأكد إني فهمت. أقدر أرشحلك أدوات لمهمة، أو أقارن بين أداتين، أو أجيب بدائل، أو أشرح الموقع. جرّب: \"اعمل فيديو من نص\" أو \"بدائل Canva\" أو \"Runway vs Pika\"."), tools: [] };
    }
    if (N.split(" ").length <= 7) for (var i = 0; i < CHAT.length; i++) if (CHAT[i][0].test(N)) return { text: CHAT[i][1](ctx), tools: [] };

    if (typeof all !== "undefined") {
      if (/(how many tools|number of tools|كام اداه|عدد الادوات|كم اداه)/.test(N)) return { text: T("The directory has " + all.length + " tools.", "الدليل فيه " + all.length + " أداة."), tools: [] };
      if (/(categories|what categories|الاقسام|التصنيفات|اقسام)/.test(N) && N.split(" ").length <= 5) {
        var cnt = {}; all.forEach(function (t) { cnt[t.category] = (cnt[t.category] || 0) + 1; });
        var lst = Object.keys(cnt).sort().map(function (k) { return (catL(k)) + " (" + cnt[k] + ")"; }).join(" · ");
        return { text: T("Categories: ", "الأقسام: ") + lst, tools: [] };
      }
      var names = findNames(ctx, N), one = names.length === 1 && names[0].nn === N;
      if (names.length) {
        var A = names[0].t, B = names[1] && names[1].t;
        if (B && (/(^| )(vs|versus|compare|difference|between)( |$)/.test(N) || /(قارن|الفرق|مقارنه|ولا|احسن|افضل)/.test(N))) {
          return { text: T("Quick comparison from the directory:\n", "مقارنة سريعة من الدليل:\n") + A.name + " (" + stLabel(ctx, A.status) + "): " + desc(ctx, A) + "\n" + B.name + " (" + stLabel(ctx, B.status) + "): " + desc(ctx, B) + "\n" + T("I can't judge which is better for you; compare features and current pricing on their sites.", "ما أقدرش أحكم أنهي أحسن ليك؛ قارن المميزات والأسعار الحالية على مواقعهم."), tools: [A, B] };
        }
        if (/(^| )(alternative|alternatives|similar|instead|like)( |$)/.test(N) || /(بديل|بدائل|بدايل|شبه)/.test(N)) {
          var base = words(A), alts = all.filter(function (t) { return t !== A && t.category === A.category; }).map(function (t) { var w = words(t), s = 0; for (var k in w) if (base[k]) s++; return { t: t, s: s }; }).sort(function (a, b) { return b.s - a.s || a.t.name.localeCompare(b.t.name); }).map(function (x) { return x.t; });
          if (!alts.length) return { text: T("I don't have close alternatives to " + A.name + " yet.", "ما عنديش بدائل قريبة لـ " + A.name + " لسه."), tools: [] };
          setList(ctx, alts);
          return { text: T("Alternatives to " + A.name + ":", "بدائل " + A.name + ":"), tools: alts.slice(0, 4) };
        }
        if (!one && (/(^| )(price|pricing|cost|free|paid|plan|plans|subscription)( |$)/.test(N) || /(سعر|اسعار|بكام|مجاني|مدفوع|خطه)/.test(N))) {
          var mean = ctx.ar() ? MEAN_AR[A.status] : MEAN_EN[A.status];
          return { text: A.name + T(" is labeled " + stLabel(ctx, A.status) + " here (" + (mean || "") + "). Prices change, so check the official site.", " معلّمة " + stLabel(ctx, A.status) + " هنا (" + (mean || "") + "). الأسعار بتتغير، فراجع الموقع الرسمي."), tools: [A] };
        }
        if (one || /(^| )(what is|about|tell me|info|explain)( |$)/.test(N) || /(ايه|ما هو|عن|اشرح|عرفني|معلومات|بيعمل)/.test(N)) {
          return { text: A.name + " · " + (catL(A.category)) + "\n" + desc(ctx, A), tools: [A] };
        }
      }

      var cleaned = N.replace(/(best|top|good|great|better|popular|احسن|افضل|الاحسن|الافضل|اشهر|مشهور|ممتاز)/g, " ").replace(/(free|مجاني|مجانا|مجانيه|ببلاش)/g, " ").replace(/\s+/g, " ").trim();
      var hasBest = /(best|top|good|great|better|popular|احسن|افضل|الاحسن|الافضل|اشهر|مشهور|ممتاز)/.test(N), wantsFree = /(\bfree\b|مجاني|مجانا|مجانيه|ببلاش)/.test(N) && !/(mean|معني|يعني|freemium|unverified)/.test(N);
      if ((hasBest || wantsFree) && cleaned.split(" ").filter(function (w) { return w.length > 2; }).length) {
        var r = ctx.rank(cleaned), all0 = r;
        if (wantsFree) r = r.filter(function (t) { return t.status === "free" || t.status === "freemium"; });
        if (r.length) { setList(ctx, r); return { text: (hasBest ? T("I can't rank which is best, but these fit your request:", "ما أقدرش أرتّب أنهي الأحسن، بس دي المناسبة لطلبك:") : T("Free or free-tier options:", "خيارات مجانية أو بخطة مجانية:")), tools: r.slice(0, 4) }; }
        if (wantsFree && all0.length) { setList(ctx, all0); return { text: T("None of these are marked free here (some labels aren't verified yet). Closest matches:", "مفيش حاجة منهم معلّمة مجاني هنا (بعض التصنيفات لسه ما اتراجعتش). أقرب النتائج:"), tools: all0.slice(0, 4) }; }
      }
      if (/(beginner|easy|simple|starter|مبتدئ|سهل|بسيط|اول مره)/.test(N)) {
        var c2 = N.replace(/(beginner|beginners|easy|simple|starter|for|مبتدئ|مبتدئين|سهل|بسيط|اول مره)/g, " ").replace(/\s+/g, " ").trim();
        var r2 = c2.split(" ").filter(function (w) { return w.length > 2; }).length ? ctx.rank(c2) : [];
        if (r2.length) { setList(ctx, r2); return { text: T("I don't rate ease of use, but these fit the task. FREE or FREEMIUM ones are good to try first:", "ما بقيّمش سهولة الاستخدام، بس دي مناسبة للمهمة. جرّب الأول المجاني أو اللي بخطة مجانية:"), tools: r2.slice(0, 4) }; }
        return { text: T("I don't rate ease of use. Tell me the task, and I'll suggest tools; FREE or FREEMIUM ones are good to try first.", "ما بقيّمش سهولة الاستخدام. قولي المهمة وأرشحلك أدوات؛ جرّب الأول المجاني أو اللي بخطة مجانية."), tools: [] };
      }
    }
    return null;
  };
})();

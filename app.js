const SUPABASE_URL="https://znysymqmjxpmcxfqpmqp.supabase.co";
const SUPABASE_KEY="sb_publishable_3-UXEREhL_p90z6FOmUCig_vRpSpCyr";
const PAGE=24, CACHE="vyro_tools_cache_v1";
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl=u=>/^https?:\/\//i.test(u)?u:"#";
const catAr={"Video":"فيديو","Image & Design":"الصورة والتصميم","Voice":"الصوت","Audio & Voice":"الصوت","Writing":"الكتابة","Chat & Research":"الدردشة والبحث","Research":"البحث","Productivity":"الإنتاجية","Editing & Productivity":"التحرير والإنتاجية","Coding":"البرمجة","Other":"أخرى"};
const stEn={free:"FREE",freemium:"FREEMIUM",paid:"PAID",trial:"TRIAL",unverified:"UNVERIFIED"};
const stAr={free:"مجاني",freemium:"مجاني بحدود / مدفوع",paid:"مدفوع",trial:"تجربة مجانية",unverified:"غير مؤكد"};
const alias={"فيديو":["video"],"فيديوهات":["video"],"فديو":["video"],"صور":["image","design"],"صوره":["image","design"],"صورة":["image","design"],"تصميم":["design","image"],"صوت":["voice","audio"],"كتابه":["writing"],"كتابة":["writing"],"بحث":["research"],"برمجه":["coding"],"برمجة":["coding"],"مونتاج":["edit","video"],"ترجمه":["subtitle"],"ترجمة":["subtitle"]};
let all=[],active="All",stat="all",shown=PAGE,arabic=false,status="loading";
const norm=v=>(v||"").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const catLabel=c=>c==="All"?(arabic?"الكل":"All"):(arabic?catAr[c]||c:c);
const t=(en,ar)=>arabic?ar:en;

function matches(x,q){
  if(!q)return true;
  const hay=x._h||(x._h=norm([x.name,x.category,x.desc_en,x.desc_ar,x.keywords].join(" ")));
  const words=norm(q).split(" ").filter(w=>w.length>1);
  if(!words.length)return true;
  return words.every(w=>hay.includes(w)||(alias[w]||[]).some(a=>hay.includes(a)));
}
function filtered(){
  const q=$("searchInput").value.trim();
  return all.filter(x=>(active==="All"||x.category===active)&&(stat==="all"||x.status===stat)&&matches(x,q));
}
function renderCats(){
  const cats=["All",...[...new Set(all.map(x=>x.category).filter(Boolean))].sort()];
  $("categories").innerHTML=cats.map(c=>`<button class="cat ${active===c?"active":""}" data-c="${esc(c)}">${esc(catLabel(c))}</button>`).join("");
  const sts=[["all",t("All plans","كل الخطط")],["free",stAr.free],["freemium",stAr.freemium],["paid",stAr.paid],["trial",stAr.trial]];
  $("chips").innerHTML=sts.map(([k,l])=>`<button class="chip ${stat===k?"active":""}" data-s="${k}">${esc(k==="all"?l:t(stEn[k],stAr[k]))}</button>`).join("");
}
function renderTools(){
  if(status==="loading"&&!all.length){$("tools").innerHTML=`<div class="empty">${t("Loading tools…","جاري تحميل الأدوات…")}</div>`;$("count").textContent="";return}
  if(status==="error"&&!all.length){$("tools").innerHTML=`<div class="empty">${t("Couldn’t load the tools. Check your connection and refresh.","تعذر تحميل الأدوات. تأكد من الاتصال وحدّث الصفحة.")}</div>`;return}
  const list=filtered();
  $("count").textContent=arabic?`${list.length} أداة`:`${list.length} tools`;
  if(!list.length){$("tools").innerHTML=`<div class="empty">${t("No matching tools. Try video, image, voice, or chat.","مفيش أدوات مطابقة. جرّب فيديو أو صورة أو صوت.")}</div>`;$("moreBtn").hidden=true;return}
  $("tools").innerHTML=list.slice(0,shown).map(x=>`<article class="tool"><div class="tool-top"><div class="ico">${esc(x.icon||"✨")}</div><div><h3>${esc(x.name)}</h3><div class="type">${esc(catLabel(x.category))}</div></div></div><p>${esc(arabic?(x.desc_ar||x.desc_en):(x.desc_en||x.desc_ar))}</p><div class="tags"><span class="tag status status-${esc(x.status)}">${esc(t(stEn[x.status],stAr[x.status])||"")}</span></div><a href="${esc(safeUrl(x.url))}" target="_blank" rel="noopener noreferrer">${t("Open Tool ↗","فتح الأداة ↗")}</a></article>`).join("");
  const rest=list.length-shown;
  $("moreBtn").hidden=rest<=0;
  $("moreBtn").textContent=t(`Show more (${rest})`,`عرض المزيد (${rest})`);
}
const finderExamplesEn=["Create a video from text","Remove image background","Generate realistic voice","Write a YouTube script"];
const finderExamplesAr=["اعمل فيديو من نص","شيل خلفية صورة","حوّل النص لصوت","اكتب سكريبت يوتيوب"];
function renderFinderExamples(){const ex=arabic?finderExamplesAr:finderExamplesEn;$("finderExamples").innerHTML=ex.map(v=>`<button type="button" data-q="${esc(v)}">${esc(v)}</button>`).join("")}
const FSTOP=new Set("a an the to of for in on and or with from my me i we want need how can you do does make create generate get find some please tool tools ai app apps online free best new good that this it is are be use using اعمل اعملي عايز عايزه عاوز ابغي اريد ازاي كيف اي في من الي علي على عن مع او و ده دي ممكن لو ابي بدي اداه ادوات برنامج".split(" "));
const INTENTS=[
 {re:/(remov|reduc|cancel|clean|kill|isolat).{0,14}(noise|echo)|noise (cancel|remov|reduc|suppress)|ضوضاء|تنقيه.{0,8}صوت|تنظيف.{0,8}صوت/,ev:/noise|echo|clean up|enhance speech|ضوضاء/,cats:/audio|voice/},
 {re:/(remove|erase|delete|cut ?out|transparent).{0,14}background|background.{0,14}(remov|eras|delet|transparent)|bg remov|remove bg|(ازال|شيل|اشيل|مسح|حذف|تفريغ|قص).{0,12}خلفي|خلفيه شفاف/,ev:/remove bg|background remov|remove background|erase background|background eraser|cutout|transparent background|photoroom|clipdrop|ازاله الخلفيه|شيل الخلفيه/,cats:/image|design/,bad:/noise|ضوضاء/},
 {re:/(image|photo|picture).{0,6}to video|animate.{0,8}(image|photo|picture)|(صور).{0,10}(لفيديو|الي فيديو|فيديو)|تحريك.{0,8}صور/,ev:/image|photo|animate|animation|صور/,cats:/video/},
 {re:/(upscal|enhance|restore|sharpen|improve).{0,12}(image|photo|picture)|تحسين.{0,8}صور|تكبير.{0,8}صور|ترميم.{0,8}صور/,ev:/upscal|enhanc|restor|sharpen|تحسين|تكبير/,cats:/image|design/},
 {re:/logo|brand identity|شعار|لوجو|هويه بصريه/,ev:/logo|brand|شعار|لوجو|هويه/,cats:/image|design/},
 {re:/presentation|slides|powerpoint|عرض تقديمي|شرايح|شرائح/,ev:/presentation|slides|عرض|شرايح|شرائح/,cats:/image|design/},
 {re:/(generate|create|make|design|draw|paint).{0,12}(image|picture|photo|art|illustration|poster)|text to image|ai (image|art)|(صمم|ارسم|انشاء|توليد|عمل|اعمل).{0,12}(صور|لوحه|بوستر)/,ev:/image|art|design|illustrat|poster|صور|تصميم/,cats:/image|design/},
 {re:/(text|script|prompt).{0,8}to video|video from (text|prompt|script)|(create|make|generate|produce).{0,10}video|(فيديو من|اعمل فيديو|انشاء فيديو|صنع فيديو|عمل فيديو|توليد فيديو)|(نص|النص|سكريبت).{0,8}(لفيديو|الي فيديو|فيديو)|(حول|تحويل).{0,12}(الي|لـ?) ?فيديو/,ev:/video|فيديو/,cats:/video/,boost:/text|prompt|generat|script|avatar|نص|توليد/},
 {re:/subtitle|caption|كابشن|سب ?تايتل|ترجمه (ال)?فيديو|ترجمه الفيديو/,ev:/caption|subtitle|ترجمه|transcri/,cats:/video|editing|productiv/},
 {re:/transcrib|speech to text|audio to text|meeting (notes|summar)|تفريغ|(حول|تحويل).{0,10}صوت.{0,8}(لنص|الي نص)/,ev:/transcri|meeting|notes|تفريغ|اجتماع/,cats:/audio|voice|editing|productiv/},
 {re:/(separat|isolate|split|extract).{0,12}(vocal|voice|instrument|stem)|stems?\b|فصل.{0,10}(صوت|اغني|موسيق|الات)/,ev:/separat|stem|vocal|isolate/,cats:/audio|voice/},
 {re:/music|song|soundtrack|beat\b|موسيق|اغني|اغاني/,ev:/music|song|موسيق|اغان/,cats:/audio|voice/,bad:/separat|stems|isolate|noise|clean up|ضوضاء/},
 {re:/(text|script).{0,8}to (speech|voice|audio)|\btts\b|voice ?over|(realistic|natural|ai|human).{0,10}voice|(نص|النص).{0,10}(لصوت|الي صوت|صوت|كلام)|تعليق صوتي|توليد صوت|استنساخ صوت|clone.{0,6}voice/,ev:/voice|speech|tts|صوت/,cats:/audio|voice/,bad:/noise|separat|compose|music|song|stems|clean up|isolate|ضوضاء/},
 {re:/translat|ترجم/,ev:/translat|ترجم/,cats:/writing|research|chat/,bad:/subtitle|caption/},
 {re:/(write|writing|draft).{0,14}(script|article|blog|post|email|copy|essay|story|caption)|script|اكتب|كتابه|سكريبت|مقال|بوست|محتوي/,ev:/writ|script|copy|article|content|كتاب|سكريبت|مقال|محتوي/,cats:/writing/},
 {re:/research|paper|pdf|study|scholar|بحث|ابحاث|ورقه علميه|دراسه/,ev:/research|paper|pdf|scholar|search|بحث|document|answer/,cats:/research|chat/},
 {re:/automat|workflow|zap|اتمت|ربط تطبيقات/,ev:/automat|workflow|اتمت/,cats:/productiv|editing/},
 {re:/\bcode\b|coding|program|developer|website builder|build (a |an )?(app|site|website)|برمج|كود|بناء موقع|انشاء موقع|تطبيق/,ev:/code|coding|app|web|dev|programm|برمج|كود/,cats:/coding/}
];
const DOMAINS=[
 {re:/video|فيديو|فديو|reels|ريلز|shorts|شورتس/,cats:/video/,w:/^(video|فيديو|فديو|reels|ريلز|shorts|شورتس)$/},
 {re:/image|photo|picture|صور|design|تصميم|logo|لوجو/,cats:/image|design/,w:/^(image|images|photo|photos|picture|pictures|صور|صوره|design|تصميم|logo|لوجو)$/},
 {re:/voice|audio|speech|music|صوت|موسيق|كلام/,cats:/audio|voice/,w:/^(voice|audio|speech|music|صوت|موسيقي|موسيق|كلام)$/},
 {re:/writ|article|blog|كتابه|مقال/,cats:/writing|chat/,w:/^(write|writing|article|blog|كتابه|مقال)$/},
 {re:/\bcode\b|coding|program|برمج|كود/,cats:/coding/,w:/^(code|coding|program|programming|برمجه|كود)$/},
 {re:/research|paper|بحث|ابحاث/,cats:/research|chat/,w:/^(research|paper|بحث|ابحاث)$/},
 {re:/meeting|automat|productiv|اجتماع|اتمت|انتاجيه/,cats:/productiv|editing/,w:/^(meeting|automation|productivity|اجتماع|اتمته|انتاجيه)$/}
];
function finderScore(x,q){
 const nq=norm(q);if(!nq)return 0;
 const name=norm(x.name),cat=norm(x.category),keys=norm(x.keywords||""),desc=norm([x.desc_en,x.desc_ar].join(" ")),nk=name+" "+keys,hay=nk+" "+desc;
 const bonus=(x.status==="free"?3:x.status==="freemium"?2:0);
 const it=INTENTS.find(p=>p.re.test(nq));
 if(it){
  if(it.bad&&it.bad.test(hay))return 0;
  const strong=it.ev.test(nk),catOk=it.cats.test(cat),direct=it.ev.test(hay);
  // Hard category lock: a tool outside the task's categories only qualifies by name/keywords.
  if(!catOk&&!strong)return 0;
  if(!catOk&&strong)return 40+bonus;
  if(!direct)return 0;
  return (strong?100:60)+(desc.match(new RegExp(it.ev.source,"g"))||[]).length*2+(it.boost&&it.boost.test(desc)?15:0)+bonus;
 }
 const terms=nq.split(" ").filter(w=>w.length>1&&!FSTOP.has(w));
 if(!terms.length)return 0;
 const doms=DOMAINS.filter(d=>d.re.test(nq));
 if(doms.length&&!doms.some(d=>d.cats.test(cat)))return 0;
 const topical=terms.filter(w=>!doms.some(d=>d.w.test(w)));
 const hit=w=>{const pad=" "+hay+" ";const ok=w.length>=4?hay.includes(w):pad.includes(" "+w);return ok||(alias[w]||[]).some(a=>hay.includes(a))};
 if(!topical.length)return doms.length?10+bonus:0;
 let n=0,sc=0;
 for(const w of topical){if(hit(w)){n++;sc+=(name.includes(w)?9:0)+(keys.includes(w)?7:0)+(cat.includes(w)?3:0)+(desc.includes(w)?4:0)+3}}
 if(n<Math.max(1,Math.ceil(topical.length*0.6)))return 0;
 return sc+(doms.length?5:0)+bonus;
}
function runFinder(q){const query=q.trim();if(!query)return;const r0=all.map(x=>({x,score:finderScore(x,query)})).filter(a=>a.score>0).sort((a,b)=>b.score-a.score||a.x.name.localeCompare(b.x.name));const top=r0.length?r0[0].score:0;const ranked=r0.filter(a=>a.score>=top*0.5).slice(0,24);active="All";stat="all";$("searchInput").value="";shown=30;renderCats();const list=ranked.map(a=>a.x);if(!list.length){$("toolsTitle").textContent=arabic?"النتائج المقترحة":"Suggested tools";$ ("count").textContent=arabic?"0 أدوات":"0 tools";$ ("tools").innerHTML=`<div class="empty">${t("No matches yet. Try another description.","مفيش نتائج. جرّب وصف تاني.")}</div>`;$ ("moreBtn").hidden=true;return}const original=all;all=list;renderTools();all=original;$ ("toolsTitle").textContent=arabic?"النتائج المقترحة":"Suggested tools";$ ("count").textContent=arabic?`${list.length} ترشيح`:`${list.length} recommendations`;scrollTo({top:$ ("toolsTitle").getBoundingClientRect().top+scrollY-80,behavior:"smooth"})}
$("finderForm").onsubmit=e=>{e.preventDefault();runFinder($("finderInput").value)};
$("finderExamples").onclick=e=>{const q=e.target.dataset.q;if(q){$("finderInput").value=q;runFinder(q)}};
function refresh(reset){if(reset)shown=PAGE;renderCats();renderTools()}

$("categories").onclick=e=>{const c=e.target.dataset.c;if(c){active=c;refresh(1)}};
$("chips").onclick=e=>{const s=e.target.dataset.s;if(s){stat=s;refresh(1)}};
$("moreBtn").onclick=()=>{shown+=PAGE;renderTools()};
$("searchInput").addEventListener("input",()=>{active="All";refresh(1)});
$("searchForm").onsubmit=e=>{e.preventDefault();$("toolsTitle").scrollIntoView({behavior:"smooth",block:"start"})};
$("exploreBtn").onclick=()=>$("categories").scrollIntoView({behavior:"smooth"});
$("homeBtn").onclick=()=>{active="All";stat="all";$("searchInput").value="";refresh(1);scrollTo({top:0,behavior:"smooth"})};
$("langBtn").onclick=()=>{
  arabic=!arabic;document.documentElement.lang=arabic?"ar":"en";document.body.dir=arabic?"rtl":"ltr";
  $("langBtn").textContent=arabic?"English":"العربية";
  $("exploreBtn").textContent=arabic?"استكشف":"↗ Explore";$("homeBtn").textContent=arabic?"الرئيسية":"Home";
  $("eyebrow").textContent=arabic?"مكان واحد. احتمالات بلا حدود":"ONE PLACE. ENDLESS POSSIBILITIES";
  $("headline").innerHTML=arabic?'اكتشف الذكاء الاصطناعي.<br><span class="purple">أنجز المزيد.</span>':'DISCOVER AI. <span class="cyan">DO</span><br><span class="purple">MORE.</span>';
  $("sub").textContent=arabic?"اكتشف أداة الذكاء الاصطناعي المناسبة لك — من غير بحث طويل.":"Find the right AI tool for your needs — without the endless searching.";
  $("searchInput").placeholder=arabic?"ابحث (مثال: فيديو من نص)":"Search (e.g. make a video from text)";
  $("searchBtn").textContent=arabic?"بحث ↗":"↗ Search";
  $("catTitle").textContent=arabic?"استكشف الفئات":"Explore Categories";
  $("catHint").textContent=arabic?"اختر ما تريد إنشاءه":"Pick what you want to create";
  $("toolsTitle").textContent=arabic?"استكشف أدوات الذكاء الاصطناعي":"Explore AI Tools";
  $("footer").textContent=arabic?"قد تتغير تفاصيل الأدوات والخطط المجانية — راجع الموقع الرسمي لكل أداة.":"Tool details and free-plan availability may change. Verify on each tool’s official website.";
  $("finderTitle").textContent=arabic?"✨ مساعد VYRO":"✨ AI Finder";
  $("finderSub").textContent=arabic?"اكتب عايز تعمل إيه — وهنرشحلك الأدوات المناسبة.":"Tell VYRO what you want to do — discover tools that fit your goal.";
  $("finderInput").placeholder=arabic?"مثال: اعمل فيديو من نص، شيل خلفية صورة، اكتب سكريبت":"e.g. create a video from text, remove background, write a script";
  $("finderBtn").textContent=arabic?"اعثر على أدوات":"Find tools";
  $("finderNote").textContent=arabic?"نسخة تجريبية للمطابقة الذكية: الترشيحات حسب وصف الأداة والكلمات المفتاحية.":"Prototype: task-aware ranking prioritizes relevant tool descriptions and reduces unrelated categories.";
  renderFinderExamples();
  refresh();
};


async function load(){
  try{const c=JSON.parse(localStorage.getItem(CACHE)||"null");if(Array.isArray(c)&&c.length){all=c;status="ok";refresh(1)}}catch(e){}
  try{
    const db=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    const {data,error}=await db.from("tools").select("name,category,status,icon,url,desc_en,desc_ar,keywords").order("name").limit(5000);
    if(error)throw error;
    all=data;status="ok";
    try{localStorage.setItem(CACHE,JSON.stringify(data))}catch(e){}
  }catch(e){if(!all.length)status="error"}
  refresh(1);
}
refresh();load();

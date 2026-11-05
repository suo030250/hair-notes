"use strict";

const categories = {"hair-care":"日常護理","color-perm":"染燙照護","styling":"造型整理","faq":"常見問題"};
const statuses = {seed:"研究中",draft:"閱讀草稿",reviewed:"已核對來源","needs-review":"待重新核對"};
const $ = (id) => document.getElementById(id);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function articleUrl(id) { return "article.html?id=" + encodeURIComponent(id); }
function minutes(article) {
  const length = article.sections.reduce((sum, section) => sum + section.paragraphs.join("").length, 0);
  return Math.max(1, Math.ceil(length / 350));
}

function validateArticles(data) {
  if (!Array.isArray(data)) throw new Error("Invalid article collection");
  const ids = new Set();
  for (const article of data) {
    if (!article || typeof article !== "object" || typeof article.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.id) || ids.has(article.id)) throw new Error("Invalid article ID");
    ids.add(article.id);
    for (const key of ["title","summary","wikiPath"]) if (typeof article[key] !== "string" || !article[key].trim()) throw new Error("Missing article text");
    if (!Object.hasOwn(categories, article.category) || !Object.hasOwn(statuses, article.status)) throw new Error("Invalid category or status");
    for (const key of ["created","updated"]) if (typeof article[key] !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(article[key])) throw new Error("Invalid article date");
    if (!Array.isArray(article.tags) || !article.tags.every(tag => typeof tag === "string")) throw new Error("Invalid tags");
    if (!Array.isArray(article.sections) || !article.sections.length || !article.sections.every(section => typeof section.heading === "string" && Array.isArray(section.paragraphs) && section.paragraphs.every(p => typeof p === "string"))) throw new Error("Invalid sections");
    if (!Array.isArray(article.sources) || !article.sources.every(source => typeof source.title === "string" && typeof source.url === "string" && /^https:\/\//.test(source.url) && /^\d{4}-\d{2}-\d{2}$/.test(source.accessed))) throw new Error("Invalid sources");
    if (article.limitations !== undefined && (!Array.isArray(article.limitations) || !article.limitations.every(item => typeof item === "string"))) throw new Error("Invalid limitations");
  }
  return data;
}

async function loadArticles() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch("data/articles.json", {signal:controller.signal});
    if (!response.ok) throw new Error("Article data unavailable");
    return validateArticles(await response.json());
  } finally { clearTimeout(timeout); }
}

function makeCard(article, index) {
  const card = element("a", "article-card");
  card.href = articleUrl(article.id);
  const art = element("div", "card-art" + (article.category === "faq" ? " alt" : ""));
  art.setAttribute("aria-hidden", "true");
  art.append(element("span", "card-kicker", "HAIR NOTES / " + (article.category === "faq" ? "THE QUESTION" : "EVERYDAY CARE")), element("span", "card-number", String(index + 1).padStart(2,"0")));
  const body = element("div", "card-body");
  body.append(element("p", "card-label", categories[article.category] + " · " + statuses[article.status]), element("h3", "", article.title), element("p", "card-summary", article.summary));
  const bottom = element("div", "card-bottom");
  const time = element("time", "", article.updated.replaceAll("-", "."));
  time.dateTime = article.updated;
  const meta = element("span"); meta.append(time, document.createTextNode(" · 約 " + minutes(article) + " 分鐘"));
  const read = element("strong", "", "閱讀筆記");
  const arrow = element("span", "", "↗"); arrow.setAttribute("aria-hidden","true"); read.append(arrow);
  bottom.append(meta, read); body.append(bottom); card.append(art, body);
  return card;
}

function setupHome(articles) {
  const params = new URLSearchParams(location.search);
  let category = Object.hasOwn(categories, params.get("category")) ? params.get("category") : "all";
  const search = $("search");
  search.value = params.get("q") || "";
  const filters = document.querySelectorAll("[data-category]");
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    filters.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
    const words = query.split(/\s+/).filter(Boolean);
    const filtered = articles.filter(article => {
      const haystack = [article.title, article.summary, ...article.tags, ...article.sections.flatMap(section => [section.heading, ...section.paragraphs])].join(" ").toLocaleLowerCase();
      return (category === "all" || article.category === category) && words.every(word => haystack.includes(word));
    });
    $("article-grid").replaceChildren(...filtered.map(article => makeCard(article, articles.indexOf(article))));
    $("article-grid").setAttribute("aria-busy", "false");
    $("result-count").textContent = "共 " + filtered.length + " 篇筆記";
    $("list-state").hidden = filtered.length > 0;
    $("reset-filters").hidden = false;
    $("retry-load").hidden = true;
    if (!filtered.length) {
      $("state-title").textContent = query ? "還沒找到這個問題的筆記" : "這個分類，正在慢慢整理中";
      $("state-message").textContent = query ? "試試更短的關鍵字，或回到全部筆記看看。" : "先從現有的日常洗護與常見問題讀起，更多內容會持續加入。";
    }
    const next = new URLSearchParams();
    if (query) next.set("q", search.value.trim());
    if (category !== "all") next.set("category", category);
    history.replaceState(null, "", location.pathname + (next.size ? "?" + next : "") + location.hash);
  }
  filters.forEach(button => button.addEventListener("click", () => {category = button.dataset.category; render();}));
  search.addEventListener("input", render);
  $("search-form").addEventListener("submit", event => {event.preventDefault(); render();});
  $("reset-filters").addEventListener("click", () => {category="all"; search.value=""; render(); search.focus();});
  render();
}

function citedParagraph(text, sourceCount) {
  const paragraph = element("p");
  let end = 0;
  for (const match of text.matchAll(/\[(\d+)\]/g)) {
    paragraph.append(document.createTextNode(text.slice(end, match.index)));
    const n = Number(match[1]);
    if (n > 0 && n <= sourceCount) {
      const link = element("a", "citation", match[0]);
      link.href="#source-" + n; link.setAttribute("aria-label", "查看來源 " + n); paragraph.append(link);
    } else paragraph.append(document.createTextNode(match[0]));
    end = match.index + match[0].length;
  }
  paragraph.append(document.createTextNode(text.slice(end)));
  return paragraph;
}

function renderArticle(articles) {
  const id = new URLSearchParams(location.search).get("id");
  const article = articles.find(item => item.id === id);
  if (!article) {
    document.title = "找不到這篇筆記｜Hair Notes";
    $("article-state-title").textContent="找不到這篇筆記";
    $("article-state-message").textContent="這個連結可能不完整，或筆記尚未加入。可以先回到列表找找看。";
    return;
  }
  document.title = article.title + "｜Hair Notes";
  document.querySelector('meta[name="description"]').content = article.summary;
  $("article-state").hidden = true;
  $("article-content").hidden = false;
  $("article-category").textContent = categories[article.category] + " / HAIR NOTES";
  $("article-title").textContent = article.title;
  const date = element("time", "", "更新 " + article.updated.replaceAll("-",".")); date.dateTime=article.updated;
  $("article-meta").replaceChildren(date, element("span", "", "約 " + minutes(article) + " 分鐘閱讀"), element("span", "status-badge", statuses[article.status]));
  $("article-summary").textContent = article.summary;
  $("article-tags").replaceChildren(...article.tags.map(tag => element("span","","# " + tag)));
  const sections = [], toc = [];
  article.sections.forEach((section, index) => {
    const node = element("section"); node.id="section-" + (index+1);
    const heading = element("h2","",section.heading); heading.id=node.id + "-title"; node.setAttribute("aria-labelledby",heading.id);
    node.append(heading,...section.paragraphs.map(p => citedParagraph(p, article.sources.length))); sections.push(node);
    const link = element("a","",section.heading); link.href="#"+node.id; toc.push(link);
  });
  const sourceLink=element("a","","來源與適用範圍"); sourceLink.href="#sources"; toc.push(sourceLink);
  $("article-sections").replaceChildren(...sections); $("toc-links").replaceChildren(...toc);
  $("article-sources").replaceChildren(...article.sources.map((source,index) => {
    const li=element("li"); li.id="source-"+(index+1);
    const link=element("a","",source.title + " ↗"); link.href=source.url; link.target="_blank";link.rel="noopener noreferrer";
    link.setAttribute("aria-label",source.title+"（在新分頁開啟）");
    li.append(link,element("span","source-date","查閱日期："+source.accessed));return li;
  }));
  if (!article.sources.length) $("article-sources").append(element("li","","本篇為專案編輯提案，沒有引用外部研究結論。"));
  const limits = article.limitations || ["一般知識分享，不代替個別醫療評估。"];
  $("article-limitations").replaceChildren(...limits.map(text=>element("li","",text)));
  $("related-articles").replaceChildren(...articles.filter(item=>item.id!==article.id).slice(0,2).map(item=>makeCard(item,articles.indexOf(item))));
  document.querySelector(".related-section").hidden = articles.length<2;
  if (location.hash) requestAnimationFrame(() => {
    const target=document.getElementById(location.hash.slice(1)); if(target) target.scrollIntoView();
  });
}

async function start() {
  const page = document.body.dataset.page;
  try {
    const articles = await loadArticles();
    if (page === "home") setupHome(articles);
    else if (page === "article") renderArticle(articles);
  } catch {
    if (page === "home") {
      $("article-grid").setAttribute("aria-busy","false");
      $("result-count").textContent="暫時無法載入";
      $("list-state").hidden=false; $("reset-filters").hidden=true; $("retry-load").hidden=false;
      $("state-title").textContent="筆記暫時沒有載入成功";
      $("state-message").textContent="請確認網路連線後重新載入。若你正在電腦上預覽，請使用本機網站網址開啟。";
    } else {
      $("article-state-title").textContent="筆記暫時沒有載入成功";
      $("article-state-message").textContent="請確認連線後再試一次，或先回到全部筆記。";
      $("article-retry").hidden=false;
    }
  }
}

for (const id of ["retry-load","article-retry"]) if ($(id)) $(id).addEventListener("click",()=>location.reload());
start();

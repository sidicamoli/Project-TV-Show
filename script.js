let currentShowId = null;
let allEpisodes = [];


const memCache = new Map();
function cacheGet(key) {
  if (memCache.has(key)) return memCache.get(key);
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    memCache.set(key, parsed);
    return parsed;
  } catch {
    return null;
  }
}
function cacheSet(key, data) {
  memCache.set(key, data);
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

async function fetchWithCache(url, key) {
  const cached = cacheGet(key);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error: ${res.status}`);
  const data = await res.json();
  cacheSet(key, data);
  return data;
}


async function loadShows() {

  const shows = await fetchWithCache(
    "https://api.tvmaze.com/shows",
    "tvmaze:shows"
  );
 
  const slim = shows
    .map(s => ({ id: s.id, name: s.name }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "accent", usage: "sort" }));
  cacheSet("tvmaze:shows-slim", slim);
  return slim;
}


async function loadEpisodes(showId) {
  const key = `tvmaze:episodes:${showId}`;
  return fetchWithCache(`https://api.tvmaze.com/shows/${showId}/episodes`, key);
}

function episodeCode(ep) {
  return `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
}

function renderEpisodes(episodeList) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  for (const episode of episodeList) {
    const card = document.createElement("div");
    card.className = "episode-card";
    card.id = `episode-${episode.id}`;

    const titleBar = document.createElement("div");
    titleBar.className = "episode-title-bar";
    titleBar.textContent = `${episode.name} - ${episodeCode(episode)}`;

    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = episode.name;

    const summary = document.createElement("div");
    summary.className = "episode-summary";
    summary.innerHTML = episode.summary || "";

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on TVMaze";

    card.appendChild(titleBar);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(link);

    root.appendChild(card);
  }
}


function populateEpisodeSelect(episodes) {
  const sel = document.getElementById("episode-select");
  sel.innerHTML = '<option value="all">Show All Episodes</option>';
  for (const ep of episodes) {
    const opt = document.createElement("option");
    opt.value = String(ep.id);
    opt.textContent = `${episodeCode(ep)} - ${ep.name}`;
    sel.appendChild(opt);
  }
}

function updateCount(displayed, total) {
  const count = document.getElementById("search-count");
  count.textContent = `Displaying ${displayed} / ${total} episodes`;
}


function filterEpisodes(term) {
  const q = term.toLowerCase();
  return allEpisodes.filter(ep => {
    const code = episodeCode(ep).toLowerCase();
    const name = ep.name.toLowerCase();
    const summary = (ep.summary || "").toLowerCase();
    return code.includes(q) || name.includes(q) || summary.includes(q);
  });
}

function setupSearchListener() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => {
    const term = input.value.trim();
    const list = term ? filterEpisodes(term) : allEpisodes;
    renderEpisodes(list);
    updateCount(list.length, allEpisodes.length);

    const sel = document.getElementById("episode-select");
    sel.value = "all";
  });
}

function setupEpisodeSelectListener() {
  const sel = document.getElementById("episode-select");
  sel.addEventListener("change", e => {
    const value = e.target.value;
    if (value === "all") {
      renderEpisodes(allEpisodes);
      updateCount(allEpisodes.length, allEpisodes.length);
    } else {
      const chosen = allEpisodes.find(ep => ep.id === Number(value));
      const list = chosen ? [chosen] : [];
      renderEpisodes(list);
      updateCount(list.length, allEpisodes.length);
    }
   
    const input = document.getElementById("search-input");
    input.value = "";
  });
}


async function onShowChange(showId) {
  const root = document.getElementById("root");
  root.textContent = "Loading episodes…";
  currentShowId = showId;

  try {
    allEpisodes = await loadEpisodes(showId);
    populateEpisodeSelect(allEpisodes);
    renderEpisodes(allEpisodes);
    updateCount(allEpisodes.length, allEpisodes.length);

 
    const input = document.getElementById("search-input");
    input.value = "";
  } catch (e) {
    root.textContent = "Error loading episodes. Please try again later.";
   
    console.error(e);
  }
}


async function setup() {
  const root = document.getElementById("root");
  root.textContent = "Loading…";

  try {
    const shows = (cacheGet("tvmaze:shows-slim")) || await loadShows();

    const showSel = document.getElementById("show-select");
    showSel.innerHTML = ""; 
    for (const s of shows) {
      const opt = document.createElement("option");
      opt.value = String(s.id);
      opt.textContent = s.name;
      showSel.appendChild(opt);
    }

   
    const firstId = shows[0]?.id;
    if (firstId == null) {
      root.textContent = "No shows available.";
      return;
    }
    showSel.value = String(firstId);

  
    showSel.addEventListener("change", e => {
      onShowChange(Number(e.target.value));
    });
    setupSearchListener();
    setupEpisodeSelectListener();

    
    await onShowChange(firstId);
  } catch (e) {
    root.textContent = "Error loading shows. Please try again later.";
  
    console.error(e);
  }
}

window.onload = setup;







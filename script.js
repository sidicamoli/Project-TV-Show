let allEpisodes = [];

function setup() {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "Loading episodes...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then((data) => {
      allEpisodes = data;
      renderEpisodes(allEpisodes);
      setupSearch();
      setupEpisodeSelector();
      updateCount(allEpisodes.length, allEpisodes.length);
    })
    .catch((err) => {
      rootElem.textContent =
        "Error loading episodes. Please try again later.";
      console.error(err);
    });
}

function renderEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  for (let episode of episodeList) {
    const card = document.createElement("div");
    card.className = "episode-card";
    card.id = `episode-${episode.id}`;

    const titleBar = document.createElement("div");
    titleBar.className = "episode-title-bar";
    const code = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    titleBar.textContent = `${episode.name} - ${code}`;

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

    rootElem.appendChild(card);
  }
}

function updateCount(displayed, total) {
  const countElem = document.getElementById("search-count");
  if (countElem) {
    countElem.textContent = `Displaying ${displayed} / ${total} episodes`;
  }
}

function filterEpisodes(searchTerm) {
  const lowerSearch = searchTerm.toLowerCase();
  return allEpisodes.filter((ep) => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(
      ep.number
    ).padStart(2, "0")}`;
    const nameMatch = ep.name.toLowerCase().includes(lowerSearch);
    const summaryText = (ep.summary || "").toLowerCase();
    const summaryMatch = summaryText.includes(lowerSearch);
    const codeMatch = code.toLowerCase().includes(lowerSearch);
    return nameMatch || summaryMatch || codeMatch;
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => {
    const term = input.value.trim();
    const filtered = term ? filterEpisodes(term) : allEpisodes;
    renderEpisodes(filtered);
    updateCount(filtered.length, allEpisodes.length);
    
    const sel = document.getElementById("episode-select");
    if (sel) sel.value = "all";
  });
}

function setupEpisodeSelector() {
  const select = document.getElementById("episode-select");

  
  select.innerHTML = '<option value="all">Show All Episodes</option>';
  allEpisodes.forEach((ep) => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(
      ep.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;
    select.appendChild(option);
  });

  
  select.addEventListener("change", (e) => {
    const { value } = e.target;
    if (value === "all") {
      renderEpisodes(allEpisodes);
      updateCount(allEpisodes.length, allEpisodes.length);
    } else {
      const selected = allEpisodes.find((ep) => ep.id === Number(value));
      if (selected) {
        renderEpisodes([selected]);
        updateCount(1, allEpisodes.length);
      }
    }
    
    const input = document.getElementById("search-input");
    if (input) input.value = "";
  });
}

window.onload = setup;





// === Refactored by Hendrine Zeraua for Level 200 ===
// - Renamed makePageForEpisodes → renderEpisodes
// - Extracted card-building logic into createEpisodeCard()
// - Added search + episode selector dropdown functionality

let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  renderEpisodes(allEpisodes);
  setupSearch();
  setupEpisodeSelector();
}

function renderEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  for (let episode of episodeList) {
    const card = createEpisodeCard(episode);
    rootElem.appendChild(card);
  }

  const credit = document.createElement("p");
  credit.innerHTML =
    'Data from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(credit);

  const countElem = document.getElementById("search-count");
  if (countElem) {
    countElem.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;
  }
}

function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.className = "episode-card";
  card.id = `episode-${episode.id}`;

  const title = document.createElement("h2");
  const code = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;
  title.textContent = `${code} - ${episode.name}`;

  const img = document.createElement("img");
  img.src = episode.image.medium;
  img.alt = episode.name;

  const summary = document.createElement("div");
  summary.innerHTML = episode.summary;

  const link = document.createElement("a");
  link.href = episode.url;
  link.target = "_blank";
  link.textContent = "View on TVMaze";

  card.appendChild(title);
  card.appendChild(img);
  card.appendChild(summary);
  card.appendChild(link);

  return card;
}

function filterEpisodes(searchTerm, episodes) {
  const lowerSearch = searchTerm.toLowerCase();
  return episodes.filter(ep => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
    return (
      ep.name.toLowerCase().includes(lowerSearch) ||
      ep.summary.toLowerCase().includes(lowerSearch) ||
      code.toLowerCase().includes(lowerSearch)
    );
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => {
    const searchTerm = input.value.trim();
    const filtered = filterEpisodes(searchTerm, allEpisodes);
    renderEpisodes(filtered);
  });
}

function setupEpisodeSelector() {
  const select = document.getElementById("episode-select");

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Show All Episodes";
  select.appendChild(defaultOption);

  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");
    const code = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", (event) => {
    const selectedId = event.target.value;
    if (selectedId === "all") {
      renderEpisodes(allEpisodes);
    } else {
      const selected = allEpisodes.find((ep) => ep.id === Number(selectedId));
      renderEpisodes([selected]);
    }
  });
}

window.onload = setup;



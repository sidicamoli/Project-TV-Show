// === Refactored by Hendrine Zeraua for Level 200 ===
// - Renamed `makePageForEpisodes` to `renderEpisodes` for clarity
// - Extracted card-building logic into `createEpisodeCard(episode)`
// - Improved modularity for future features (search, selector)

let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  renderEpisodes(allEpisodes); // Show all episodes initially
  setupSearch();               // Set up live search
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

// Creates a single episode card from an episode object
function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.className = "episode-card";
  card.id = `episode-${episode.id}`; // helpful for jumping later

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
//  Filters episodes by name or summary based on search term

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

//  Sets up live search functionality
function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", () => {
    const searchTerm = input.value.trim();
    const filtered = filterEpisodes(searchTerm, allEpisodes);
    renderEpisodes(filtered);
  });
}

window.onload = setup;



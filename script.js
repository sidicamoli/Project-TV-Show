// === Refactored by Hendrine Zeraua for Level 200 ===
// - Renamed `makePageForEpisodes` to `renderEpisodes` for clarity
// - Extracted card-building logic into `createEpisodeCard(episode)`
// - Improved modularity for future features (search, selector)

function setup() {
  const allEpisodes = getAllEpisodes(); // This gives you all 73 episodes
  renderEpisodes(allEpisodes); //Renamed from makePageForEpisodes
}

// Renders all episodes and adds attribution link
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

window.onload = setup;

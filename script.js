let allEpisodes = [];

function setup() {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "Loading episodes...";

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then(response => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then(data => {
      allEpisodes = data;
      renderEpisodes(allEpisodes);
      setupSearch();
      setupEpisodeSelector();
    })
    .catch(err => {
      rootElem.textContent = "Error loading episodes. Please try again later.";
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
    const code = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
    titleBar.textContent = `${episode.name} - ${code}`;

    const img = document.createElement("img");
    img.src = episode.image?.medium || "";
    img.alt = episode.name;

    const summary = document.createElement("div");
    summary.innerHTML = episode.summary || "";

    const link = document.createElement("a");
    link.href = episode.url;
    link.target = "_blank";
    link.textContent = "View on TVMaze";

    card.appendChild(titleBar);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(link);

    rootElem.appendChild(card);
  }

  const countElem = document.getElementById("search-count");
  countElem.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;
}

function filterEpisodes(searchTerm) {
  const lowerSearch = searchTerm.toLowerCase();
  return allEpisodes.filter(ep => {
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
    const filtered = filterEpisodes(input.value.trim());
    renderEpisodes(filtered);
  });
}

function setupEpisodeSelector() {
  const select = document.getElementById("episode-select");

  select.innerHTML = '<option value="all">Show All Episodes</option>';
  allEpisodes.forEach(ep => {
    const code = `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = ep.id;
    option.textContent = `${ep.name} - ${code}`;
    select.appendChild(option);
  });

  select.addEventListener("change", e => {
    if (e.target.value === "all") {
      renderEpisodes(allEpisodes);
    } else {
      const selected = allEpisodes.find(ep => ep.id === Number(e.target.value));
      renderEpisodes([selected]);
    }
  });
}

window.onload = setup;



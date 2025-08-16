let currentEpisodes = [];
let cachedShows = [];
let cachedEpisodes = {};

function formatEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

function setupEpisodeControls(episodes) {
  const controls = document.getElementById("controls");
  controls.innerHTML = "";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Shows";
  backBtn.addEventListener("click", showShowsListing);
  controls.appendChild(backBtn);

  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";
  episodeSelect.innerHTML =
    `<option value="" disabled selected>Jump to episode...</option>` +
    episodes.map(ep => {
      const code = formatEpisodeCode(ep);
      return `<option value="${code}">${code} - ${ep.name}</option>`;
    }).join("");

  const searchInput = document.createElement("input");
  searchInput.id = "episode-search";
  searchInput.placeholder = "Search episodes...";

  const countDisplay = document.createElement("p");
  countDisplay.id = "episode-count";
  countDisplay.textContent = `Displaying ${episodes.length}/${episodes.length} episodes`;

  controls.append(episodeSelect, searchInput, countDisplay);

  episodeSelect.addEventListener("change", e => {
    const target = document.getElementById(e.target.value);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let matches = 0;
    document.querySelectorAll(".episode-card").forEach(card => {
      const match = card.dataset.name.includes(query) || card.dataset.summary.includes(query);
      card.style.display = match ? "block" : "none";
      if (match) matches++;
    });
    countDisplay.textContent = `Displaying ${matches}/${episodes.length} episodes`;
  });
}

function makePageForEpisodes(episodes) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const fragment = document.createDocumentFragment();

  episodes.forEach(episode => {
    const section = document.createElement("section");
    section.classList.add("episode-card");
    section.id = formatEpisodeCode(episode);
    section.dataset.name = episode.name.toLowerCase();
    section.dataset.summary = episode.summary?.toLowerCase() || "";

    section.innerHTML = `
      <h2 class="episode-title">${episode.name} – ${formatEpisodeCode(episode)}</h2>
      <div class="episode-content">
        <img src="${episode.image?.medium || "https://via.placeholder.com/210x295?text=No+Image"}" alt="${episode.name}">
        <div class="episode-details">
          <div>${episode.summary || "No summary available."}</div>
          <a href="${episode.url}" target="_blank">View on TVMaze</a>
        </div>
      </div>
    `;

    fragment.appendChild(section);
  });

  rootElem.appendChild(fragment);
}

async function loadEpisodes(showId) {
  const rootElem = document.getElementById("root");

  try {
    const controls = document.getElementById("controls");
    rootElem.innerHTML = "";
    controls.innerHTML = "";

    let episodes;
    if (cachedEpisodes[showId]) {
      episodes = cachedEpisodes[showId];
    } else {
      const res = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
      if (!res.ok) throw new Error("Network error");
      episodes = await res.json();
      cachedEpisodes[showId] = episodes;
    }

    currentEpisodes = episodes;
    makePageForEpisodes(episodes);
    setupEpisodeControls(episodes);
  } catch (err) {
    rootElem.innerHTML = `<p class="error-message">Oops! Something went wrong loading episodes.</p>`;
    console.error(err);
  }
}

function updateShowCount(count) {
  const countDisplay = document.getElementById("show-count");
  if (countDisplay) {
    countDisplay.textContent = `Found ${count}/${cachedShows.length} shows`;
  }
}

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function populateShowDropdown(shows, query = "") {
  const showSelect = document.getElementById("showSelect");
  showSelect.innerHTML =
    `<option value="" disabled selected>Select a show...</option>` +
    shows.map(show => {
      const highlightedName = highlightText(show.name, query);
      return `<option value="${show.id}">${highlightedName}</option>`;
    }).join("");
}

function showShowsListing() {
  const rootElem = document.getElementById("root");
  const controls = document.getElementById("controls");
  rootElem.innerHTML = "";
  controls.innerHTML = "";

  const searchInput = document.createElement("input");
  searchInput.id = "show-search";
  searchInput.placeholder = "Filtering for...";
  controls.appendChild(searchInput);

  const showSelect = document.createElement("select");
  showSelect.id = "showSelect";
  showSelect.style.display = "none";
  controls.appendChild(showSelect);

  const countDisplay = document.createElement("p");
  countDisplay.id = "show-count";
  controls.appendChild(countDisplay);

  renderShowCards(cachedShows);
  updateShowCount(cachedShows.length);

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filteredShows = cachedShows.filter(show =>
      show.name.toLowerCase().includes(query) ||
      show.genres.join(" ").toLowerCase().includes(query) ||
      (show.summary?.toLowerCase() || "").includes(query)
    );

    updateShowCount(filteredShows.length);
    renderShowCards(filteredShows, query);

    if (query) {
      showSelect.style.display = "inline-block";
      populateShowDropdown(filteredShows, query);
      // 🔥 Removed buggy auto-selection line
      // showSelect.selectedIndex = 1;
    } else {
      showSelect.style.display = "none";
    }
  });

  showSelect.addEventListener("change", () => {
    if (showSelect.value) {
      loadEpisodes(showSelect.value);
    }
  });
}

function renderShowCards(shows, query = "") {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const fragment = document.createDocumentFragment();

  shows.forEach(show => {
    const card = document.createElement("section");
    card.classList.add("show-card");

    card.innerHTML = `
      <div class="show-title" data-id="${show.id}">
        ${highlightText(show.name, query)}
      </div>
      <div class="show-content">
        <div class="show-image">
          <img src="${show.image?.medium || "https://via.placeholder.com/120x160?text=No+Image"}" alt="${show.name}">
        </div>
        <div class="show-details">
          ${highlightText(show.summary || "No summary available.", query)}
        </div>
        <div class="show-meta">
          <p><strong>Rated:</strong> ${show.rating?.average || "N/A"}</p>
          <p><strong>Genres:</strong> ${highlightText(show.genres.join(" | "), query)}</p>
          <p><strong>Status:</strong> ${show.status}</p>
          <p><strong>Runtime:</strong> ${show.runtime || "N/A"} mins</p>
        </div>
      </div>
    `;

    card.querySelector(".show-title").addEventListener("click", e =>
      loadEpisodes(e.target.dataset.id)
    );

    fragment.appendChild(card);
  });

  rootElem.appendChild(fragment);
}

async function setup() {
  const rootElem = document.getElementById("root");
  try {
    if (cachedShows.length === 0) {
      const res = await fetch("https://api.tvmaze.com/shows");
      if (!res.ok) throw new Error("Network error");
      cachedShows = await res.json();
      cachedShows.sort((a, b) => a.name.localeCompare(b.name));
    }
    showShowsListing();
  } catch (err) {
    rootElem.innerHTML = `<p class="error-message">Oops! Something went wrong loading shows.</p>`;
    console.error(err);
  }
}

window.onload = setup;




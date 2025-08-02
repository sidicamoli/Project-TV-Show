// ...existing code...
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
// ...existing code...

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear previous content

  // Only show 6 episodes
  const sixEpisodes = episodeList.slice(0, 6);

  sixEpisodes.forEach((episode) => {
    const episodeContainer = document.createElement("div");
    episodeContainer.classList.add("episode-card");

  // ...existing code...
// Title with zero-padded episode code
const title = document.createElement("h2");
const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
title.textContent = `${episode.name} - ${episodeCode}`;
// ...existing code...

    // Image
    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = episode.name;

    // Summary (HTML)
    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;

    // Link to TVMaze
    const link = document.createElement("a");
    link.href = episode.url;
    link.textContent = "View on TVMaze";
    link.target = "_blank";

    // Append all to episode container
    episodeContainer.appendChild(title);
    episodeContainer.appendChild(image);
    episodeContainer.appendChild(summary);
    episodeContainer.appendChild(link);

    rootElem.appendChild(episodeContainer);
  });

  // Add TVMaze credit
  const credit = document.createElement("p");
  credit.innerHTML =
    'Data from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(credit);
}

window.onload = setup; 
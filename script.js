function setup() {
  const allEpisodes = getAllEpisodes(); // This gives you all 73 episodes
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  for (let episode of episodeList) {
    const card = document.createElement("div");
    card.className = "episode-card";

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

    rootElem.appendChild(card);
  }

  const credit = document.createElement("p");
  credit.innerHTML =
    'Data from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>';
  rootElem.appendChild(credit);
}

window.onload = setup;
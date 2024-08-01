document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  const genreSelector = document.getElementById('genre-selector');
  const viewCountTypeSelector = document.getElementById('view-count-type-selector');
  
  let currentGenre = genreSelector.value || 'pop';
  let viewCountType = viewCountTypeSelector.value || 'total-view-count';
  let currentColumn = 'rank';
  let currentOrder = 'asc'; 
  
  updateGenreData(currentGenre, viewCountType, true);

  genreSelector.addEventListener('change', function () {
    currentGenre = genreSelector.value;
    updateGenreData(currentGenre, viewCountType, true);
  });


  viewCountTypeSelector.addEventListener('change', function () {
    viewCountType = viewCountTypeSelector.value;
    sortTable(currentColumn, currentOrder, viewCountType);
  });

  document.querySelectorAll('.sort-button').forEach(button => {
    button.addEventListener('click', function () {
      const column = button.getAttribute('data-column');
      const order = button.getAttribute('data-order');
      const newOrder = order === 'desc' ? 'asc' : 'desc';
      button.setAttribute('data-order', newOrder);
      currentColumn = column; 
      currentOrder = newOrder;
      sortTable(currentColumn, currentOrder, viewCountType);
    });
  });
}

const useProdBackend = true;

function getApiBaseUrl() {
  if (useProdBackend) {
    return 'https://tunemeld.com';
  }
  
  return window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
    ? 'http://127.0.0.1:8787'
    : 'https://tunemeld.com';
}

const API_BASE_URL = getApiBaseUrl();

async function updateGenreData(genre, viewCountType, updateAll = false) {
  try {
    showSkeletonLoaders();
    if (updateAll) {
      await fetchAndDisplayLastUpdated(genre);
      await fetchAndDisplayHeaderArt(genre);
      await fetchAndDisplayPlaylists(genre);
    }
    await updateMainPlaylist(genre, viewCountType);
    sortTable('rank', 'asc', 'total-view-count');
    hideSkeletonLoaders();
    resetCollapseStates();
    addToggleEventListeners();
  } catch (error) {
    console.error('Error updating genre data:', error);
  }
}

async function updateMainPlaylist(genre, viewCountType) {
  try {
    const url = `${API_BASE_URL}/api/main-playlist?genre=${genre}`;
    await fetchAndDisplayData(url, 'main-playlist-data-placeholder', true, viewCountType);
  } catch (error) {
    console.error('Error updating main playlist:', error);
  }
}

async function fetchAndDisplayLastUpdated(genre) {
  const url = `${API_BASE_URL}/api/last-updated?genre=${genre}`;
  await fetchAndDisplayData(url, 'last-updated');
}

async function fetchAndDisplayHeaderArt(genre) {
  const url = `${API_BASE_URL}/api/header-art?genre=${genre}`;
  await fetchAndDisplayData(url, 'header-art');
}

async function fetchAndDisplayPlaylists(genre) {
  const services = ['AppleMusic', 'SoundCloud', 'Spotify'];
  for (const service of services) {
    await fetchAndDisplayData(`${API_BASE_URL}/api/service-playlist?genre=${genre}&service=${service}`, `${service.toLowerCase()}-data-placeholder`);
  }
}

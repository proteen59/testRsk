let tasks = [];

fetch("http://localhost:3000/tasks")
  .then((res) => res.json())
  .then((data) => {
    tasks = data.map((item) => item);
    let tasksContainerHtml = "";
    tasks.forEach((c) => {
      let studentsHTML = "";
      c.students.forEach((s) => {
        let tasksHTML = "";
        s.tasks.forEach((t) => {
          tasksHTML += `<p>${t}</p>`;
        });
        studentsHTML += `<p><strong>${s.name}</strong></p>
    <div class="tasks">
    ${tasksHTML}
    </div>
    
    `;
      });
      // c for class
      tasksContainerHtml += `<div class='class'>
  <h3 class="class-title">Class ${c.className}</h3>
  <hr style="margin: 8px 0">
  <div class="student">${studentsHTML}</div>
  </div>`;
    });
    document.querySelector(".tasks-container").innerHTML = tasksContainerHtml;
  })
  .catch((err) => console.error(err));

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM fully loaded. Initializing YouTube API...");

  if (window.YT && typeof YT.Player === "function") {
    await fetchLatestVideos(); // Fetch and update video IDs
    initializeYouTubePlayers(); // Initialize players after setting video IDs
    console.log("loaded");
  } else {
    console.error("YouTube API is not loaded yet.");
  }
});

// Global Variables
let players = [];
const playlistIds = {
  "megaphone-video": "PLfk05yfiSxmJmPGazkiYmKZQKi0_lwtK-",
};
const apiKey = "AIzaSyA4lMpTZYgr_YOcCyENIkONcZiFkEpbaAY";

// Fetch latest videos and update the video elements
async function fetchLatestVideos() {
  try {
    await Promise.all(
      Object.entries(playlistIds).map(async ([elementId, playlistId]) => {
        const videoId = await getLatestVideoId(playlistId);
        if (videoId) {
          document
            .getElementById(elementId)
            .setAttribute("data-video-id", videoId);
        }
      })
    );
  } catch (error) {
    console.error("Error fetching latest videos:", error);
  }
}

// Fetch the latest video ID from a playlist
async function getLatestVideoId(playlistId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${playlistId}&key=${apiKey}`
    );
    const data = await response.json();
    return data.items?.[0]?.snippet?.resourceId?.videoId || null;
  } catch (error) {
    console.error("Error fetching latest video:", error);
    return null;
  }
}

// YouTube API Ready Function
function onYouTubeIframeAPIReady() {
  fetchLatestVideos().then(() => initializeYouTubePlayers());
}

// Initialize YouTube Players
function initializeYouTubePlayers() {
  players = []; // Reset players array
  document.querySelectorAll(".video").forEach((videoElement) => {
    const videoId = videoElement.getAttribute("data-video-id");
    if (videoId) {
      const player = new YT.Player(videoElement, {
        videoId: videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 1,
          showinfo: 0,
        },
        events: {
          onStateChange: handleVideoStateChange,
        },
      });
      players.push(player);
    }
  });
}

// Handle video state changes (ensure only one video plays)
function handleVideoStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    players.forEach((player) => {
      if (player !== event.target) {
        player.pauseVideo();
      }
    });
    currentPlayer = event.target;
  } else if (event.data === YT.PlayerState.ENDED) {
    event.target.seekTo(0);
    event.target.pauseVideo();
  }
}

// Sharing Function
function handleShare() {
  const pageUrl = "https://bit.ly/rasakhowa";
  if (isMobileDevice()) {
    window.open(`https://wa.me/?text=${encodeURIComponent(pageUrl)}`, "_blank");
  } else {
    copyToClipboard(pageUrl);
  }
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast("Link Copied!"));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.opacity = "1";
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 500);
  }, 900);
}

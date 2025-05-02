let tasks = [];

fetch("/api/tasks")
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
                        <div class="tasks">${tasksHTML}</div>`;
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

const playlistId = "PLfk05yfiSxmJmPGazkiYmKZQKi0_lwtK-";
const apiKey = "AIzaSyA4lMpTZYgr_YOcCyENIkONcZiFkEpbaAY";

fetchLatestVideos(playlistId);
// Fetch latest videos and update the video elements
async function fetchLatestVideos(playlistId) {
  try {
    await new Promise(async () => {
      const videoId = await getLatestVideoId(playlistId);
      let title = await fetchTitle(videoId);
      if (videoId) {
        document.getElementById("megaphone").innerHTML = `<p>${title}</p>
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
              <button>Watch Video</button>
            </a>`;
      }
    });
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

async function fetchTitle(videoId) {
  let title = "";
  await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      title = data.items[0].snippet.title;
    });
  return title;
}

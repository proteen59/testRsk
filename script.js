let tasks = [];
let savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
const loadingElement = document.getElementById("loading");

fetch("/api/tasks")
  .then((res) => res.json())
  .then((data) => {
    localStorage.setItem("savedTasks", JSON.stringify(data));
    tasks = data;
    loadingElement.remove();
    rendering(tasks);
  })
  .catch((err) => console.error(err));

rendering(savedTasks);

function rendering(tsk) {
  let tasksContainerHtml = "";
  if (!tsk) {
    document.querySelector(".tasks-container").innerHTML =
      "<div class='class' style='text-align:center'>Loading Tasks</div>";
    return;
  }
  tsk.forEach((c) => {
    let studentsHTML = "";
    c.students.forEach((s) => {
      let tasksHTML = "";
      s.tasks.forEach((t) => {
        if (t.includes("<a")) {
          tasksHTML += `<div style='margin:5px 5px 5px 0; display:inline-block'>${t}</div>`;
          return;
        }
        tasksHTML += `<p>${t}</p>`;
      });
      studentsHTML += `<p>${s.name}</p>
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
}

const playlistId = "PLfk05yfiSxmJmPGazkiYmKZQKi0_lwtK-";
const apiKey = "AIzaSyA4lMpTZYgr_YOcCyENIkONcZiFkEpbaAY";

fetchLatestVideos(playlistId);
// Fetch latest videos and update the video elements
async function fetchLatestVideos(playlistId) {
  try {
    await new Promise(async () => {
      const videoId = await getLatestVideoId(playlistId);
      const title = await fetchTitle(videoId);
      if (videoId) {
        document.getElementById("megaphone").innerHTML = `<p>${title}</p>
                                                          <div class="buttons">
                                                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
                                                              <button>Watch Video</button>
                                                            </a>
                                                            <a href="https://www.youtube.com/playlist?list=${playlistId}">
                                                            <button>All Videos</button>
                                                            </a>
                                                          </div>
            
            `;
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

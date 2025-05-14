const playlistId = "PLfk05yfiSxmJmPGazkiYmKZQKi0_lwtK-";
const apiKey = "AIzaSyA4lMpTZYgr_YOcCyENIkONcZiFkEpbaAY";
let savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
const loadingElement = document.getElementById("loading");

const savedTitle = localStorage.getItem("localTitle");
const savedVideoId = localStorage.getItem("localVideoId");

videoRendering(savedTitle, savedVideoId);
rendering(savedTasks);
if (!savedTitle) {
  document.getElementById("megaphone").innerHTML = "Loading Video";
}

if (!savedTasks) {
  loadingElement.remove();
}

fetch("/api/tasks")
  .then((res) => res.json())
  .then((data) => {
    if (JSON.stringify(data) === localStorage.getItem("savedTasks")) {
      loadingElement.innerHTML = "পাল্টানো হয়নি।";
      loadingElement.style.backgroundColor = "#ffb2b2";
    } else {
      loadingElement.innerHTML = "পাল্টানো হয়েছে...";
      loadingElement.style.backgroundColor = "#8aee97";
    }
    setTimeout(() => {
      loadingElement.remove();
    }, 4000);
    localStorage.setItem("savedTasks", JSON.stringify(data));
    rendering(data);
  })
  .catch((err) => console.error(err));

function rendering(tasks) {
  let tasksContainerHtml = "";
  if (!tasks) {
    document.querySelector(".tasks-container").innerHTML =
      "<div class='class' style='text-align:center'>Loading Tasks</div>";
    return;
  }
  tasks.forEach((c) => {
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

function videoRendering(title, videoId) {
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

fetchLatestVideos(playlistId);
// Fetch latest videos and update the video elements
async function fetchLatestVideos(playlistId) {
  try {
    await new Promise(async () => {
      const videoId = await getLatestVideoId(playlistId);
      const title = await fetchTitle(videoId);

      if (title !== localStorage.getItem("localTitle")) {
        document.getElementById("megaphone").style.backgroundColor = "#8aee97";
        document.getElementById("megaphone").style.border =
          "1px solid rgba(0,0,0,0.5)";
      }
      localStorage.setItem("localTitle", title);
      localStorage.setItem("localVideoId", videoId);
      videoRendering(title, videoId);
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

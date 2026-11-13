
async function saveVideo() {

    let inputfield = document.getElementById("yt-url");
    let input = inputfield.value.trim();

    if (input === "") {
        alert("BASALRIGHT PASTE A URL BUDDDDDY");
        return;
    }

    let videoId = "";

   
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {

        videoId = input;

    } else {

       
        try {
            

            let url = new URL(input);

            if (url.hostname === "youtu.be") {

                videoId = url.pathname.substring(1).split("/")[0];

            } else if (
                url.hostname === "youtube.com" ||
                url.hostname === "www.youtube.com" ||
                url.hostname === "music.youtube.com" ||
                url.hostname === "m.youtube.com" 
            ) {

                videoId = url.searchParams.get("v") || "";

                if (!videoId && url.pathname.startsWith("/embed/")) {
                    videoId = url.pathname.split("/")[2];
                }

                if (!videoId && url.pathname.startsWith("/shorts/")) {
                    videoId = url.pathname.split("/")[2];
                }

            }

        } catch (error) {

            alert("That URL isn't valid!");
            return;

        }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        alert("Couldn't find a valid YouTube video ID!");
        return;
    }

    try {       
        let originalURL = `https://www.youtube.com/watch?v=${videoId}`;

        let response = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(originalURL)}&format=json`
        );

        if (!response.ok) {
            throw new Error("I couldn't retrive the video title... are you sure this the correct one?");
        }

        let data = await response.json();
        

     
        savesongs(data.title, videoId);

        inputfield.value = "";

    } catch (error) {

        alert("Couldn't retrieve the video title!");
        

    }
}

function displaysongs(song){
    let songcontainer = document.getElementById("video-container")
    songcontainer.innerHTML ="";

    song.forEach((song,index) => {
        let songElement = document.createElement("div")
        songElement.className = "song";

        let title = document.createElement("span");
        title.textContent = song.title

        let playbutton = document.createElement("button");
        playbutton.textContent = "play";
        playbutton.onclick = () => playsong(index);

        let deletebutton = document.createElement("button");
        deletebutton.textContent = "delete";
        deletebutton.onclick = () => deletesong(index);

        songElement.append(title, playbutton, deletebutton);
        songcontainer.appendChild(songElement);


    });

}


let ytPlayer = null;
let currentVolume = 50;

let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);


function playsong(index) {
    let song = songs[index];

    document.getElementById("now-title").textContent = song.title;
    document.getElementById("thumbnail").src =
        `https://img.youtube.com/vi/${song.url}/hqdefault.jpg`;

    if (ytPlayer) {
        ytPlayer.loadVideoById(song.url);   // reuse the player
        return;
    }

    ytPlayer = new YT.Player("yt-player", {
        height: "250",
        width: "50%",
        videoId: song.url,
        playerVars: { autoplay: 1 },
        events: {
            onReady: (e) => e.target.setVolume(currentVolume)
        }
    });
}

function deletesong(index) {
    songs.splice(index, 1);
    window.pywebview.api.save_songs(songs);
    displaysongs(songs);

    if (ytPlayer) ytPlayer.stopVideo();
    document.getElementById("now-title").textContent = "";
    document.getElementById("thumbnail").removeAttribute("src");
};

let songs = [];

window.addEventListener("pywebviewready", async () => {
    songs = await window.pywebview.api.load_songs();
    displaysongs(songs);
});


function savesongs(title, url){
    songs.push({ title: title, url: url })
    window.pywebview.api.save_songs(songs);
    displaysongs(songs)


}

document.getElementById("volumeslide").addEventListener("input", (e) => {
    currentVolume = Number(e.currentTarget.value);
    if (ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(currentVolume);
});
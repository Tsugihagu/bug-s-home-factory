
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
        console.log("Trying to retrieve YouTube title...");

       
        let originalURL = `https://www.youtube.com/watch?v=${videoId}`;

        let response = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(originalURL)}&format=json`
        );

        if (!response.ok) {
            throw new Error("I couldn't retrive the video title... are you sure this the correct one?");
        }

        let data = await response.json();
        console.log("YouTube response:", data);

     
        savesongs(data.title, videoId);

        inputfield.value = "";

    } catch (error) {

        alert("Couldn't retrieve the video title!");
        console.error(error);

    }
}

function displaysongs(song){
    let songcontainer = document.getElementById("video-container")
    songcontainer.innerHTML ="";

    song.forEach((song,index) => {
        let songElement = document.createElement("div")

        songElement.className = "song";

        songElement.innerHTML = `
            <span>${song.title}</span>

            <button onclick="playSong(${index})">
                Play
            </button>

            <button onclick="deleteSong(${index})">
                Delete
            </button>
        `;   

        songcontainer.appendChild(songElement);

    });

}

let songs = [];

function savesongs(title, url){

    songs.push({
        title: title,
        url: url
    });
    displaysongs(songs);
}



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

function playsong(index){
    let song = songs[index];
    let player = document.getElementById("playsong");

    player.innerHTML =  `
        <img src="https://img.youtube.com/vi/${song.url}/hqdefault.jpg" width="320">
        <p id="now-title"></p>
        <iframe width="320" height="180"
            src="https://www.youtube.com/embed/${song.url}?autoplay=1"
            allow="autoplay; encrypted-media"></iframe>
    `;
    document.getElementById("now-title").textContent = song.title;
}

function deletesong(index){
    songs.splice(index, 1);
    window.pywebview.api.save_songs(songs);
    displaysongs(songs);
    document.getElementById("playsong").innerHTML = "";
}

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


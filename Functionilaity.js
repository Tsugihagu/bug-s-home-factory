
function playvideo(){
    let inputfield = document.getElementById("yt-url")

    let videomusic = inputfield.value.trim();

    if (videomusic === "") {
        alert("PLS PASTE IN SOMETHING THAT WORKS!!");
        return; 
    
    } else {
        alert("Fetching " + videomusic + " pls wait")
    }



let videoId = "";

if (videomusic.includes("v=")) {
    videoId = videomusic.split("v=")[1].split("&")[0];
} else if (videomusic.includes("youtu.be/")){
    videoId = videomusic.split("youtu.be/")[1].split("&")[0];

}

if (videoId != ""){
    let container = document.getElementById("video-container")
    
    container.innerHTML = `<iframe 
    height="100"
    width="50%"
    src="https://youtube.com/embed/${videoId}"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
    </iframe>`;
    
}
 else{
    alert("URL not supported")
}

}
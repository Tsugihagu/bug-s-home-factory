
function playvideo(){
    let inputfield = document.getElementById("yt-url")

    let videomusic = inputfield.value;

    if (inputfield == "") {
        alert("PLS PASTE IN SOMETHING THAT WORKS!!");
    
    } else {
        alert("Fetching ", videomusic, " pls wait")
    }

}
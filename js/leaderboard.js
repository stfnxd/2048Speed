function saveTime(time) {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push(time);
    scores.sort((a, b) => a - b);
    scores = scores.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(scores));
    displayLeaderboard();
}

function displayLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    document.getElementById("leaderboard").innerHTML = scores.map(time => `<li>${time}s</li>`).join("");
}

displayLeaderboard();

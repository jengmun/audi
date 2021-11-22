"use strict";

const scoreboard = {
  perfect: 0,
  great: 0,
  cool: 0,
  bad: 0,
  miss: 0,
};

const keyCodes = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
};

const uniCode = {
  37: "&#8592",
  38: "&#8593",
  39: "&#8594",
  40: "&#8595",
};

const scoring = {
  1: 1000,
  2: 1500,
  3: 2000,
  4: 2500,
  5: 3000,
  6: 5000,
  7: 6000,
  8: 7000,
  9: 8000,
};

const multiplier = {
  miss: 0,
  bad: 0.5,
  cool: 1,
  great: 1.5,
  perfect: 2,
  //   chain: 2 ** num,
};

const rhythmBarWidth = document.querySelector(".rhythm-bar").clientWidth;
const targetWidth = document.querySelector(".target").offsetWidth;

let bpm = 120;
const playTime = (4 / bpm) * 60 * 1000; // time taken for every 4 beats
const roundTime = playTime * 2; // time taken for each round from level 6 onwards
let level = 1;
let score = 0;
let currentKeys = [];
let grade = "";
let chainMultiple = 0;
let pressTime = 0;
let currentRound = 0;
let duration = 10 * 1000; // in ms
let startpos = 0;
let currentPosition = 0;

const target = document.querySelector(".target");

function getPosition() {
  currentPosition = target.getBoundingClientRect().left + targetWidth / 2;
  // console.log(currentPosition);
  window.requestAnimationFrame(getPosition);
}

let missPoint = startpos + rhythmBarWidth * 0.9;

function grading() {
  console.log("in grading");

  const perfectBeat = startpos + rhythmBarWidth * 0.75;
  // console.log(perfectBeat);
  // console.log(pressTime);
  // console.log(startpos);
  // console.log(rhythmBarWidth * 0.75);
  const deviation = Math.abs(pressTime - perfectBeat);
  console.log(`deviation = ${deviation}`);

  if (deviation < rhythmBarWidth * 0.005) {
    grade = "perfect";
  } else if (deviation < rhythmBarWidth * 0.05) {
    grade = "great";
  } else if (deviation < rhythmBarWidth * 0.1) {
    grade = "cool";
  } else if (deviation < rhythmBarWidth * 0.2) {
    grade = "bad";
  } else {
    grade = "miss";
  }

  if (!document.querySelector(".key")) {
    console.log(document.querySelector(".key"));
    console.log("all keys pressed");
    scoreboard[grade] += 1;
  } else {
    console.log("keys not pressed");
    console.log(document.querySelector(".key"));
    grade = "miss";
  }

  const gradeDOM = document.querySelector(".grade");
  gradeDOM.innerText = grade;
  gradeDOM.style.animation = `fadeoutgrade ${playTime / 2000}s 1 forwards`;
  setTimeout(function () {
    gradeDOM.style.animation = "";
    gradeDOM.style.opacity = "0";
  }, playTime / 2 + 1);

  score += multiplier[grade] * scoring[Math.floor(level)];

  document.querySelector(".score").innerText = score;

  // setTimeout((document.querySelector(".grade").innerText = ""), playTime / 4);
}

function nextLevel() {
  console.log("next level");

  if (level < 6) {
    level++;
    console.log(level);
  } else if (level < 9.75) {
    level += 0.25;
    console.log(level);
  } else if (level === 9.75) {
    level = 6;
  }
  document.querySelector(".level-number").innerText = Math.floor(level);
  randomiseKeys(Math.floor(level));
}

function randomiseKeys(level) {
  document.querySelector(".arrow-keys").innerHTML = "";
  currentRound++;
  for (let i = 1; i <= level; i++) {
    const keyCode = Math.floor(Math.random() * 4) + 37;

    const newArrowKey = document.createElement("div");
    newArrowKey.setAttribute("id", keyCode);
    newArrowKey.className = "key";
    newArrowKey.classList.add(`${currentRound}`);
    newArrowKey.innerHTML = uniCode[keyCode];

    function displayKeys() {
      document.querySelector(".arrow-keys").append(newArrowKey);
      currentKeys.push(newArrowKey);
      console.log("push keys");
    }

    displayKeys();

    window.addEventListener("keydown", spacebar);
  }
}

// if no spacebar pressed, clear arrow keys, "auto miss"

function defaultMiss() {
  if (document.querySelector(".key")) {
    console.log("in default miss");
    pressTime = currentPosition; // 0.1x after playTime ends
    console.log(pressTime);
    grading();
  }
}

window.addEventListener("keydown", (e) => {
  if (uniCode[e.keyCode]) {
    let currentKey = document.querySelector(".key");

    if (e.keyCode == currentKey.id) {
      currentKey.className = "pressed-key";
    } else {
      currentKeys = [];
      grading();
      document.querySelector(".arrow-keys").innerHTML = "";
      window.removeEventListener("keydown", spacebar);
    }
  }
});

// upon pressing of spacebar:

function spacebar(e) {
  if (e.keyCode === 32) {
    pressTime = currentPosition;
    grading();
    document.querySelector(".arrow-keys").innerHTML = "";
    window.removeEventListener("keydown", spacebar);
  }
}

window.addEventListener("keydown", spacebar);

let startTime = 0;
const endTime = startTime + duration;
let remainingTime = endTime - startTime;

function startGame(e) {
  startTime = Date.now();
  const timerID = setInterval(timer, 1000);
  randomiseKeys(1);
  target.classList.add("target-move");
  startpos = target.getBoundingClientRect().left;
  window.requestAnimationFrame(getPosition);

  const missID = setInterval(defaultMiss, playTime);
  const levelID = setInterval(nextLevel, playTime);
  setTimeout(missID, playTime * 0.9);
  setTimeout(levelID, playTime * 0.9);

  document.querySelector(".timer").innerText = duration / 1000;

  e.target.remove();

  function timer() {
    remainingTime = Math.max(0, remainingTime - 1000);
    document.querySelector(".timer").innerText = remainingTime / 1000;
    if (remainingTime === 0) {
      songEnd();
    }
  }

  function songEnd() {
    clearInterval(missID);
    clearInterval(levelID);
    clearInterval(timerID);
    document.querySelector(".game-container").style.animation = "fadeout 1s 1";
    document.querySelector(".game-container").style.opacity = 0;

    displayScoreboard();
  }
}

document.querySelector("button").addEventListener("click", (e) => playAudio(e));

function displayScoreboard() {
  // insert table structure

  document.querySelector(".timer").insertAdjacentHTML(
    "afterend",
    `<div id="scoreboard-div">
  <table class="scoreboard">
    <tr id="header-row">
      <th>Score</th>
      <th>Perfect</th>
      <th>Great</th>
      <th>Cool</th>
      <th>Bad</th>
      <th>Miss</th>
    </tr>
  </table>
</div>`
  );

  // insert variables

  const row = document.createElement("tr");
  row.id = "data-row";
  const scoring = document.createElement("td");
  const data = document.createElement("div");
  data.id = "data-div";
  data.innerText = score;
  document.querySelector("table").append(row);
  scoring.append(data);
  row.append(scoring);

  for (const grade in scoreboard) {
    const grading = document.createElement("td");
    const data = document.createElement("div");
    data.id = "data-div";
    data.innerText = scoreboard[grade];
    row.append(grading);
    grading.append(data);
  }
  document.querySelector("#scoreboard-div").style.animation =
    "fadein 1.5s 1 forwards";
}

function playAudio() {
  const audio = document.querySelector("audio");
  console.log(audio.readyState);
  if (audio.readyState >= 2) {
    audio.play();
    setTimeout(startGame, 3200);
  }
}

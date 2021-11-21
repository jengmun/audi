"use strict";

const scoreboard = {
  miss: 0,
  bad: 0,
  cool: 0,
  great: 0,
  perfect: 0,
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

let bpm = 120;
const playTime = (4 / bpm) * 60 * 1000; // time taken for every 4 beats
const roundTime = playTime * 2; // time taken for each round from level 6 onwards
let level = 1;
let score = 0;
let currentKeys = [];
let grade = "";
let startTimeRound;
let startTimeGrading = 0;
let perfectTime = startTimeGrading + playTime;
let pressTime = 0;
let numOfMoves = 0;

// score = multiplier.grade * scoring.level;

function grading() {
  console.log("in grading");
  // if (level <= 6) {
  startTimeGrading += playTime;
  // }
  // } else {
  //   startTimeGrading = startTimeGrading + roundTime;
  // }
  console.log(`startTimeGrading = ${startTimeGrading}`);
  console.log(playTime);
  perfectTime = startTimeGrading + playTime;
  console.log(`perfectTime = ${perfectTime}`);

  const deviation = Math.abs(pressTime - perfectTime);
  console.log(`pressTime = ${pressTime}`);
  console.log(`deviation = ${deviation}`);

  if (deviation < playTime * 0.02) {
    grade = "perfect";
  } else if (deviation < playTime * 0.05) {
    grade = "great";
  } else if (deviation < playTime * 0.08) {
    grade = "cool";
  } else if (deviation < playTime * 0.8) {
    grade = "bad";
  } else {
    grade = "miss";
  }

  if (!document.querySelector(".key")) {
    console.log("all keys pressed");
    scoreboard[grade] += 1;
  } else {
    console.log("keys not pressed");
    grade = "miss";
  }
  document.querySelector(".grade").innerText = grade;

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
  for (let i = 1; i <= level; i++) {
    const keyCode = Math.floor(Math.random() * 4) + 37;

    const newArrowKey = document.createElement("div");
    newArrowKey.setAttribute("id", keyCode);
    newArrowKey.className = "key";
    newArrowKey.innerHTML = uniCode[keyCode];

    numOfMoves++;

    function displayKeys() {
      document.querySelector(".arrow-keys").append(newArrowKey);
      currentKeys.push(newArrowKey);
      console.log("push keys");
    }

    displayKeys();

    // if (level >= 6.25) {
    //   console.log("level >6.25");
    //   setTimeout(displayKeys, playTime);
    // } else {
    //   console.log("display");
    //   console.log(level);
    //   displayKeys();
    // }
  }
}

// if no spacebar pressed, clear arrow keys, "auto miss"

function defaultMiss() {
  if (document.querySelector(".key")) {
    console.log("in default miss");
    pressTime = Date.now(); // 0.1x after playTime ends
    grading();
    // nextLevel();
  }
}

function defaultMissLoop() {
  // if (level <= 6) {
  console.log("in default miss loop lvl 6");
  defaultMiss();
  setTimeout(defaultMissLoop, playTime);
  // } else if (level > 6) {
  //   console.log("in default miss loop lvl 7");
  //   defaultMiss();
  //   setTimeout(defaultMissLoop, playTime);
  // }
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
    }
  }
});

// upon pressing of spacebar:
window.addEventListener("keydown", (e) => {
  pressTime = Date.now();

  if (e.keyCode === 32) {
    grading();
    document.querySelector(".arrow-keys").innerHTML = "";
  }
});

// let last = 0;

const frameDuration = 1000 / 60; // duration per frame, assuming 60fps
const getTime = typeof performance === "function" ? performance.now : Date.now;

let distanceX = 0;

let lastUpdate = getTime();

function speedPerRound() {
  const now = getTime();
  const delta = (now - lastUpdate) / frameDuration;

  lastUpdate = now;

  const numOfFrames = (4 / bpm) * 60 * 60; // number of frames for this bpm, assuming 60 fps
  console.log(numOfFrames);

  distanceX += (185 / numOfFrames) * delta;

  if (distanceX >= 185) {
    distanceX = 0;
  }

  document.querySelector(
    ".target"
  ).style.transform = `translateX(${distanceX}px)`;

  requestAnimationFrame(speedPerRound);
}

// console.log(document.querySelector(".rhythm-bar").style.width);
let startTime = 0;
const endTime = startTime + 30000; // song duraction
let remainingTime = endTime - startTime;

async function startGame(e) {
  randomiseKeys(1);
  // setInterval(speedPerRound, playTime / 185);
  // setTimeout(defaultMissLoop, playTime * 1.5);
  // setTimeout(setInterval(nextLevel, playTime * 1.5), playTime * 1.1);
  setInterval(timer, 1000);
  console.log("promise ended");

  lastUpdate = getTime();
  requestAnimationFrame(speedPerRound);

  startTimeGrading = Date.now();
  startTimeRound = Date.now();
  startTime = Date.now();
  document.querySelector(".timer").innerText = 30;
  perfectTime = startTimeGrading + playTime;
  //   console.log(startDate);
  console.log(e.target);
  e.target.remove();
}

document.querySelector("button").addEventListener("click", (e) => startGame(e));

function timer() {
  remainingTime = Math.max(0, remainingTime - 1000);
  document.querySelector(".timer").innerText = remainingTime / 1000;
}

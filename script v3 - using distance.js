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
let duration = 30 * 1000; // in ms

function grading() {
  console.log("in grading");

  const perfectBeat = 351.8214416503906 + (185 / 4) * 3;

  const deviation = Math.abs(pressTime - perfectBeat);
  console.log(`deviation = ${deviation}`);

  if (deviation < rhythmBarWidth * 0.005) {
    grade = "perfect";
  } else if (deviation < rhythmBarWidth * 0.05) {
    grade = "great";
  } else if (deviation < rhythmBarWidth * 0.08) {
    grade = "cool";
  } else if (deviation < rhythmBarWidth * 0.1) {
    grade = "bad";
  } else {
    grade = "miss";
  }

  if (!document.querySelector(".key")) {
    console.log("all keys pressed");
    scoreboard[grade] += 1;
  } else {
    console.log("keys not pressed");
    console.log(document.querySelector(".key"));
    grade = "miss";
  }
  document.querySelector(".grade").innerText = grade;
  score += multiplier[grade] * scoring[Math.floor(level)];
  console.log(grade);
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
    pressTime = position; // 0.1x after playTime ends
    console.log(pressTime);
    grading();
    return 0;
    // nextLevel();
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
    }
  }
});

// upon pressing of spacebar:
window.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    console.log(Date.now());
    pressTime = position;
    grading();
    document.querySelector(".arrow-keys").innerHTML = "";
  }
});

// const frameDuration = 1000 / 59.94; // duration per frame, assuming 60fps
// const numOfFrames = (4 / bpm) * 60 * 59.94; // number of frames for this bpm, assuming 60 fps
// const getTime = typeof performance === "function" ? performance.now : Date.now;
// let distanceX = 0;
// let lastUpdate = getTime();

// function speedPerRound() {
//   const now = getTime();
//   const delta = (now - lastUpdate) / frameDuration;

//   lastUpdate = now;

//   const distancePerFrame = (rhythmBarWidth - targetWidth) / numOfFrames;
//   const framesToNextLevel = rhythmBarWidth * 0.85;
//   const minNumOfFrames = Math.ceil(framesToNextLevel / distancePerFrame);

//   distanceX += distancePerFrame * delta;

//   if (distanceX >= 185) {
//     distanceX = 0;
//   }

//   document.querySelector(
//     ".target"
//   ).style.transform = `translateX(${distanceX}px)`;

//   const currentTime = Date.now();

//   if (currentTime > missTime) {
//     console.log(missTime);
//     console.log(currentTime);
//     missTime += playTime;
//     if (document.querySelector(".key")) {
//       defaultMiss();
//     }
//     nextLevel();
//     console.log("next level");
//     console.log(performance.now());
//   }

//   requestAnimationFrame(speedPerRound);
// }

// console.log(document.querySelector(".rhythm-bar").style.width);
let startTime = 0;
const endTime = startTime + duration; // song duraction
let remainingTime = endTime - startTime;

let missTime = 0;

function startGame(e) {
  // console.log(rect);
  startTime = Date.now();
  missTime = startTime + playTime * 0.85;
  setInterval(timer, 1000);
  randomiseKeys(1);

  // setInterval(speedPerRound, playTime / 185);
  setInterval(defaultMiss, playTime);
  setInterval(nextLevel, playTime);
  // setTimeout(defaultMissLoop, playTime * 1.1);
  // setTimeout(setInterval(nextLevel, playTime * 1.5), playTime * 1.1);

  console.log("promise ended");

  // lastUpdate = getTime();
  // requestAnimationFrame(speedPerRound);
  // setInterval(determinePerfectTime, playTime);

  document.querySelector(".timer").innerText = 30;

  //   console.log(startDate);
  // console.log(e.target);
  e.target.remove();
}

document.querySelector("button").addEventListener("click", (e) => startGame(e));

function timer() {
  remainingTime = Math.max(0, remainingTime - 1000);
  document.querySelector(".timer").innerText = remainingTime / 1000;
}

// let myPromise = new Promise(function (defaultMiss) {
//   setInterval(function () {
//     defaultMiss();
//   }, playTime);
// });

// myPromise.then(function () {
//   setInterval(nextLevel, playTime);
// });

let moving = false;
const element = document.querySelector(".target");
element.classList.add("target-move");
element.addEventListener("transitionend", function () {
  moving = true;
});

let position = 0;

function getPosition() {
  position = element.getBoundingClientRect().left;
  // console.log(position);
  if (!moving) {
    window.requestAnimationFrame(getPosition);
  }
}
window.requestAnimationFrame(getPosition);
element.getBoundingClientRect().left;
console.log(element.getBoundingClientRect().right);
// 351.8214416503906
let missPoint = 351.8214416503906 + (185 / 4) * 3;

"use strict";

const scoreboard = {
  miss: 0,
  bad: 0,
  cool: 0,
  great: 0,
  perfect: 0,
};

// const accuracy = {
//   //   miss: ">1000",
//   bad: playTime * 0.1,
//   cool: playTime * 0.08,
//   great: playTime * 0.05,
//   perfect: playTime * 0.02,
// };

const keyCodes = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  spacebar: 32,
};

// const uniCode = {
//   "&#8592": 37,
//   "&#8593": 38,
//   "&#8594": 39,
//   "&#8595": 40,
// };

const uniCode = {
  // keyCode : Unicode
  37: "&#8592",
  38: "&#8593",
  39: "&#8594",
  40: "&#8595",
  //   32: "&#160;",
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

    // displayKeys();

    if (level >= 6.25) {
      console.log("level >6.25");
      setTimeout(displayKeys, playTime);
      //   setTimeout(currentDate, playTime);
    } else {
      console.log("display");
      console.log(level);
      displayKeys();
      //   currentDate();
    }
  }
}

// use pressDate - start date to calculate the accuracy of the timing of key pressed
// upon pressing of spacebar:
window.addEventListener("keydown", (e) => {
  pressTime = Date.now();

  if (e.keyCode === 32) {
    console.log("key");
    grading();
    // if (!document.querySelector(".key")) {
    //   if (grading() !== "miss") {
    //     // console.log("success!");
    //   }
    // } else {
    //   console.log("miss");
    //   console.log(Date.now());
    //   document.querySelector(".grade").innerText = "miss";
    //   console.log(pressDate - perfectTime);
    // }
    // console.log(document.querySelector(".key"));

    console.log(grade);
    grade = "";
    console.log(grade);
  }
});

// if no spacebar pressed, clear arrow keys, "auto miss"
function defaultMissLoop() {
  if (level <= 6) {
    setTimeout(defaultMiss, playTime);
    setTimeout(defaultMissLoop, playTime);
    console.log(`LEVEL 6`);
    console.log(level);
    // console.log(Date.now());
  } else if (level > 5) {
    console.log(`LEVEL7`);
    setTimeout(defaultMiss, roundTime);
    setTimeout(defaultMissLoop, roundTime);
  }
}

function defaultMiss() {
  pressTime = Date.now(); // 0.1x after playTime ends

  //   pressDate = currentDate;

  //   startDate = pressDate; // update startDate to startDate += playTime
  // document.querySelector(".grade").innerText = grading();
  grading();
  // nextLevel();

  console.log("remove");
  grade = "";
  console.log("miss");
}

// function increaseStartDate() {
//   startDate += 4000;
//   console.log(`start date = ${startDate}`);
//   perfectTime = startDate + 4000;
//   console.log(perfectTime);
// }

function nextLevel() {
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
  console.log("next level");
  randomiseKeys(Math.floor(level));
}

function grading() {
  //   const perfectDistance = 116;
  //   let deviation = Math.abs(perfectDistance - distanceX);

  if (level < 6) {
    startTimeGrading = startTimeGrading + playTime;
  } else {
    startTimeGrading = startTimeGrading + roundTime;
  }

  perfectTime = startTimeGrading + playTime;

  const deviation = Math.abs(pressTime - perfectTime);
  console.log(pressTime);
  console.log(perfectTime);
  console.log(deviation);
  if (deviation < playTime * 0.02) {
    grade = "perfect";
    // console.log("perfect");
  } else if (deviation < playTime * 0.05) {
    grade = "great";
    // console.log("great");
  } else if (deviation < playTime * 0.08) {
    grade = "cool";
    // console.log("cool");
  } else if (deviation < playTime * 0.1) {
    grade = "bad";
    // console.log("bad");
  } else {
    // alert("miss");
    grade = "miss";
  }
  console.log(grade);

  console.log(document.querySelector(".key"));
  if (!document.querySelector(".key")) {
    console.log("all keys pressed");
    scoreboard[grade] += 1;
  } else {
    console.log("here");
    grade = "miss";
  }
  document.querySelector(".grade").innerText = grade;
  document.querySelector(".arrow-keys").innerHTML = "";
  // nextLevel();

  return grade;
}

// function initialise() {
//   level = 1;
//   randomiseKeys(level);
// }

// let last = 0;
let distanceX = 0;
function speedPerRound() {
  // const now = performance.now();
  // const difference = now - last || 0;

  // last = now;
  // console.log(difference);

  // distanceX += 0.0905 / (1000 / difference);

  document.querySelector(
    ".target"
  ).style.transform = `translateX(${distanceX}px)`;

  if (distanceX === 185) {
    distanceX = 0;
  }

  // requestAnimationFrame(speedPerRound);

  distanceX++;
}

window.addEventListener("keydown", (e) => {
  //   for (let i = 0; i < currentKeys.length; i++) {
  //     currentKeys[i].addEventListener("keydown", function pressKey(e) {
  //       e.target.className = "pressed-keys";
  //       e.target.removeEventListener("keydown", pressKey);
  //       currentKeys[i + 1].addEventListener("keydown", (e) => {
  //         pressKey(e);
  //       });
  //     });
  //   }
  if (uniCode[e.keyCode]) {
    let currentKey = document.querySelector(".key");
    //   if (currentKey === null) {
    //     document.querySelector(".arrow-keys").innerHTML = "";
    //   }
    if (e.keyCode == currentKey.id) {
      console.log("proceed to next key");
      currentKey.className = "pressed-key";
    } else {
      console.log("current round failed");
      console.log(e.keyCode);
      console.log(currentKey.id);
      currentKeys = [];
      // document.querySelector(".arrow-keys").innerHTML = "";
    }
  }
});

// create eventlistener for each button -> remove event listener after pressing

// console.log(document.querySelector(".rhythm-bar").style.width);

// timestamp;

console.log(document.querySelector(".key"));
console.log(currentKeys);
// console.log(Date.now());

function startGame(e) {
  randomiseKeys(1);
  // speedPerRound();
  setInterval(speedPerRound, playTime / 185);
  console.log(playTime / 185);
  //   setInterval(currentDate, 2000);
  setTimeout(setInterval(nextLevel, playTime), playTime * 1.2);
  //   setInterval(randomiseKeys, 2000);
  //   setInterval(increaseStartDate, 2000);
  // setTimeout(defaultMissLoop(), playTime * 1.1);

  startTimeGrading = Date.now();
  startTimeRound = Date.now();
  perfectTime = startTimeGrading + playTime;
  //   console.log(startDate);
  console.log(e.target);
  e.target.remove();
}

document.querySelector("button").addEventListener("click", (e) => startGame(e));

// setInterval(currentDate, 2000);

// remove event listener for spacebar before notes appear

"use strict";

const scoreboard = {
  miss: 0,
  bad: 0,
  cool: 0,
  great: 0,
  perfect: 0,
};

const accuracy = {
  miss: ">15",
  bad: "<15",
  cool: "<10",
  great: "<6",
  perfect: "<2",
};

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
};

let score = 0;

// score = multiplier.grade * scoring.level;

let currentKeys = [];

function randomiseKeys(level) {
  for (let i = 1; i <= level; i++) {
    const keyCode = Math.floor(Math.random() * 4) + 37;

    const newArrowKey = document.createElement("button");
    newArrowKey.setAttribute("value", keyCode);
    newArrowKey.className = "key";
    newArrowKey.innerHTML = uniCode[keyCode];

    document.querySelector(".arrow-keys").append(newArrowKey);
    currentKeys.push(newArrowKey);
  }
}

let deviation = 20;

let grade = "";

function grading() {
  const perfectDistance = 116;
  let deviation = Math.abs(perfectDistance - distanceX);

  if (deviation < 2) {
    grade = "perfect";
    // console.log("perfect");
  } else if (deviation < 6) {
    grade = "great";
    // console.log("great");
  } else if (deviation < 10) {
    grade = "cool";
    // console.log("cool");
  } else if (deviation < 15) {
    grade = "bad";
    // console.log("bad");
  } else {
    // alert("miss");
    grade = "miss";
  }
  console.log(`this is my ${grade}`);
  scoreboard[grade] += 1;
  return grade;
}

let level = 8;

function initialise() {
  level = 8;
  randomiseKeys(level);
}

function nextLevel() {
  if (level < 6) {
    level++;
  } else if (level < 9.75) {
    level += 0.25;
  } else if (level === 9.75) {
    level = 6;
  }
  document.querySelector(".level-number").innerText = Math.floor(level);
  randomiseKeys(Math.floor(level));
}

let distanceX = 0;
function rhythmSpeed() {
  document.querySelector(".target").style.transform = `translateX(${
    distanceX + 1
  }px)`;
  //   console.log(`translateX(${distanceX + 1}px)`);
  distanceX += 1;
  if (distanceX === 185) {
    distanceX = 0;
  }
  //   grading();
}

// setInterval(rhythmSpeed, 10);

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
    if (e.keyCode == currentKey.value) {
      console.log("proceed to next key");
      currentKey.className = "pressed-key";
    } else {
      console.log("current round failed");
      currentKeys = [];
      document.querySelector(".arrow-keys").innerHTML = "";
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    document.querySelector(".arrow-keys").innerHTML = "";
    if (document.querySelector(".key") !== null) {
      console.log("not null");
      if (grading() !== "miss") {
        console.log("success!");
        document.querySelector(".grade").innerText = grading();
      }
    } else {
      console.log("miss");
      document.querySelector(".grade").innerText = "miss";
    }
    console.log(document.querySelector(".key"));
  }
});

// create eventlistener for each button -> remove event listener after pressing

// console.log(document.querySelector(".rhythm-bar").style.width);

// timestamp;
// 4s
randomiseKeys(0);
console.log(document.querySelector(".key"));
console.log(currentKeys);
// console.log(Date.now());

function startGame(e) {
  setInterval(rhythmSpeed, 10);
  setInterval(nextLevel, 4000);
  setInterval(randomiseKeys, 4000);
  startDate = Date.now();
  console.log(startDate);
  console.log(e.target);
  e.target.remove();
}

let startDate = "startdate";
document.querySelector("input").addEventListener("click", (e) => startGame(e));

function currentDate() {
  let currentDate = Date.now();
  if (currentDate - startDate > 2000) {
    document.querySelector(".arrow-keys").innerHTML = "";
    startDate = currentDate;
  }
}

// setInterval(currentDate, 2000);

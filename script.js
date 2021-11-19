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
};

function randomiseKeys() {
  const keyCode = Math.floor(Math.random() * 4) + 37;
  const newArrowKey = document.createElement("button");
  newArrowKey.setAttribute("value", keyCode);
  newArrowKey.innerHTML = uniCode[keyCode];
  document.querySelector(".arrow-keys").append(newArrowKey);
}

function grading() {
  const perfectDistance = 116;
  let deviation = Math.abs(perfectDistance - distanceX);

  if (deviation < 2) {
    alert("perfect");
    scoreboard.perfect += 1;
  } else if (deviation < 6) {
    alert("great");
    scoreboard.great += 1;
  } else if (deviation < 10) {
    alert("cool");
    scoreboard.cool += 1;
  } else if (deviation < 15) {
    alert("bad");
    scoreboard.bad += 1;
  } else {
    // alert("miss");
    scoreboard.miss += 1;
  }
}

let distanceX = 0;
function rhythmSpeed() {
  document.querySelector(".target").style.transform = `translateX(${
    distanceX + 1
  }px)`;
  console.log(`translateX(${distanceX + 1}px)`);
  distanceX += 1;
  if (distanceX === 185) {
    distanceX = 0;
  }
  grading();
}

// setInterval(rhythmSpeed, 10);

window.addEventListener("keydown", (e) => {
  if (e.keyCode == document.querySelector("button").value) {
    console.log("right");
  }
});

// create eventlistener for each button -> remove event listener after pressing

console.log(document.querySelector(".rhythm-bar").style.width);

// timestamp;
// 4s
randomiseKeys();

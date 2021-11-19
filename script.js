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

function grading() {
  const perfectDistance = 116;
  let deviation = Math.abs(perfectDistance - distanceX);

  if (deviation < 2) {
    console.log("perfect");
    scoreboard.perfect += 1;
    return "perfect";
  } else if (deviation < 6) {
    console.log("great");
    scoreboard.great += 1;
    return "great";
  } else if (deviation < 10) {
    console.log("cool");
    scoreboard.cool += 1;
    return "cool";
  } else if (deviation < 15) {
    console.log("bad");
    scoreboard.bad += 1;
    return "bad";
  } else {
    // alert("miss");
    scoreboard.miss += 1;
    return "miss";
  }
}

let level = 1;

function initialise() {
  level = 1;
  randomiseKeys(level);
}

function nextLevel() {
  if (level < 6) {
    level++;
  } else {
    level += 0.25;
  }
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
  grading();
}

// setInterval(rhythmSpeed, 10);
// setInterval(nextLevel, 20);
// setInterval(randomiseKeys, 20);

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
    if (!document.querySelector(".key")) {
      if (grading() !== "miss") {
        console.log("success!");
      }
    } else {
      console.log("miss");
    }
  }
});

// create eventlistener for each button -> remove event listener after pressing

// console.log(document.querySelector(".rhythm-bar").style.width);

// timestamp;
// 4s
randomiseKeys(9);
console.log(currentKeys);
// console.log(Date.now());

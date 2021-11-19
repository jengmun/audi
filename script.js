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

window.addEventListener("keydown", () => {
  console.log("hi");
});

const target = document.querySelector(".target");
if (distanceX === 125) {
  alert("perfect");
}

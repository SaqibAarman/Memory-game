const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// ITEMS ARRAYS

const items = [
  {
    name: "bee",
    image: "./assets/Bee.png",
  },
  {
    name: "dog",
    image: "./assets/Dog.png",
  },
  {
    name: "fish",
    image: "./assets/Fish.png",
  },
  {
    name: "lion",
    image: "./assets/Lion.png",
  },
  {
    name: "deer",
    image: "./assets/Deer.png",
  },
  {
    name: "mouse",
    image: "./assets/Mouse.png",
  },
  {
    name: "tree",
    image: "./assets/Tree.png",
  },
  {
    name: "horse",
    image: "./assets/Horse.png",
  },
  {
    name: "fox",
    image: "./assets/Fox.png",
  },
  {
    name: "duck",
    image: "./assets/Duck.png",
  },
  {
    name: "monkey",
    image: "./assets/Monkey.png",
  },
  {
    name: "sheep",
    image: "./assets/Sheep.png",
  },
];

// Initial Time
let seconds = 0,
  minutes = 0;

// Initial Moves And Win Count
let movesCount = 0,
  winCount = 0;

// For Timer

const timeGenerator = () => {
  seconds += 1;

  // Minutes Logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  // Format Time Before Displaying
  let secondsVal = seconds < 10 ? `0 ${seconds}` : seconds;
  let minutesVal = minutes < 10 ? `0 ${minutes}` : minutes;

  timeValue.innerHTML = `<span>Time :</span> ${minutesVal} : ${secondsVal}`;
};

// For Calculating Moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves :</span> ${movesCount}`;
};

// Pick Random Objects From The Items Array
const generateRandom = (size = 4) => {
  // Temporary Array
  let tempArray = [...items];

  // Initialize Card Values Array
  let cardValues = [];

  //Size Should Double ( 4*4 Matrix)/2 Since Pairs Of Objects Would Exists
  size = (size * size) / 2;

  // Random Object Selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);

    cardValues.push(tempArray[randomIndex]);

    // Once Selected REmove Object From Temp Array

    tempArray.splice(randomIndex, 1);
  }

  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";

  cardValues = [...cardValues, ...cardValues];

  // Simple Shuffle
  cardValues.sort(() => Math.random() - 0.5);

  for (let i = 0; i < size * size; i++) {
    /* 
         Create Cards
         before => front Side ( Contain Question Mark )
         after => back Side ( Contain Actual Image )
         data-card-values is custom attribute which store the name of cards to match later
        */

    gameContainer.innerHTML += `
         <div class="card-container" data-card-value="${cardValues[i].name}" >
            <div class="card-before">?</div>
            <div class="card-after">
                <img src="${cardValues[i].image}" class="image" alt="${cardValues[i].name}" />
            </div>
         </div>
         `;
  }

  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

  // CARDS
  cards = document.querySelectorAll(".card-container");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        // Flip  Card
        card.classList.add("flipped");

        if (!firstCard) {
          // So Current Card Will Become First Card
          firstCard = card;

          // Current Card Will Become First CardValue
          firstCardVal = card.getAttribute("data-card-value");
        } else {
          // Increment Moves since user selected 2nd Card
          movesCounter();

          // second card and Value
          secondCard = card;

          let secondCardVal = card.getAttribute("data-card-value");

          if (firstCardVal === secondCardVal) {
            // Both Card Match  add Matched

            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            firstCard = false;
            // win count as user found correct match
            winCount += 1;

            // check if winCount == half of cardValues
            if (winCount === Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<div class="firework"></div>
              <div class="firework"></div>
              <div class="firework"></div>
              <h2>You Won &#127881;</h2>
                <h4>Moves : ${movesCount}</h4>
              `;
              // &#x1F38A;
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];

            firstCard = false;
            secondCard = false;

            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// START GAME
startBtn.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;

  // Controls amd buttons visibility
  controls.classList.add("hide");
  stopBtn.classList.remove("hide");
  startBtn.classList.add("hide");

  // Start Timer
  interval = setInterval(timeGenerator, 1000);

  // Initial Moves
  moves.innerHTML = `<span>Moves :</span> ${movesCount}`;

  initializer();
});

// Stop Game
stopBtn.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopBtn.classList.add("hide");
    startBtn.classList.remove("hide");

    clearInterval(interval);
  })
);

// Initialize Values And Fun Calls
const initializer = () => {
  result.innerHTML = "";
  winCount = 0;

  let cardValues = generateRandom();
  console.log(cardValues, "[]");

  matrixGenerator(cardValues);
};

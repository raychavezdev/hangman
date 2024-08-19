import { levels,infolevel } from "./words.js";

// import { levels, infolevel } from "./words.js";
//CSS ROOT
const rootCSS = document.querySelector(":root");

// CANVAS
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

// GAME ELEMENTS
const hang = document.querySelector(".hang-container");
const wordContainer = document.querySelector(".word");
const btnStart = document.querySelector(".btn-start");
const gameContainer = document.querySelector(".game-container");
const keyboard = document.querySelector(".keyboard");
const btnBack = document.querySelector(".btn-back");
const btnClue = document.querySelector(".btn-clue");
const btnHow = document.querySelector(".how")
const howContainer = document.querySelector(".how-container")

// MODAL
const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal-text");
const modalBtn1 = document.querySelector(".modal-btn1");
const modalBtn2 = document.querySelector(".modal-btn2");

// LEVEL
const levelHTML = document.querySelectorAll("[class*=level]");
let hardcore = false;

//////////////////////////////////////////////SET DEFAULT VALUES//////////////////////////////////////////////

//DEFAULT VARIABLES
let clue = "";
let word = "";
let level = 1;
let clueCount = 1;
let backCount = 2;
let usedLetters = [];
let mistakes = 0;
let hits = 0;
let turn = 0;

//set the data level information
levelHTML[0].setAttribute("data-info", infolevel[level - 1]);

const setLevel = () => {
  levelHTML.forEach((element) => {
    element.innerText = `Nivel ${level}`;
  });
  if (hardcore) {
    levelHTML[0].innerText += " (Hardcore)";
  }
};
const printHang = () => {
  ctx.fillStyle = getComputedStyle(rootCSS).getPropertyValue(
    `--color-level${level}`
  );
  ctx.fillRect(0, 0, 15, 200);
  ctx.fillRect(15, 0, 60, 15);
  ctx.fillRect(60, 0, 15, 40);
};
const setPowerCount = () => {
  btnBack.setAttribute("data-try", backCount);
  btnClue.setAttribute("data-try", clueCount);
};

setLevel();
printHang();
setPowerCount();

// START THE GAME
btnStart.addEventListener("click", () => {
  wordContainer.classList.add("show");
  btnStart.classList.add("hide");
  gameContainer.classList.add("game-start");
  keyboard.classList.add("show", "kb-start");
  word = randomWord(Object.values(levels)[level - 1])
    .toUpperCase()
    .split("");
  printLines(word);
  setPowerCount();
  keyboard.addEventListener("click", game);

  //add extra difficult to levels 5-10
  switch (level) {
    case 5:
      blockVocals(true);
      break;
    case 6:
      blockVocals(true);
      break;
    case 7:
      if (hardcore) {
        blockVocals(true);
      }
      starWhitMiss(2);
      break;
    case 8:
      if (hardcore) {
        blockVocals(true);
      }
      starWhitMiss(2);
      break;
    case 9:
      blockVocals(true);
      starWhitMiss(2);

      break;
    case 10:
      blockVocals(true);
      starWhitMiss(2);
      break;
  }
});

//////////////////////////////    FUNCTIONS     /////////////////////////////////////////
const randomWord = (level) => level[Math.floor(Math.random() * level.length)];

const findLetters = (letter, word) => {
  let positions = [];
  word.forEach((element, i) => {
    if (element == letter.toUpperCase()) {
      positions.push(i);
    }
  });
  return positions;
};

const validateGame = (amount, total) => {
  if (amount == total) {
    return true;
  }
  return false;
};

const clearCanvas = () => {
  ctx.reset();
  printHang();
};

const resetGame = () => {
  clueCount = 1;
  backCount = 1;
  if (hardcore) {
    clueCount = 3;
    backCount = 3;
  }
  setPowerCount();
  level = 1;
  mistakes = 0;
  clearCanvas();
  resetLevel();
};

const resetLevel = (hardcore) => {
  if (!hardcore) {
    mistakes = 0;
    clearCanvas();
  } else {
    printHang();
    for (let i = 1; i <= mistakes; i++) {
      printMan(i);
    }
  }
  hits = 0;
  turn = 0;

  document.querySelectorAll(".block").forEach((element) => {
    element.classList.remove("block");
  });
};

const printLines = (word) => {
  for (let i = 0; i < word.length; i++) {
    let line = document.createElement("div");
    line.classList.add("line");
    wordContainer.appendChild(line);
  }
};

const blockVocals = (flag) => {
  const vocals = document.querySelectorAll(".vocal");
  vocals.forEach((element) => {
    if (flag) {
      element.classList.add("red", "block");
    } else {
      element.classList.remove("red", "block");
    }
  });
};

const starWhitMiss = (miss) => {
  if (!hardcore) {
    for (let i = 0; i < miss; i++) {
      mistakes++;
      printMan(mistakes);
    }
  }
};
const printMan = (mistakes) => {
  switch (mistakes) {
    case 1:
      //HEAD
      ctx.fillStyle = "aliceblue";
      ctx.beginPath();
      ctx.arc(68, 43, 15, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 2:
      //Body
      ctx.strokeStyle = "aliceblue";
      ctx.beginPath();
      ctx.moveTo(68, 58);
      ctx.lineTo(68, 100);
      ctx.lineWidth = 5;
      ctx.stroke();
      break;
    case 3:
      //left arm
      ctx.moveTo(68, 58);
      ctx.lineTo(50, 100);
      ctx.stroke();
      break;
    case 4:
      //right arm
      ctx.moveTo(68, 58);
      ctx.lineTo(85, 100);
      ctx.stroke();
      break;
    case 5:
      //left leg
      ctx.moveTo(68, 100);
      ctx.lineTo(55, 150);
      ctx.stroke();
      break;
    case 6:
      //right leg
      ctx.moveTo(68, 100);
      ctx.lineTo(80, 150);
      ctx.stroke();
      break;
  }
};

const showModal = (content) => {
  if (content == "win") {
    if (hardcore) {
      modalBtn2.style.display = "block";
    }
    modal.style.setProperty("background-color", "var(--color-win)");
    modalText.innerText = "¡GANASTE!";
    modalBtn1.innerText = "Repetir Nivel";
    modalBtn2.innerText = "Siguiente";
  } else if (content == "loose") {
    modal.style.setProperty("background-color", "var(--color-loose)");
    modalText.innerText = "¡PERDISTE!";
    modalBtn1.innerText = "Reiniciar Juego";
    if (!hardcore) {
      modalBtn2.innerText = "Reintentar Nivel";
    } else {
      modalBtn2.style.display = "none";
    }
  } else if (content == "end") {
    modal.style.setProperty("background-color", "var(--color-end)");
    if (!hardcore) {
      modalText.innerText = "¡Felicidades!";
      modalBtn1.innerText = "Repetir Nivel";
      modalBtn2.innerText = "Modo Hardcore";
    }
  } else {
    modal.style.setProperty("background-color", "var(--color-end)");

    modalText.innerText = "¡Felicidades!";
    modalBtn1.innerText = "Siguiente";
    modalBtn2.style.display = "none";
  }

  const timerInterval = setInterval(() => {
    levelHTML[0].classList.add("block");
    howContainer.classList.add('block')
    modal.classList.remove("hide");
    keyboard.classList.remove("show");
    keyboard.classList.add("hide");
    hang.classList.add("hide");
    wordContainer.classList.add("word-win");
    clearInterval(timerInterval);
  }, 200);
};

const hideModal = () => {
  modal.classList.add("hide");
  keyboard.classList.remove("hide");
  keyboard.classList.remove("show");
  hang.classList.remove("hide");
  wordContainer.classList.remove("word-win");
  wordContainer.classList.remove("show");
  wordContainer.innerHTML = "";
  gameContainer.classList.remove("game-win");
  gameContainer.classList.remove("game-start");
  btnStart.classList.remove("hide");
  levelHTML[0].setAttribute("data-info", infolevel[level - 1]);
  usedLetters = [];

  setLevel();
  resetLevel(hardcore);

  if (hardcore && level > 10) {
    endGame();
  }
};

const endGame = () => {
  levelHTML[0].classList = "hide";
  keyboard.classList = "hide";
  wordContainer.classList = "hide";
  btnHow.classList = 'hide';

  ctx.reset();
  let cont = 0;
  btnStart.classList = 'final-msg'
  btnStart.innerText = '¡Felicidades!'
  document.querySelector('.logo').classList.add('end')
  document.querySelector('.credits').classList.add('end')

  setInterval(() => {
    ctx.reset();
    if (cont % 2 == 0) {
      //HEAD
      ctx.fillStyle = "aliceblue";
      ctx.beginPath();
      ctx.arc(38, 43, 15, 0, 2 * Math.PI);
      ctx.fill();
      //Body
      ctx.strokeStyle = "aliceblue";
      ctx.beginPath();
      ctx.moveTo(38, 58);
      ctx.lineTo(38, 100);
      ctx.lineWidth = 5;
      ctx.stroke();
      //left arm
      ctx.moveTo(38, 58);
      ctx.lineTo(20, 100);
      ctx.stroke();
      //right arm
      ctx.moveTo(38, 58);
      ctx.lineTo(55, 100);
      ctx.stroke();
      //left leg
      ctx.moveTo(38, 100);
      ctx.lineTo(25, 150);
      ctx.stroke();
      //right leg
      ctx.moveTo(38, 100);
      ctx.lineTo(50, 150);
      ctx.stroke();
    } else {
      //HEAD
      ctx.fillStyle = "aliceblue";
      ctx.beginPath();
      ctx.arc(38, 43, 15, 0, 2 * Math.PI);
      ctx.fill();
      //Body
      ctx.strokeStyle = "aliceblue";
      ctx.beginPath();
      ctx.moveTo(38, 58);
      ctx.lineTo(38, 100);
      ctx.lineWidth = 5;
      ctx.stroke();
      //left arm
      ctx.moveTo(38, 58);
      ctx.lineTo(0, 32);
      ctx.stroke();
      //right arm
      ctx.moveTo(38, 58);
      ctx.lineTo(75, 32);
      ctx.stroke();
      //left leg
      ctx.moveTo(38, 100);
      ctx.lineTo(15, 150);
      ctx.stroke();
      //right leg
      ctx.moveTo(38, 100);
      ctx.lineTo(60, 150);
      ctx.stroke();
    }
    cont++;
  }, 500);
};

const game = (e) => {
  const lines = [...document.querySelectorAll(".line")];
  const clues = [...document.querySelectorAll(".clue")];
  if (e.target.classList.contains("key")) {
    turn++;

    if (e.target.innerText == clue) {
      clues.forEach((clue) => {
        clue.classList.remove("clue");
        btnClue.classList.remove("block");
        clue = "";
      });
    }

    //level 5,6,9 and 10 start whit vocal blocked until turn 4
    if ((level >= 5 && level <= 6) || level >= 9 || (hardcore && level >= 5)) {
      if (turn == 4) {
        blockVocals(false);
      }
    }

    //for level 1 and 2 keys are blocked when you click them
    if (level <= 2) {
      e.target.classList.add("block");
    }

    let letter = e.target.innerText.toUpperCase();
    if (findLetters(letter, word).length > 0) {
      usedLetters.push(e.target.innerText);
      //for level 3 en upper when you miss the key are not going to be blocked
      if (level >= 3) {
        e.target.classList.add("block");
      }
      //print the letter if is in the word
      findLetters(letter, word).forEach((pos) => {
        hits++;
        lines[pos].innerText = letter;
      });

      //check if win or loose
      if (validateGame(hits, word.length)) {
        if (level % 3 == 0) {
          clueCount++;
        } else if (level % 2 == 0) {
          backCount++;
        }

        setPowerCount();

        level++;
        //level 10 is the final one
        keyboard.classList.remove("kb-start");
        if (level > 10) {
          if (hardcore) {
            showModal("hard");
            return;
          }
          levelHTML[0].classList.add("no-pointer");
          showModal("end");
          return;
        }
        showModal("win");
      }
    } else {
      mistakes++;

      printMan(mistakes);
      if (validateGame(mistakes, 6)) {
        keyboard.classList.remove("kb-start");
        showModal("loose");
      }
    }
  }
};

const clearMistake = () => {
  ctx.reset();
  printHang();
  mistakes--;
  for (let i = 1; i <= mistakes; i++) {
    printMan(i);
  }
};

//////////////////////////////////   BUTTONS EVENTS     ///////////////////////////////////////

modalBtn2.addEventListener("click", () => {
  if (level > 10) {
    rootCSS.style.setProperty("--color-primary", "rgb(120, 98, 137)");
    rootCSS.style.setProperty("--color-primary-darken", "rgb(89, 46, 122)");
    hardcore = true;
    resetGame();
  }
  hideModal();
});

modalBtn1.addEventListener("click", (e) => {
  if (e.target.innerText == "Reiniciar Juego") {
    if (hardcore && level >= 5) {
      blockVocals(false);
    }
    resetGame();
  } else if (e.target.innerText != "Siguiente") {
    level--;
  }
  hideModal();
});

btnBack.addEventListener("click", (e) => {
  if (backCount > 0 && mistakes > 0) {
    backCount--;
    e.target.setAttribute("data-try", backCount);

    clearMistake();
  }
});

btnClue.addEventListener("click", (e) => {
  if (clueCount > 0) {
    clueCount--;
    setPowerCount();
    const lines = [...document.querySelectorAll(".line")];

    let missedLetters = word;
    word.forEach((wordLetter) => {
      usedLetters.forEach((usedLetter) => {
        if (usedLetter == wordLetter) {
          missedLetters[missedLetters.indexOf(wordLetter)] = "";
          return;
        }
      });
    });
    missedLetters = missedLetters.filter((missedLetter) => missedLetter != "");
    clue = missedLetters[Math.floor(Math.random() * missedLetters.length)];
    let clueIndex = findLetters(clue, word);
    clueIndex.forEach((pos) => {
      lines[pos].innerText = clue;
      lines[pos].classList.add("clue");
    });

    btnClue.classList.add("block");
  }
});

btnHow.addEventListener('click', () => {
  gameContainer.classList.toggle('block')
  howContainer.classList.toggle('active')
  document.querySelector('.tutorial').classList.toggle('flex-center')
  btnHow.classList.toggle('active')
  if(btnHow.innerText=='?'){
    btnHow.innerText='X'
  }else{
    btnHow.innerText='?'
  }
})
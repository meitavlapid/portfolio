const gameState = {
  deck: [
    // Reds 1-9
    { type: "number", color: "red", value: 1 },
    { type: "number", color: "red", value: 2 },
    { type: "number", color: "red", value: 3 },
    { type: "number", color: "red", value: 4 },
    { type: "number", color: "red", value: 5 },
    { type: "number", color: "red", value: 6 },
    { type: "number", color: "red", value: 7 },
    { type: "number", color: "red", value: 8 },
    { type: "number", color: "red", value: 9 },

    // Blues 1-9
    { type: "number", color: "blue", value: 1 },
    { type: "number", color: "blue", value: 2 },
    { type: "number", color: "blue", value: 3 },
    { type: "number", color: "blue", value: 4 },
    { type: "number", color: "blue", value: 5 },
    { type: "number", color: "blue", value: 6 },
    { type: "number", color: "blue", value: 7 },
    { type: "number", color: "blue", value: 8 },
    { type: "number", color: "blue", value: 9 },

    // Yellows 1-9
    { type: "number", color: "yellow", value: 1 },
    { type: "number", color: "yellow", value: 2 },
    { type: "number", color: "yellow", value: 3 },
    { type: "number", color: "yellow", value: 4 },
    { type: "number", color: "yellow", value: 5 },
    { type: "number", color: "yellow", value: 6 },
    { type: "number", color: "yellow", value: 7 },
    { type: "number", color: "yellow", value: 8 },
    { type: "number", color: "yellow", value: 9 },

    // Green 1-9
    { type: "number", color: "green", value: 1 },
    { type: "number", color: "green", value: 2 },
    { type: "number", color: "green", value: 3 },
    { type: "number", color: "green", value: 4 },
    { type: "number", color: "green", value: 5 },
    { type: "number", color: "green", value: 6 },
    { type: "number", color: "green", value: 7 },
    { type: "number", color: "green", value: 8 },
    { type: "number", color: "green", value: 9 },

    // Special cards
    { type: "action", color: null, value: "+2" },
    { type: "action", color: null, value: "changeColor" },
  ],

  colors: {
    red: "#d96c6c",
    green: "#6cbd6c",
    blue: "#6c86d9",
    yellow: "#d9d36c",
  },

  actionDisplayNames: {
    "+2": "+2",
    changeColor: "החלף צבע",
  },

  // Game state variables
  activeDeck: [],
  activePlayers: [],
  playerName: "",
  currentTurnIndex: 0,
  centralDeck: [],
  pendingPlusTwoCards: 0,
  mustDrawCards: false,
};

function initGame() {
  gameState.playerName = document.getElementById("player-name").value;
  const playerCount = parseInt(document.getElementById("player-count").value);
  const shuffledDeck = shuffleDeck(createDeck());
  const { players, remainingDeck } = dealCards(shuffledDeck, playerCount);

  gameState.currentTurnIndex = Math.floor(Math.random() * playerCount);
  gameState.activePlayers = players;

  while (true) {
    const card = remainingDeck.pop();
    if (card.type === "number") {
      gameState.centralDeck.push(card);
      break;
    } else {
      remainingDeck.push(card);
    }
  }

  gameState.activeDeck = remainingDeck;
  document.getElementById("player-setup").style.display = "none";
  updateMessage("המשחק התחיל!");
  renderGameUI();

  if (gameState.currentTurnIndex !== 0) return play();
}

function renderPlayerHand() {
  const playerDiv = document.getElementById("player-hand");
  playerDiv.innerHTML = "";

  gameState.activePlayers.at(0).forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.style.backgroundColor = gameState.colors[card.color] || "gray";
    cardDiv.textContent =
      card.type === "action"
        ? gameState.actionDisplayNames[card.value]
        : card.value;
    cardDiv.addEventListener("click", () => play(card));
    playerDiv.appendChild(cardDiv);
  });
}

function renderOpponentCards() {
  const positions = ["left-player", "right-player"];

  positions.forEach((pos) => {
    const div = document.getElementById(pos);
    if (div) {
      const area = div.querySelector(".player-area") || div;
      area.innerHTML = "";
    }
  });

  for (let i = 1; i < gameState.activePlayers.length; i++) {
    const playerDiv = document.getElementById(positions[i - 1]);
    if (!playerDiv) continue;

    const playerArea = playerDiv.querySelector(".player-area") || playerDiv;
    playerArea.innerHTML = generateHiddenCards(
      gameState.activePlayers[i].length
    );
  }
}

function generateHiddenCards(count) {
  return Array(count)
    .fill("")
    .map(() => '<div class="card hidden"></div>')
    .join("");
}

function handleNextTurn() {
  gameState.currentTurnIndex =
    (gameState.currentTurnIndex + 1) % gameState.activePlayers.length;
  renderGameUI();
}

async function play(card = null) {
  if (!card) {
    if (gameState.currentTurnIndex === 0) return;

    const player = gameState.activePlayers.at(gameState.currentTurnIndex);

    if (gameState.mustDrawCards) {
      updateMessage(
        `שחקן ${gameState.currentTurnIndex + 1}צריך למשוך ${
          gameState.pendingPlusTwoCards
        } קלפים מהקופה  `,
        5000
      );
      for (let i = 0; i < gameState.pendingPlusTwoCards; i++) {
        drawCard();
      }
      gameState.pendingPlusTwoCards = 0;
      gameState.mustDrawCards = false;
      handleNextTurn();
      return play();
    }

    const playableCards = player.filter((c) => canPlay(c));

    if (!playableCards.length) {
      updateMessage(
        `השחקן ${gameState.currentTurnIndex + 1} לא יכול לשחק, משך קל מהקופה`,
        5000
      );
      drawCard();
      handleNextTurn();
      return play();
    }

    card = playableCards[Math.floor(Math.random() * playableCards.length)];
    updateMessage(`שחקן ${gameState.currentTurnIndex + 1} משחק`, 5000);
    await sleep();
  } else {
    if (gameState.currentTurnIndex !== 0) return;

    if (gameState.mustDrawCards) {
      updateMessage(
        `צריך למשוך ${gameState.pendingPlusTwoCards} קלפים מהקופה`,
        5000
      );
      for (let i = 0; i < gameState.pendingPlusTwoCards; i++) {
        drawCard();
      }
      gameState.pendingPlusTwoCards = 0;
      gameState.mustDrawCards = false;
      handleNextTurn();
      return play();
    }

    if (!canPlay(card)) {
      return updateMessage("לא ניתן לשחק עם קלף זה", 2000);
    }
  }

  const player = gameState.activePlayers.at(gameState.currentTurnIndex);
  const cardIndex = player.findIndex(
    (c) => JSON.stringify(c) === JSON.stringify(card)
  );

  gameState.centralDeck.push(card);
  player.splice(cardIndex, 1);

  if (checkGameOver(gameState.currentTurnIndex)) return;

  if (card.value === "+2") {
    gameState.pendingPlusTwoCards += 2;
    gameState.mustDrawCards = true;
  }

  if (card.value === "changeColor") {
    if (gameState.currentTurnIndex === 0) {
      showColorPicker();
      return;
    } else {
      const availableColors = Object.keys(gameState.colors);
      const randomColor =
        availableColors[Math.floor(Math.random() * availableColors.length)];
      gameState.centralDeck.at(-1).color = randomColor;
      updateMessage(
        `שחקן ${gameState.currentTurnIndex + 1} שינה צבע ל ${randomColor}`,
        5000
      );
    }
  }

  handleNextTurn();
  renderGameUI();

  if (gameState.currentTurnIndex !== 0) {
    await play();
  }
}

function drawUserCard() {
  if (gameState.currentTurnIndex !== 0) return;

  if (gameState.mustDrawCards) {
    for (let i = 0; i < gameState.pendingPlusTwoCards; i++) {
      drawCard();
    }
    gameState.pendingPlusTwoCards = 0;
    gameState.mustDrawCards = false;
  } else {
    drawCard();
  }

  handleNextTurn();
  if (gameState.currentTurnIndex !== 0) play();
}

function drawCard() {
  const player = gameState.activePlayers.at(gameState.currentTurnIndex);
  const newCard = gameState.activeDeck.pop();
  player.push(newCard);
  renderGameUI();
}

function canPlay({ color, value, type }) {
  const { color: centralColor, value: centralValue } =
    gameState.centralDeck.at(-1);

  if (gameState.mustDrawCards) {
    return type === "action" && value === "+2";
  }

  if (type === "number") {
    return value === centralValue || color === centralColor;
  } else if (type === "action") {
    switch (value) {
      case "+2":
        return color === centralColor;
      case "changeColor":
        return true;
      default:
        return false;
    }
  }
  return false;
}

function updateCentralCard() {
  if (!gameState.centralDeck.length) return;
  const card = gameState.centralDeck.at(-1);
  const centralCardDiv = document.getElementById("central-card");
  centralCardDiv.innerHTML = `
        <div class="card ${card.color}">
            <span>${card.value}</span>
        </div>
    `;
}

function createDeck() {
  return fillMissingColors([...gameState.deck, ...gameState.deck]);
}

function fillMissingColors(deck) {
  return deck.map((card) => ({
    ...card,
    color: getActionCardColor(card),
  }));
}

function getActionCardColor(card) {
  const colorNames = Object.keys(gameState.colors);
  switch (card.value) {
    case "+2":
      return colorNames[Math.floor(Math.random() * colorNames.length)];
    case "changeColor":
      return null;
    default:
      return card.color;
  }
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealCards(deck, numOfPlayers) {
  const players = [];
  for (let i = 0; i < numOfPlayers; i++) {
    players.push(deck.splice(0, 8));
  }
  return {
    players,
    remainingDeck: deck,
  };
}

function updateMessage(message, timeout = 5000) {
  const messageLine = document.getElementById("message-line");
  messageLine.textContent = message;
  messageLine.style.display = "block";
  setTimeout(() => {
    messageLine.style.display = "none";
  }, timeout);
}

function showColorPicker() {
  document.getElementById("color-picker").style.display = "block";
}

function chooseColor(color) {
  gameState.centralDeck.at(-1).color = color;
  document.getElementById("color-picker").style.display = "none";
  updateCentralCard();
  handleNextTurn();
  play();
}

function gameOver(winner) {
  const popUp = document.createElement("div");
  popUp.classList.add("popUp");
  popUp.innerHTML = `
    <div class="popUpBox">
      <p>${winner} ניצח!</p>
      <button onclick="location.reload()">שחק שוב</button>
    </div>`;
  document.body.appendChild(popUp);
}
function checkGameOver(playerIndex) {
  if (gameState.activePlayers[playerIndex].length === 0) {
    const winner =
      playerIndex === 0 ? gameState.playerName : `Player ${playerIndex + 1}`;
    updateMessage(`${winner} ניצח את המשחק!`);
    gameOver(winner);
    return true;
  }
  return false;
}

async function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderGameUI() {
  renderPlayerHand();
  renderOpponentCards();
  updateCentralCard();

  const positions = ["player-hand", "left-player", "right-player"];
  positions.forEach((pos, index) => {
    const element = document.getElementById(pos);
    if (element) {
      if (index === gameState.currentTurnIndex) {
        element.classList.add("active-player");
      } else {
        element.classList.remove("active-player");
      }
    }
  });

  if (gameState.currentTurnIndex === 0) {
    updateMessage("התור שלך!");
  }
}

'use strict'

const state = {};
const cards = { ordered: [], suffled: [], ids: [] };
const elements = {};
const players = [];
const images = [];

window.addEventListener('load', init);

function init() {
  setState();
  loadImages();
  getElements();
  makeMenu();
  makeCards();
}

function setState() {
  state.player = 0;
  state.flipped1 = false;
  state.flipped2 = false;
}

function nextPlayer() {
  if (state.player < players.length - 1) {
    state.player++;
  } else {
    state.player = 0;
  }
  updatePlayer();
}

function updatePlayer() {
  const players = document.getElementById('score').childNodes;
  console.log(players);
  for (let i = 0; i < players.length; i++) {
    if( i == state.player ) {
      players[i].id = `player`;
    } else {
      players[i].id = ``;
    };
  }
}

function loadImages() {
  for (let i = 0; i < 8; i++) {
    images[i * 2] = new Image();
    images[(i * 2) + 1] = new Image();
    images[i * 2].src = `images/${i}.jpg`;
    images[(i * 2) + 1].src = `images/${i}.jpg`;
    images[i * 2].className = 'front';
    images[(i * 2) + 1].className = 'front';
  }
}

function getElements() {
  elements.menu = document.getElementById('menu');
  elements.addPlayer = document.getElementById('addPlayer');
  elements.playerList = document.getElementById('playerList');
  elements.start = document.getElementById('start');
  elements.game = document.getElementById('game');
}

function makeMenu() {
  makePlayers();
  elements.addPlayer.addEventListener('click', addPlayer);
  elements.start.addEventListener('click', (event) => {
    makeScoreboard();
    elements.menu.style.display = 'none';
    elements.game.style.display = 'flex';
  });
}

function makePlayers() {
  for (let i = 0; i < 2; i++) {
    addPlayer();
  }
}

function addPlayer() {
  const player = {};
  player.id = `player${players.length + 1}`;
  player.name = `Player ${players.length + 1}`;
  player.score = 0;
  document.getElementById('players').appendChild(makeNode(player));
  players.push(player);
}

function makeScoreboard() {
  const names = getPlayerNames();
  updateScoreboard();
}

function updateScoreboard() {
  const oldScore = document.getElementById('score');
  const score = document.createElement('div');
  score.id = 'score';
  for (const player of players) {
    const div = document.createElement('div');
    div.innerText = `${player.name}: ${player.score}`;
    score.appendChild(div);
  }
  oldScore.replaceWith(score);
  updatePlayer();
}

function getPlayerNames() {
  const elements = document.getElementsByClassName('tag');
  for (let i = 0; i < elements.length; i++) {
    players[i].name = elements[i].value;
  }
}

function makeNode(player) {
  const node = document.createElement('div');
  node.id = player.id;
  node.appendChild(addName(player));
  return node
}

function addName(player) {
  const name = document.createElement('input');
  name.inputMode = 'text';
  name.value = player.name;
  name.className = 'tag';
  return name;
}

function makeCards() {
  addFront();
  shuffleCards();
  addBack();
}

function addFront() {
  for (let i = 0; i < 16; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card${i}`;
    card.addEventListener('click', () => { clickedCard(card) });
    card.appendChild(images[i]);
    cards.ordered.push(card);
  }
}

function shuffleCards() {
  while (cards.ids.length < 16) {
    const number = Math.floor((Math.random() * 16));
    if (!cards.ids.includes(number)) {
      cards.ids.push(number)
    }
  }
}

function addBack() {
  for (let i = 0; i < 16; i++) {
    const card = cards.ordered[cards.ids[i]]; // change to i for ordered and cards.ids[i] for suffled
    const back = document.createElement('div');
    back.className = 'back';
    back.innerHTML = `<span class="number">${i + 1}</span>`;
    card.appendChild(back);
    document.getElementById(`game`).appendChild(card);
  }
}

function clickedCard(card) {
  console.log(`Clicked ${card.id}`);
  if (card.className == 'card') {
     if (state.flipped1 && !state.flipped2) {
      card.className = 'card flipped';
      state.card2 = parseInt(card.id.match(/(\d+)/g)[0]);
      state.flipped2 = true;
      checkCards();
    } else if (!state.flipped1 && !state.flipped2) {
      card.className = 'card flipped';
      state.card1 = parseInt(card.id.match(/(\d+)/g)[0]);
      state.flipped1 = true;
    }
  }
}

function checkCards() {
  const card1 = document.getElementById(`card${state.card1}`);
  const card2 = document.getElementById(`card${state.card2}`);
  if (state.card1 % 2 == 0 && state.card1 + 1 == state.card2 ||
    state.card1 % 2 != 0 && state.card1 - 1 == state.card2) {
    window.setTimeout(matchCards, 1000, card1, card2);
  } else {
    window.setTimeout(resetCards, 1000, card1, card2);
  }
}

function matchCards(card1, card2) {
  card1.className = 'card flipped matched';
  card2.className = 'card flipped matched';
  state.flipped1 = false;
  state.flipped2 = false;
  players[state.player].score++;
  updateScoreboard();
}

function resetCards(card1, card2) {
  card1.className = 'card';
  card2.className = 'card';
  state.flipped1 = false;
  state.flipped2 = false;
  nextPlayer();
}
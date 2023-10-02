const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { shuffle } = require('./utils');

const port = process.env.PORT || 8080;
let cardDeck = require('./deck.json')?.deck;

const userLimit = 2;

const gameData = {
  player1: null,
  player2: null,
  players: {},
  gameCards: [],
  currentCard: {},
  move: {},
};

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('play', function (data) {
    const playerId = data.playerId;
    console.log(playerId);

    if (gameData.players.hasOwnProperty(playerId)) {
      gameData.players[playerId].socket = socket.id;
      console.log('user exists');
    } else {
      if (Object.keys(gameData.players).length >= userLimit) {
        console.log('User limit reached. Cannot accept more connections.');
        socket.disconnect(true); // Disconnect the new user
        return;
      }
      console.log('user does not exist');
      // console.log(Object.keys(gameData.players));
      gameData.players[playerId] = {
        name: '1',
        socket: socket.id,
        cards: [],
        canMove: Object.keys(gameData.players).length == 1 ? true : false,
        chooseColor: false,
      };
      Object.keys(gameData.players).length == 1
        ? (gameData.player1 = playerId)
        : (gameData.player2 = playerId);
    }

    if (
      gameData.players[playerId].cards.length === 0 &&
      Object.keys(gameData.players).length == userLimit
    ) {
      gameData.gameCards = shuffle(cardDeck);

      for (const playerId in gameData.players) {
        if (gameData.players.hasOwnProperty(playerId)) {
          for (let i = 0; i < 7; i++) {
            if (gameData.gameCards.length > 0) {
              const card = gameData.gameCards.pop();
              gameData.players[playerId].cards.push(card);
            }
          }
        }
      }
    }

    socket.on('addCard', function (data) {
      const playerId = data.playerId;
      if (
        !gameData.players[playerId] ||
        gameData.players[playerId]?.canMove === false
      )
        return;
      // console.log('user can move');
      if (gameData.gameCards.length > 0) {
        const card = gameData.gameCards.pop();
        gameData.players[playerId].cards.push(card);
        // console.log('cards', gameData.players[playerId].cards)
        for (const playerId in gameData.players) {
          gameData.players[playerId].canMove =
            !gameData.players[playerId].canMove;
        }
        io.emit('cardAdded', gameData);
      }
    });

    socket.on('passcard', function (data) {
      const playerId = data.playerId;
      const cardIndex = data.cardIndex;
      let card = gameData.players[playerId].cards[cardIndex];
      if (
        !gameData.players[playerId] ||
        card === undefined ||
        !gameData.players[playerId].canMove
      )
        return;
      const move = moveCard(cardIndex, playerId);
      if (move) {
        io.emit('cardPassed', gameData);
      }
    });

    io.emit('cardsDealt', gameData);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    // if (Object.keys(gameData.players).length == 0) return;
    // console.log('gamecards ', gameData.gameCards.length);
  });
});

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

function moveCard(cardIndex, playerId) {
  let currentCard = gameData.currentCard;
  let secondPlayer =
    playerId == gameData.player1 ? gameData.player2 : gameData.player1;
  let card = gameData.players[playerId].cards[cardIndex];
  if (Object.keys(gameData.currentCard).length === 0) {
    gameData.currentCard = { ...card };
    gameData.players[playerId].cards[cardIndex].played = true;

    gameData.players[playerId].canMove = false;
    gameData.players[secondPlayer].canMove = true;

    gameData.move = { playerId, cardIndex };
    // console.log(gameData.players[playerId].cards[cardIndex]);
    return true;
  }
  if (card.color !== currentCard.color && card.value !== currentCard.value && card.color !== 'wild') {
    console.log('does not fit', {card, currentCard})

    return false;
  }
  switch (card.value) {
    case 'Wild Draw Four':
      //add 4 cards to next player, choose color, next player skips move
      for (let i = 0; i < 4; i++) {
        if (gameData.gameCards.length > 0) {
          const card = gameData.gameCards.pop();
          gameData.players[secondPlayer].cards.push(card);
        }
      }
      //add to chose color
      gameData.players[playerId].chooseColor = true;
      io.emit('chooseColor', gameData)
      break;
    case 'Wild':
      //ask player to choose the color
      gameData.players[playerId].chooseColor = true;
      io.emit('chooseColor', gameData)
      break;
    case 'draw':
      //add 2 cards to next player, next player skips move
      for (let i = 0; i < 2; i++) {
        if (gameData.gameCards.length > 0) {
          const card = gameData.gameCards.pop();
          gameData.players[secondPlayer].cards.push(card);
        }
      }
      break;
    case 'reverse':
      break;
    case 'skip':
      break;
    default:
      gameData.players[playerId].canMove = false;
      gameData.players[secondPlayer].canMove = true;
  }
  card.played = true;
  gameData.currentCard = card
  gameData.move = { playerId, cardIndex };
  return true;
}

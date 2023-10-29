/* eslint-disable react-hooks/exhaustive-deps */

"use client"
import './styles.css';
import PlayerCards from '@/components/PlayerCards';
import Player1Info from '@/components/Player1Info';
import Player2Info from '@/components/Player2Info';
import PlaygroundControls from '@/components/PlaygroundControls';
import ChooseColor from '@/components/ChooseColor';
import PlaygroundCards from '@/components/PlaygroundCards';
import GameResult from '@/components/GameResult';
import PlayerLeft from '@/components/PlayerLeft';

import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';


export default function Play({params}) {
    const [cookies, setCookie] = useCookies();
    const [socket, setSocket] = useState(null);
    const [chooseColor, setChooseColor] = useState(false)
    const [currentCard, setCurrentCard] = useState({ img: '/cards/empty-card.svg', color: 'white' });
    const [gameData, setGameData] = useState({ players: {}, gameCards: [] });
    const [player1Id, setPlayer1Id] = useState();
    const [player2Id, setPlayer2Id] = useState();
    const [player1canMove, setPlayer1canMove] = useState(false);
    const [player2canMove, setPlayer2canMove] = useState(false);
    const [cardPassedEventOccurred, setCardPassedEventOccurred] = useState(false);
    const playgroundCardRef = useRef(null);
    const player1CardsRef = useRef([]);
    const player2CardsRef = useRef([]);
    const [gameEnded, setGameEnded] = useState(false);
    const [wonGame, setWonGame] = useState(false);
    const [playerLeft, setPlayerLeft] = useState(false);

    useEffect(() => {
        const socketInstance = io.connect('https://a87a-92-119-112-26.ngrok-free.app', {
            extraHeaders:{
                "ngrok-skip-browser-warning": "69420"
            }
        });

        socketInstance.on('connect', async () => {
            console.log('Connected to the server');
            let id;
            if (!cookies.playerId) {
                console.log('no Cookies')
                id = await uuidv4()
                setCookie('playerId', id, {
                    path: '/',
                    httpOnly: false,
                    expires: new Date(Date.now() + 900000000)
                })
            }
            id = cookies.playerId;
            socketInstance.emit('play', { playerId: id, room: params.room })

        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        socketInstance.on('cardsDealt', (data) => {
            setGameData(data)
            console.log('cards dealt')
            for (const player in data.players) {
                if (player === cookies.playerId) {
                    setPlayer1Id(player)
                } else {
                    setPlayer2Id(player)
                }
            }
        });

        socketInstance.on('cardAdded', (data) => {
            setGameData(data)
        })

        socketInstance.on('colorChosen', (data) => {
            setGameData(data)
        })

        socketInstance.on('cardPassed', async (data) => {
            // console.log('cardPassed')
            setGameData(data)
            setCardPassedEventOccurred(true);
        })

        socketInstance.on('chooseColor', async (data) => {
            console.log('chooseColor')
            setGameData(data)
        })

        socketInstance.on('gameEnded', async (data) => {
            let id = cookies.playerId
            let gameWon = data.winner === id
            setWonGame(gameWon)
            setGameEnded(data.gameEnded)
        })

        socketInstance.on('playerLeft', () => {
            console.log('Player Left')
            setPlayerLeft(true)
        })


        setSocket(socketInstance);

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);


    useEffect(() => {
        setPlayer1canMove(gameData.players[player1Id]?.canMove)
        setPlayer2canMove(gameData.players[player2Id]?.canMove)
        setGameEnded(gameData.gameEnded)
        setCurrentCard(gameData.currentCard);
    }, [gameData])

    useEffect(() => {
        setChooseColor(gameData?.players[player1Id]?.chooseColor)
        if (cardPassedEventOccurred && Object.keys(gameData.move).length !== 0) {
            moveCard(gameData.move.cardIndex, gameData.move.playerId);
            setCardPassedEventOccurred(false);
        }
    }, [gameData, cardPassedEventOccurred]);

    


    async function addCard() {
        socket.emit('addCard', { playerId: player1Id })
    }

    async function passCard(index) {
        socket.emit('passcard', { playerId: player1Id, cardIndex: index })
    }

    async function setColor(color) {
        socket.emit('playerChooseColor', { playerId: player1Id, color })
    }

    async function callUno() {
        socket.emit('callUno', { playerId: player1Id })
    }

    async function moveCard(index, player) {
        let ref, cardToMove;
        if (player === player1Id) {
            ref = player1CardsRef
            cardToMove = gameData.players[player1Id].cards[index];
        } else {
            ref = player2CardsRef
            cardToMove = gameData.players[player2Id].cards[index];
        }

        if(!ref.current[index]){
            return;
        }
        // Get the position of the playground card
        ref.current[index].className = 'playgroundCardImgStatic';
        const playgroundCardPosition = playgroundCardRef.current.getBoundingClientRect();
        const moveCardPosition = ref.current[index].getBoundingClientRect();
        const cardHeight = moveCardPosition.height;
        // console.log({playgroundCardPosition, moveCardPosition, calcY: cardHeight})

        // Calculate the transform property to move the card to the playground card's position
        const transformStyle = `translate(${playgroundCardPosition.left - moveCardPosition.left - 30}px, ${playgroundCardPosition.top - moveCardPosition.top -15}px)`;

        // Apply the transform style to the selected card
        ref.current[index].style.transform = transformStyle;

        // Wait for animations to complete
        await new Promise(resolve => setTimeout(resolve, 650));

        // Update the playground card
        setCurrentCard(gameData.currentCard);

        // Wait for a short time before removing the card from user1Cards
        await new Promise(resolve => setTimeout(resolve, 50));
        ref.current[index].remove()
        cardToMove.played = true
    }



    return (
        <main
            className='main'
            style={{
                backgroundImage: `url(../game-background1.jpeg)`,
            }}
        >
            <div className='contentContainer'>

                <div className='playerCardsContainer'>
                    {gameData?.players && gameData.players[player2Id]?.cards && (
                        <PlayerCards playerData={gameData.players[player2Id]} onCardClick={passCard} cardsRef={player2CardsRef} opponentCards={true} />
                    )}
                    <Player2Info canMove={player2canMove} />
                </div>

                <div className='playgroundContainer'>
                    <ChooseColor chooseColor={chooseColor} setColor={setColor} />
                    <PlaygroundCards addCard={addCard} playgroundCardRef={playgroundCardRef} currentCard={currentCard} />
                    <PlaygroundControls currentCard={currentCard} callUno={callUno} />
                </div>

                <div className='playerCardsContainer'>
                    <Player1Info canMove={player1canMove} />
                    {gameData?.players && gameData.players[player1Id]?.cards && (
                        <PlayerCards playerData={gameData.players[player1Id]} onCardClick={passCard} cardsRef={player1CardsRef} />
                    )}
                </div>
                    
                <GameResult gameEnded={gameEnded} won={wonGame} />

                <PlayerLeft playerLeft={playerLeft}/>

            </div>
        </main>
    );
}

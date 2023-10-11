
"use client"
import './styles.css';
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';


export default function Play(params) {
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

    const colorToBackgroundColor = {
        white: '#fff',
        yellow: '#ffaa01',
        red: '#ff5655',
        blue: '#5555ff',
        green: '#56aa56',
        wild: '#000'
      };

    useEffect(() => {
        const socketInstance = io.connect('http://localhost:8080/',);

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
            console.log('playerId ', id)
            socketInstance.emit('play', { playerId: id })

        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        socketInstance.on('cardsDealt', (data) => {
            // console.log('Cards dealt', data);
            setGameData(data)
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
        setCurrentCard(gameData.currentCard);
        // console.log(gameData)
    }, [gameData])

    useEffect(() => {
            setChooseColor(gameData?.players[player1Id]?.chooseColor)
        if (cardPassedEventOccurred && Object.keys(gameData.move).length !== 0) {
            // console.log(gameData.move)
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

    async function moveCard(index, player) {
        let ref, cardToMove;
        console.log(JSON.stringify(gameData))
        if (player === player1Id) {
            ref = player1CardsRef
            cardToMove = gameData.players[player1Id].cards[index];
        } else {
            ref = player2CardsRef
            cardToMove = gameData.players[player2Id].cards[index];
        }

        // Get the position of the playground card
        ref.current[index].className = 'playgroundCardImgStatic';
        const playgroundCardPosition = playgroundCardRef.current.getBoundingClientRect();
        const moveCardPosition = ref.current[index].getBoundingClientRect();

        // Calculate the transform property to move the card to the playground card's position
        const transformStyle = `translate(${playgroundCardPosition.left - moveCardPosition.left - 30}px, ${playgroundCardPosition.y - moveCardPosition.y - 10}px)`;

        // Apply the transform style to the selected card
        ref.current[index].style.transform = transformStyle;

        // Wait for animations to complete
        await new Promise(resolve => setTimeout(resolve, 750));

        // Update the playground card
        setCurrentCard(gameData.currentCard);

        // Wait for a short time before removing the card from user1Cards
        await new Promise(resolve => setTimeout(resolve, 50));
        ref.current[index].remove()
        cardToMove.played = true
    }

    async function setColor(color) {
        socket.emit('playerChooseColor', { playerId: player1Id, color })
    }

    async function callUno() {
        socket.emit('callUno', { playerId: player1Id })
    }


    return (
        <main
            className='main'
            style={{
                backgroundImage: `url(../game-background1.jpeg)`,
                backgroundSize: 'cover',
            }}
        >
            <div className='contentContainer'>
                <div className='playerCardsContainer'>
                    <div className='cardsContainer'>
                        {gameData?.players && gameData.players[player2Id]?.cards && (
                            gameData.players[player2Id].cards.map((el, index) => (
                                <img className={`cardImg top fadeIn ${el.played ? 'hidden' : ''}`}
                                    src='/cards/uno-card.svg' alt='123'
                                    key={index}
                                    ref={elem => player2CardsRef.current[index] = elem
                                    }></img>
                            )
                            )
                        )
                        }
                    </div>
                    <div className='playerInfoContainer'>
                        <div className='playerNameContainer'>
                            {player2canMove && (
                                <div className='canMove' style={{ marginRight: '0px', marginLeft: '10px' }}></div>
                            )}

                            <p>Player 2</p>
                        </div>
                        <div className='line'></div>
                    </div>
                </div>
                <div className='playgroundContainer'>
                    <div className='chooseColorContainer'>
                        {chooseColor && (
                            <div className='colorsGrid'>
                                <div className='colorWrap'>
                                    <div className='color' style={{ backgroundColor: '#ffaa01' }} onClick={() => setColor('yellow')}></div>
                                </div>
                                <div className='colorWrap'>
                                    <div className='color' style={{ backgroundColor: '#ff5655' }} onClick={() => setColor('red')}></div>
                                </div>
                                <div className='colorWrap'>
                                    <div className='color' style={{ backgroundColor: '#5555ff' }} onClick={() => setColor('blue')}></div>
                                </div>
                                <div className='colorWrap'>
                                    <div className='color' style={{ backgroundColor: '#56aa56' }} onClick={() => setColor('green')}></div>
                                </div>
                            </div>
                        )}

                    </div>
                    <div className='playgroundCards'>
                        <img onClick={addCard} className='addCardImgStatic' src="/cards/uno-card.svg" alt="green-7"></img>
                        <img
                            className='playgroundCardImgStatic'
                            id='playgroundCard'
                            ref={playgroundCardRef}
                            src={currentCard?.img || '/cards/empty-card.svg'}
                            alt={"playground-card"}
                        ></img>
                    </div>
                    <div className='playgroundControlsContainer'>
                        <div className='playgroundControls'>
                            <div className='colorWrap'>
                                <div className='color' style={{
                                    backgroundColor: colorToBackgroundColor[currentCard?.color] || '#000'
                                }}></div>
                            </div>
                            <div className='colorWrap'>
                                <div className='color' onClick={() => callUno()} style={{ backgroundColor: '#000' }}>
                                    <p>1</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='playerCardsContainer'>
                    <div className='playerInfoContainer'>
                        <div className='line' style={{ marginTop: '0', marginBottom: '5px' }}></div>
                        <div className='playerNameContainer'>
                            <p style={{ marginLeft: '10px', marginRight: 'auto' }}>Player 1</p>
                            {chooseColor && (<p style={{ marginLeft: '10px', marginRight: 'auto' }}>chooseColor</p>)}
                            {player1canMove && (
                                <div className='canMove'></div>
                            )}
                        </div>

                    </div>
                    <div className='cardsContainer'>
                        {gameData?.players && gameData.players[player1Id]?.cards && (
                            gameData.players[player1Id].cards.map((el, index) => (
                                <img
                                    className={`cardImg bottom fadeIn ${el.played ? 'hidden' : ''}`}
                                    src={el.img}
                                    alt='123'
                                    key={index}
                                    ref={elem => player1CardsRef.current[index] = elem}
                                    onClick={() => passCard(index)}
                                />
                            ))
                        )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

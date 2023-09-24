
"use client"
import './styles.css';
import React, { useState, useRef, createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';


export default function Play() {
    const [user1Cards, setUser1Cards] = useState([{
        "img": "/cards/blue-7-card.svg",
        nodeRef: createRef(null),
    },
    {
        "img": "/cards/red-3-card.svg",
        nodeRef: createRef(null),
    },
    {
        "img": "/cards/yellow-9-card.svg",
        nodeRef: createRef(null),
    },
    {
        "img": "/cards/wild-card.svg",
        nodeRef: createRef(null),
    },
    {
        "img": "/cards/green-draw-two-card.svg",
        nodeRef: createRef(null),
    }
    ])
    const [user2Cards, setUser2Cards] = useState([{
        "img": "/cards/red-5-card.svg"
    },
    {
        "img": "/cards/yellow-1-card.svg"
    },
    {
        "img": "/cards/green-7-card.svg"
    },
    {
        "img": "/cards/uno-card.svg"
    },
    {
        "img": "/cards/uno-card.svg"
    }
    ]);
    const [newlyAddedCardIndex, setNewlyAddedCardIndex] = useState()
    const [playgroundCard, setPlaygroundCard] = useState(null);
    const playgroundCardRef = useRef(null);
    const moveCardRef = useRef(null);
    const cardRefs = useRef([])
    const [selectedCardStyle, setSelectedCardStyle] = useState('none');


    async function addCard() {
        setUser1Cards([...user1Cards, {
            "img": "/cards/red-3-card.svg"
        }])
        setNewlyAddedCardIndex(user1Cards.length)
    }

    async function passCard(index) {
        const cardToMove = user1Cards[index];

        // Set the top card to the playgroundCard state



        // Get the position of the playground card
        cardRefs.current[index].className = 'playgroundCardImgStatic'
        const playgroundCardPosition = playgroundCardRef.current.getBoundingClientRect();
        const moveCardPosition = cardRefs.current[index].getBoundingClientRect();
        console.log(playgroundCardPosition)
        console.log(moveCardPosition)

        // Calculate the transform property to move the card to the playground card's position
        const transformStyle = `translate(${playgroundCardPosition.left - moveCardPosition.left - 30}px, ${playgroundCardPosition.y - moveCardPosition.y - 10}px)`;

        // Apply the transform style to the selected card
        // setSelectedCardStyle(transformStyle);
        cardRefs.current[index].style.transform = transformStyle
        await new Promise(resolve => setTimeout(resolve, 500));
        setPlaygroundCard(cardToMove);
        await new Promise(resolve => setTimeout(resolve, 50));
        cardRefs.current[index].remove()

        // await new Promise(resolve => setTimeout(resolve, 2000));
        // const moveCardPosition1 = cardRefs.current[index].getBoundingClientRect();
        // console.log(moveCardPosition1)

        // Remove the card from user1Cards
        // setUser1Cards(user1Cards.filter((_, i) => i !== index));
    }

    return (
        <main
            className='main'
            style={{
                backgroundImage: `url(game-background1.jpeg)`,
                backgroundSize: 'cover',
            }}
        >
            <div className='contentContainer'>
                <div className='playerCardsContainer'>
                    <div className='cardsContainer'>
                        {
                            user2Cards.map((el, index) => (<img className={`cardImg top`}
                                src={el.img} alt='123' key={index}></img>)
                            )
                        }
                    </div>
                </div>
                <div className='playgroundContainer'>
                    <div className='playgroundCards'>
                        <img onClick={addCard} className='addCardImgStatic' src="/cards/uno-card.svg" alt="green-7"></img>
                        <img
                            className='playgroundCardImgStatic'
                            id='playgroundCard'
                            ref={playgroundCardRef}
                            src={playgroundCard ? playgroundCard.img : "/cards/yellow-1-card.svg"}
                            alt={playgroundCard ? "playground-card" : "green-7"}
                        ></img>
                    </div>
                    <div className='playgroundControls'>

                    </div>
                </div>

                <div className='playerCardsContainer'>
                    <div className='cardsContainer'>
                        {
                            user1Cards.map((el, index) => (
                                <img
                                    className={`cardImg bottom`}
                                    src={el.img}
                                    alt='123'
                                    key={index}
                                    ref={el => cardRefs.current[index] = el}
                                    onClick={() => passCard(index)} // Pass the index to passCard
                                ></img>
                            ))
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

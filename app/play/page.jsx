
"use client"
import './styles.css';
import React, { useState, useRef, createRef, useEffect } from 'react';


export default function Play() {
    const [user1Cards, setUser1Cards] = useState([{
        "img": "/cards/blue-7-card.svg",
    },
    {
        "img": "/cards/red-3-card.svg",
    },
    {
        "img": "/cards/yellow-9-card.svg",
    },
    {
        "img": "/cards/wild-card.svg",
    },
    {
        "img": "/cards/green-draw-two-card.svg",
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
    const [playgroundCard, setPlaygroundCard] = useState(null);
    const playgroundCardRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        cardsRef.current = cardsRef.current.slice(0, user1Cards.length);
        console.log('useeffect', cardsRef.current)
     }, [user1Cards]);


    async function addCard() {
        setUser1Cards([...user1Cards, {
            "img": "/cards/red-3-card.svg"
        }])
        setNewlyAddedCardIndex(user1Cards.length)
    }

    async function passCard(index) {
        const cardToMove = user1Cards[index];
        if(cardToMove.played){
            return;
        }
        const oldStyle = cardsRef.current[index].className

        // Get the position of the playground card
        cardsRef.current[index].className = 'playgroundCardImgStatic';
        const playgroundCardPosition = playgroundCardRef.current.getBoundingClientRect();
        const moveCardPosition = cardsRef.current[index].getBoundingClientRect();

        // Calculate the transform property to move the card to the playground card's position
        const transformStyle = `translate(${playgroundCardPosition.left - moveCardPosition.left - 30}px, ${playgroundCardPosition.y - moveCardPosition.y - 10}px)`;

        // Apply the transform style to the selected card
        cardsRef.current[index].style.transform = transformStyle;
        // console.log(cardToMove)

        // Wait for animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update the playground card
        setPlaygroundCard(cardToMove);

        // Wait for a short time before removing the card from user1Cards
        await new Promise(resolve => setTimeout(resolve, 50));
        cardsRef.current[index].remove()
        // cardsRef.current = []
        cardsRef.current.splice(index, 1);
        cardToMove.played = true
        
        // console.log('new', updatedUser1Cards)


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
                                    ref={elem => cardsRef.current[index] = elem}
                                    onClick={() => passCard(index)} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

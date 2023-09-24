
"use client"
import './styles.css';
import React, { useState, useRef } from 'react';

export default function Play() {
    const [user1Cards, setUser1Cards] = useState([{
        "img": "/cards/blue-7-card.svg"
    },
    {
        "img": "/cards/red-3-card.svg"
    },
    {
        "img": "/cards/yellow-9-card.svg"
    },
    {
        "img": "/cards/wild-card.svg"
    },
    {
        "img": "/cards/green-draw-two-card.svg"
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


    async function addCard() {
        setUser1Cards([...user1Cards, {
            "img": "/cards/red-3-card.svg"
        }])
        setNewlyAddedCardIndex(user1Cards.length)

        const cardRect = event.target.getBoundingClientRect();
        const parentRect = event.target.parentElement.getBoundingClientRect();
        const left = cardRect.left - parentRect.left;
        const top = cardRect.top - parentRect.top;

        // Set the position of the clicked card
        setClickedCardPosition({ left, top });

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
                            user2Cards.map((el, index) => (<img className={`cardImg top ${index === newlyAddedCardIndex ? 'fadeIn' : ''}`}
                                src={el.img} alt='123' key={index}></img>)
                            )
                        }
                    </div>
                </div>
                <div className='playgroundContainer'>
                    <div className='playgroundCards'>
                        <img onClick={addCard} className='addCardImgStatic' src="/cards/uno-card.svg" alt="green-7"></img>
                        <img className='cardImgStatic' src="/cards/yellow-1-card.svg" alt="green-7"></img>
                    </div>
                </div>

                <div className='playerCardsContainer'>
                    <div className='cardsContainer'>
                        {
                            user1Cards.map((el, index) => (<img className={`cardImg bottom ${index === newlyAddedCardIndex ? 'fadeIn' : ''}`}
                                src={el.img} alt='123' key={index}></img>)
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

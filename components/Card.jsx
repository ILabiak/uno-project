import React, { useRef } from 'react';

function Card({ card, index, onCardClick, cardsRef, opponentCards }) {

  return (
    <img
      className={`cardImg ${opponentCards ? 'top' :'bottom'} fadeIn ${card.played ? 'hidden' : ''}`}
      src={opponentCards ? '/cards/uno-card.svg' :card.img}
      alt='123'
      key={index}
      ref={elem => cardsRef.current[index] = elem}
      onClick={() => onCardClick(index)}
    />
  );
}

export default Card;

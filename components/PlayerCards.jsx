import React, { useRef } from 'react';
import Card from './Card';

function PlayerCards({ playerData, onCardClick, cardsRef, opponentCards }) {

  return (
    <div className="cardsContainer">
      {playerData.cards.map((card, index) => (
        <Card key={index} card={card} index={index} onCardClick={onCardClick} cardsRef={cardsRef} opponentCards={opponentCards} />
      ))}
    </div>
  );
}

export default PlayerCards;

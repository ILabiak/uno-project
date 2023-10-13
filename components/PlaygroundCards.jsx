import React, { useRef } from 'react';

function PlaygroundCards({ addCard, playgroundCardRef, currentCard}) {

  return (
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
  );
}

export default PlaygroundCards;

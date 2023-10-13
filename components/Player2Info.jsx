import React from 'react';

function Player2Info({canMove }) {
  return (
    <div className='playerInfoContainer'>
    <div className='playerNameContainer'>
        {canMove && (
            <div className='canMove' style={{ marginRight: '0px', marginLeft: '10px' }}></div>
        )}
        <p>Player 2</p>
    </div>
    <div className='line'></div>
</div>
  );
}

export default Player2Info;

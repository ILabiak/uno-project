import React from 'react';

function Player1Info({canMove }) {
  return (
    <div className='playerInfoContainer'>
      <div className='line' style={{ marginTop: '0', marginBottom: '5px' }}></div>
      <div className='playerNameContainer'>
        <p style={{ marginLeft: '10px', marginRight: 'auto' }}>Player 1</p>
        {canMove && (
          <div className='canMove'></div>
        )}
      </div>
    </div>
  );
}

export default Player1Info;

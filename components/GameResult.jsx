import React from 'react';
import Backdrop from '@mui/material/Backdrop';

function GameResult({ gameEnded, won }) {

  return (
    <div>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={gameEnded}
        // onClick={handleClose}
      >
        <div className='gameResultContainer'>
            <span>
                {won? 'You have won the game!': 'You have lost the game!'}
            </span>
        </div>
      </Backdrop>
    </div>

  );
}

export default GameResult;

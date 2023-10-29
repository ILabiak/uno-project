import React from 'react';
import Backdrop from '@mui/material/Backdrop';

function PlayerLeft({ playerLeft }) {

  return (
    <div>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={playerLeft}
        // onClick={handleClose}
      >
        <div className='gameResultContainer'>
            <div className='playerLeftContainer'>
            <span>
                Player left the game
            </span>
            <a className='roomButton' href="/play">Back to rooms page</a>
            </div>
        </div>
      </Backdrop>
    </div>

  );
}

export default PlayerLeft;

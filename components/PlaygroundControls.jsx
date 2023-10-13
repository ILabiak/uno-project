import React, { useRef } from 'react';

function PlaygroundControls({ currentCard, callUno }) {

    const colorToBackgroundColor = {
        white: '#fff',
        yellow: '#ffaa01',
        red: '#ff5655',
        blue: '#5555ff',
        green: '#56aa56',
        wild: '#000'
    };

    return (
        <div className='playgroundControlsContainer'>
            <div className='playgroundControls'>
                <div className='colorWrap'>
                    <div className='color' style={{
                        backgroundColor: colorToBackgroundColor[currentCard?.color] || '#000'
                    }}></div>
                </div>
                <div className='colorWrap'>
                    <div className='colorUno' onClick={() => callUno()} style={{ backgroundColor: '#000' }}>
                        <p>1</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaygroundControls;

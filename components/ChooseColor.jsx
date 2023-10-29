import React from 'react';

function ChooseColor({ chooseColor, setColor }) {

  return (
    <div className='chooseColorContainer'>
    {chooseColor && (
        <div className='colorsGrid'>
            <div className='colorWrap'>
                <div className='color' style={{ backgroundColor: '#ffaa01' }} onClick={() => setColor('yellow')}></div>
            </div>
            <div className='colorWrap'>
                <div className='color' style={{ backgroundColor: '#ff5655' }} onClick={() => setColor('red')}></div>
            </div>
            <div className='colorWrap'>
                <div className='color' style={{ backgroundColor: '#5555ff' }} onClick={() => setColor('blue')}></div>
            </div>
            <div className='colorWrap'>
                <div className='color' style={{ backgroundColor: '#56aa56' }} onClick={() => setColor('green')}></div>
            </div>
        </div>
    )}
</div>
  );
}

export default ChooseColor;

import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from '../../assets/brain.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='ma4 mt0'>
        <Tilt className='Tilt br2 shadow-2' style={{ width: '100px' }}>
            <div className='Tilt-inner pa3'>
                <img alt='logo' src={brain} />
            </div>
        </Tilt>
    </div>
  )
}

export default Logo
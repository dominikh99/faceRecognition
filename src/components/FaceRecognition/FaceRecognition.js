import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className='center'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
        {
          box.map((box, i) => <div key={i} className='bounding-box' style={{ top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>)
        }
    </div>
  )
}

export default FaceRecognition
import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
        <p className='f3'>
            {'This app detects faces in your pictures.'}
        </p>
        <div className='center'>
            <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center br3 input' type='text' onChange={onInputChange} />
                <button className='w-30 growf4 link ph3 pv2 dib white br3 button' onClick={onButtonSubmit}>Detect</button>
            </div>
        </div>
    </div>
  )
}

export default ImageLinkForm
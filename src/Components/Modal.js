import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='box-ctn'>
        <p>{message}</p>
        <button className='modal-close-btn' onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

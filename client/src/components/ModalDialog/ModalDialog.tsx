import React from 'react';
import ReactDOM from 'react-dom';

import Button from '../Button';

import styles from './ModalDialog.module.css';

type ModalProps = {
  displayed: boolean;
  onClose: () => void;
};

const ModalDialog: React.FC<ModalProps> = ({
  displayed,
  onClose,
  children
}) => {
  const wrapperClassName = [
    styles.modalWrapper,
    displayed ? styles.displayed : styles.hidden
  ].join(' ');

  return ReactDOM.createPortal(
    <div className={wrapperClassName}>
      <div
        className={styles.scrim}
        onClick={e => {
          if ((e.target as HTMLElement).className.includes('_scrim__')) {
            onClose();
          }
        }}
      >
        <div className={styles.modal}>
          <Button onClick={onClose}>X</Button>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </div>
    </div>,
    // Render inside the top-level modal container element
    document.getElementById('modal-container') as HTMLElement
  );
};

export default ModalDialog;

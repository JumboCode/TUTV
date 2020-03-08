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
      <div className={styles.scrim}>
        <Button onClick={onClose}>Close modal</Button>
        <div className={styles.dialog}>{children}</div>
      </div>
    </div>,
    // Render inside the top-level modal container element
    document.getElementById('modal-container') as HTMLElement
  );
};

export default ModalDialog;

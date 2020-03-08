import React from 'react';
import ReactDOM from 'react-dom';

import styles from './ModalDialog.module.css';

type ModalProps = {
  displayed: boolean;
  onClose: () => void;
};

const ModalDialog: React.FC<ModalProps> = ({ displayed, children }) => {
  const wrapperClassName = [
    styles.modalWrapper,
    displayed ? styles.displayed : styles.hidden
  ].join(' ');

  return ReactDOM.createPortal(
    <div className={wrapperClassName}>
      <div className={styles.scrim}>
        <div className={styles.dialog}>{children}</div>
      </div>
    </div>,
    // Render inside the top-level modal container element
    document.getElementById('modal-container') as HTMLElement
  );
};

export default ModalDialog;

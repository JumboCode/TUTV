import React from 'react';
import ReactDOM from 'react-dom';

import { X as XIcon } from 'react-feather';
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
  return ReactDOM.createPortal(
    <div
      className={`
        ${styles.modalWrapper}
        ${styles[displayed ? 'displayed' : 'hidden']}
      `}
    >
      <div
        className={styles.scrim}
        onClick={({ target }) => {
          // Automatically hide the modal when users click on the scrim
          try {
            if ((target as HTMLElement).className.includes('scrim')) onClose();
          } catch {}
        }}
      >
        <div className={styles.modal}>
          <Button pill onClick={onClose}>
            <XIcon size={26} color="black" style={{ display: 'block' }} />
          </Button>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </div>
    </div>,
    // Render inside the top-level modal container element
    document.getElementById('modal-container') as HTMLElement
  );
};

export default ModalDialog;

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
  const wrapperClassName = [
    styles.modalWrapper,
    displayed ? styles.displayed : styles.hidden
  ].join(' ');

  return ReactDOM.createPortal(
    <div className={wrapperClassName}>
      <div
        className={styles.scrim}
        onClick={e => {
          const classname = (e.target as HTMLElement).className.toString();
          if (classname.includes('scrim')) onClose();
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

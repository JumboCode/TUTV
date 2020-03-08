import React from 'react';

import styles from './Button.module.css';

type ModalProps = {
  displayed: boolean;
  onClose: () => void;
};

const ModalDialog: React.FC<ModalProps> = ({ displayed, children }) => {
  return (
    <div className="scrim">
      <div className="dialog">{children}</div>
    </div>
  );
};

export default ModalDialog;

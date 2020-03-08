import React, { useState } from 'react';
import Modal from '../../components/ModalDialog';
import Button from '../../components/Button';

const Home: React.FC = () => {
  const [modalDisplayed, setModalDisplayed] = useState(false);

  return (
    <div>
      <h1>Home page</h1>

      {/* Example modal usage */}

      <Button onClick={() => setModalDisplayed(true)}>Display modal</Button>

      <Modal
        displayed={modalDisplayed}
        onClose={() => setModalDisplayed(false)}
      >
        <p>
          This is modal content. Whatever you put here will appear inside the
          modal dialog.
        </p>
        <p>You can put whatever you want here. Here's a button component:</p>
        <Button variant="gray">I'm a button!</Button>
        <p>
          Modal state is controlled by the parent component. For example,
          clicking{' '}
          <span
            onClick={() => setModalDisplayed(false)}
            style={{ color: '#3279d5', cursor: 'pointer' }}
          >
            here
          </span>{' '}
          will close the modal.
        </p>
      </Modal>
    </div>
  );
};

export default Home;

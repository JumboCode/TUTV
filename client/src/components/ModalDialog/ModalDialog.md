### Basic modal
In the example below, clicking the "Display modal" button will open a
full-screen modal dialog.

```jsx
import { useState } from 'react';

import Button from 'components/Button';
import Modal from './ModalDialog.tsx';

function ExampleComponent() {
  const [modalDisplayed, setModalDisplayed] = useState(false);
  return (
    <div>
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
  )
}

<React.Fragment>
  Click this button to open the modal:<br/><br/>
  <ExampleComponent />
</React.Fragment>
```

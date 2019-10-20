import React, { useState } from "react";
import './Button.css';

const Button: React.FC = () => {
  const [validation, setValidation] = useState(false);

  return (
	<div className="submit-button">
		<button type="submit" className="button-primary" onClick={() => setValidation(true)}>
			Submit
		</button>
	</div>
  );
};

export default Button;
import React, { useState } from 'react';
import CopyToClipboardButton from './CopyToClipboardButton';

const PasswordItem = ({ passwordEntry }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <div>
      {passwordEntry.url}: {isPasswordVisible ? passwordEntry.password : '•••••'}
      <button onClick={() => setPasswordVisible(!isPasswordVisible)}>
        {isPasswordVisible ? 'Hide' : 'Show'}
      </button>
      <CopyToClipboardButton text={passwordEntry.password} />
    </div>
  );
};

export default PasswordItem;

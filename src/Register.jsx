import axios from 'axios';
import { useState } from 'react';

function Register() {
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [verifyPasswordState, setVerifyPasswordState] = useState('');
    const [errorMsgState, setErrorMsgState] = useState('');
  

    async function onSubmit() {
      setErrorMsgState('')
      // verify password
      if(verifyPasswordState !== passwordState) {
        setErrorMsgState('Please verify passwords are the same :)')
        return;
      }

      try {
        await axios.post('/api/users/register', {
            username: usernameState,
            password: passwordState,
        });

        setPasswordState('');
        setUsernameState('');
      } catch (error) {
          setErrorMsgState(error.response.data);
      }
    }
  
    function updatePassword(event) {
        setPasswordState(event.target.value);
    }

    function updateVerifyPassword(event) {
        setVerifyPasswordState(event.target.value);
    }
  
    function updateUsername(event) {
        setUsernameState(event.target.value);
    }

  
    return (
      <div>
            <h1>Register Page</h1>
          {errorMsgState && <h1>
              {errorMsgState}
          </h1>}

          <div>
              <div>
                  <label>Username:</label> <input value={usernameState} onInput={(event) => updateUsername(event)}/>
              </div>
              <div>
                  <label>Password:</label> <input value={passwordState} onInput={(event) => updatePassword(event)}/>
              </div>
              <div>
                  <label>Verify Password:</label> <input value={verifyPasswordState} onInput={(event) => updateVerifyPassword(event)}/>
              </div>
              <div>
                  <button onClick={() => onSubmit()}>Submit</button>
              </div>
          </div>
      </div>
    )
  }
  
  export default Register;
  
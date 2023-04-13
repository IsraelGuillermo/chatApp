import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Box, Button } from '@material-ui/core';
export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
  const { setLoggedInUser, setId } = useContext(UserContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    const { data } = await axios.post(url, { username, password });

    setLoggedInUser(username);
    setId(data._id);
  };

  return (
    <Box className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='username'
          className='block w-full rounded-sm p-2 mb-2 border'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='password'
          className='block w-full rounded-sm p-2 mb-2 border'
        />
        <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </button>
        <Box className='text-center mt-2'>
          {isLoginOrRegister === 'register' ? (
            <Box style={{ display: 'flex' }}>
              <Box style={{ marginRight: 8 }}>Already a member?</Box>

              <button onClick={() => setIsLoginOrRegister('login')}>
                Login here
              </button>
            </Box>
          ) : (
            <Box style={{ display: 'flex' }}>
              <Box style={{ marginRight: 8 }}>Dont have an account?</Box>
              <button onClick={() => setIsLoginOrRegister('register')}>
                Register
              </button>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
}

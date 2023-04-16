import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Box, TextField, Button, Typography } from '@material-ui/core';

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameTaken, setUsernameTake] = useState(false);
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const { setLoggedInUser, setId } = useContext(UserContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    if (username !== '' && password !== '') {
      try {
        const { data } = await axios.post(url, { username, password });
        setLoggedInUser(username);
        setId(data._id);
      } catch (e: any) {
        e.response.data.message === 'User already exists' &&
          setUsernameTake(true);

        e.response.data.message === 'Incorrect Username or Password.' &&
          setIncorrectLogin(true);
      }
    } else {
      if (password === '') {
        setPasswordError(true);
      }
      if (username === '') {
        setUsernameError(true);
      }
    }
  };

  return (
    <Box className='bg-blue-50 h-screen flex items-center'>
      <form className='w-72 mx-auto mb-12' onSubmit={handleSubmit}>
        {incorrectLogin && (
          <Box className='text-center mb-4'>
            <Typography variant='body1' color='error'>
              Incorrect Username or Password.{' '}
            </Typography>
          </Box>
        )}
        <TextField
          error={usernameError || usernameTaken}
          variant='outlined'
          size='medium'
          fullWidth
          style={{ padding: 2, marginBottom: 8 }}
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='username'
          helperText={
            usernameError && username === ''
              ? 'Username Cannot be Empty'
              : '' || (usernameTaken && 'User already exists')
          }
        />
        <TextField
          error={passwordError}
          variant='outlined'
          style={{ padding: 2, marginBottom: 8 }}
          fullWidth
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='password'
          helperText={
            passwordError && password === '' ? 'Password Cannot be Empty' : ''
          }
        />
        <Button fullWidth color='primary' variant='contained' type='submit'>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </Button>
        <Box className='text-center mt-2'>
          {isLoginOrRegister === 'register' ? (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box style={{ marginRight: 8 }}>Already a member?</Box>

              <Button
                variant='text'
                onClick={() => setIsLoginOrRegister('login')}
              >
                Login here
              </Button>
            </Box>
          ) : (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box style={{ marginRight: 8 }}>Dont have an account?</Box>
              <Button
                variant='text'
                onClick={() => setIsLoginOrRegister('register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </form>
    </Box>
  );
}

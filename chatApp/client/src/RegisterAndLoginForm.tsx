import { FormEvent, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Box, TextField, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0'
  },
  input: {
    background: theme.palette.common.white
  },
  form: {
    width: '18rem',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '3.5rem'
  },
  errorContainer: {
    marginBottom: '1rem',
    textAlign: 'center'
  },
  textInput: {
    padding: 2,
    marginBottom: 8
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  typography: {
    marginRight: 8
  },
  welcomeContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(5)
  },
  welcomeTypography: {
    fontWeight: 900
  }
}));

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameTaken, setUsernameTake] = useState(false);
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const { setLoggedInUser, setId } = useContext(UserContext);
  const classes = useStyles();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <Box className={classes.container}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Box className={classes.welcomeContainer}>
          <Typography variant='h5' className={classes.welcomeTypography}>
            Welcome To ChatAPP Register or Login to chat with a stranger
          </Typography>
        </Box>
        {incorrectLogin && (
          <Box className={classes.errorContainer}>
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
          className={classes.textInput}
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='username'
          helperText={
            usernameError && username === ''
              ? 'Username Cannot be Empty'
              : '' || (usernameTaken && 'User already exists')
          }
          InputProps={{ className: classes.input }}
        />
        <TextField
          error={passwordError}
          variant='outlined'
          className={classes.textInput}
          fullWidth
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='password'
          helperText={
            passwordError && password === '' ? 'Password Cannot be Empty' : ''
          }
          InputProps={{ className: classes.input }}
        />
        <Button fullWidth color='primary' variant='contained' type='submit'>
          {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
        </Button>
        <Box className='text-center mt-2'>
          {isLoginOrRegister === 'register' ? (
            <Box className={classes.messageContainer}>
              <Typography className={classes.typography}>
                Already a member?
              </Typography>

              <Button
                variant='text'
                onClick={() => setIsLoginOrRegister('login')}
              >
                Login here
              </Button>
            </Box>
          ) : (
            <Box className={classes.messageContainer}>
              <Typography className={classes.typography}>
                Dont have an account?
              </Typography>
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

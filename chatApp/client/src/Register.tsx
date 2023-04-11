import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setLoggedInUser, setId } = useContext(UserContext);
  const register: React.FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const { data } = await axios.post('/register', { username, password });

    setLoggedInUser(username);
    setId(data._id);
  };

  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={register}>
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
          Register
        </button>
      </form>
    </div>
  );
}

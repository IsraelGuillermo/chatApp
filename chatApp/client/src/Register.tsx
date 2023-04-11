import { useState } from 'react';
import axios from 'axios';
export default function Register() {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register: React.FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    await axios.post('/register', { userName, password });
  };

  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12' onSubmit={register}>
        <input
          type='text'
          value={userName}
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

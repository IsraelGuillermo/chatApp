import { useState } from 'react';

export default function Register() {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className='bg-blue-50 h-screen flex items-center'>
      <form className='w-64 mx-auto mb-12'>
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

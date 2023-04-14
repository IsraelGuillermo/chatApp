import Avatar from './Avatar';
import { Box } from '@material-ui/core';

export default function Contact({
  id,
  onClick,
  selected,
  username,
  online
}: any) {
  return (
    <Box
      className={`border-b border-gray-100 flex items-center gap-3 cursor-pointer ${
        selected ? 'bg-blue-50' : ''
      }`}
      key={id}
      onClick={() => onClick(id)}
    >
      {selected && <Box className='w-1 h-14 bg-blue-500 rounded-r-md'></Box>}
      <Box className='py-2 pl-4 gap-2 flex items-center'>
        <Avatar online={online} userId={id} username={username[0]} />
        <Box className='text-grey-700'>{username}</Box>
      </Box>
    </Box>
  );
}

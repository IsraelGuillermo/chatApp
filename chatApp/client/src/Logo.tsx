import { Box } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
export default function Logo() {
  return (
    <Box className='text-blue-600 font-bold flex gap-2 p-4'>
      <ChatIcon />
      ChatApp
    </Box>
  );
}

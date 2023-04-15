import { Box } from '@material-ui/core';

export default function UnselectedState() {
  return (
    <Box className='h-full flex items-center justify-center'>
      <Box className='text-gray-400'>
        &larr; Select A Person From the Sidebar
      </Box>
    </Box>
  );
}

import { Box } from '@material-ui/core';

export default function Avatar({ userId, username, online }: any) {
  const colors = [
    'bg-purple-200',
    'bg-red-200',
    'bg-green-200',
    'bg-orange-200',
    'bg-blue-200',
    'bg-yellow-200',
    'bg-teal-200'
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <Box
      className={`w-10 h-10 relative rounded-full flex items-center ${color} shadow-sm shadow-black`}
    >
      <Box className='w-full text-center opacity-70'>
        {username}
        {online && (
          <Box className='w-3 h-3 absolute bg-green-500 right-0 bottom-0 rounded-full border border-white shadow-md shadow-black'></Box>
        )}
        {!online && (
          <Box className='w-3 h-3 absolute bg-gray-500 right-0 bottom-0 rounded-full border border-white shadow-md shadow-black'></Box>
        )}
      </Box>
    </Box>
  );
}

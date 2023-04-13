import { Box } from '@material-ui/core';

export default function Avatar({ userId, username }: any) {
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
    <Box className={`w-10 h-10 rounded-full flex items-center ${color}`}>
      <Box className='w-full text-center opacity-70'>{username[0]}</Box>
    </Box>
  );
}

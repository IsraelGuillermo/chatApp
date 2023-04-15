import axios from 'axios';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Box } from '@material-ui/core';

export default function MessageBubble({ file, text, sender, messageId }: any) {
  return (
    <Box key={messageId} className={`${sender ? 'text-right' : 'text-left'}`}>
      <Box
        className={`text-left inline-block p-2 my-2 rounded-lg text-sm ${
          sender ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'
        }`}
      >
        {file ? (
          <Box>
            <AttachFileIcon
              style={{
                transform: 'rotate(45deg)',
                marginRight: 4
              }}
            />
            <a
              className='underline'
              target='blank'
              href={axios.defaults.baseURL + '/uploads/' + file}
            >
              {file}
            </a>
          </Box>
        ) : (
          text
        )}
      </Box>
    </Box>
  );
}

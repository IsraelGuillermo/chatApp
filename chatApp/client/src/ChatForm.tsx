import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import { TextField, Button } from '@material-ui/core';

export default function ChatForm({
  onSubmit,
  onFileChange,
  value,
  onTextChange
}: any) {
  return (
    <form className='flex gap-2' onSubmit={onSubmit}>
      <TextField
        variant='outlined'
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        type='text'
        className='bg-white border p-2 flex-grow rounded-sm'
        placeholder='Type your message here'
      />
      <label className='bg-blue-200 p-2 text-grey-200 rounded-sm border-blue-200 cursor-pointer flex items-center justify-center h-14 w-14'>
        <input type='file' className='hidden' onChange={onFileChange} />
        <AttachFileIcon style={{ transform: 'rotate(45deg)' }} />
      </label>
      <Button variant='contained' color='primary' type='submit'>
        <SendIcon />
      </Button>
    </form>
  );
}

import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import { TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    margin: 2
  },
  textField: {
    marginRight: theme.spacing(1),
    flexGrow: 1,
    backgroundColor: theme.palette.common.white,
    borderRadius: 8
  },
  typography: {
    fontWeight: 'bolder',
    fontSize: 24
  },
  attachment: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(0.5),
    cursor: 'pointer',
    marginRight: theme.spacing(1),
    color: 'whitesmoke',
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    }
  },
  input: {
    display: 'none'
  },
  icon: {
    transform: 'rotate(45deg)'
  }
}));

interface Props {
  onSubmit: (e: any, file?: any) => Promise<void>;
  value: string;
  onTextChange: (value: string) => void;
  onFileChange: (e: any) => void;
  isMessageEmpty: boolean;
  setIsMessageEmpty: (value: boolean) => void;
}

export default function ChatForm({
  onSubmit,
  onFileChange,
  value,
  onTextChange,
  isMessageEmpty,
  setIsMessageEmpty
}: Props) {
  const classes = useStyles();
  return (
    <form className={classes.container} onSubmit={onSubmit}>
      <TextField
        error={isMessageEmpty}
        helperText={isMessageEmpty === true ? 'Message cannot be empty' : ''}
        variant='outlined'
        value={value}
        onChange={(e) => {
          setIsMessageEmpty(false);
          onTextChange(e.target.value);
        }}
        type='text'
        className={classes.textField}
        placeholder='Type your message here...'
      />
      <label className={classes.attachment}>
        <input type='file' className={classes.input} onChange={onFileChange} />
        <AttachFileIcon className={classes.icon} />
      </label>
      <Button variant='contained' color='secondary' type='submit'>
        <SendIcon />
      </Button>
    </form>
  );
}

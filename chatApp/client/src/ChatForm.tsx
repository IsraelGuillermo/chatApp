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
    backgroundColor: theme.palette.common.white
  },
  typography: {
    fontWeight: 'bolder',
    fontSize: 24
  },
  attachment: {
    padding: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(0.5),
    cursor: 'pointer',
    color: theme.palette.common.white,
    marginRight: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
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
  onSubmit: () => void;
  value: string;
  onTextChange: (value: string) => void;
  onFileChange: () => void;
}

export default function ChatForm({
  onSubmit,
  onFileChange,
  value,
  onTextChange
}: Props) {
  const classes = useStyles();
  return (
    <form className={classes.container} onSubmit={onSubmit}>
      <TextField
        variant='outlined'
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        type='text'
        className={classes.textField}
        placeholder='Type your message here'
      />
      <label className={classes.attachment}>
        <input type='file' className={classes.input} onChange={onFileChange} />
        <AttachFileIcon className={classes.icon} />
      </label>
      <Button variant='contained' color='primary' type='submit'>
        <SendIcon />
      </Button>
    </form>
  );
}

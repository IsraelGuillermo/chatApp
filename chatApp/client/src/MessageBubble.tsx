import axios from 'axios';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
const useStyles = makeStyles((theme) => ({
  textRight: {
    textAlign: 'right'
  },
  textLeft: { textAlign: 'left' },
  icon: {
    transform: 'rotate(45deg)',
    marginRight: 4
  },
  typography: {
    fontWeight: 'bolder',
    fontSize: 24
  },
  alternateMessageBubble: {
    textAlign: 'left',
    display: 'inline-block',
    padding: 4,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 2,
    marginBottom: 2,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    color: theme.palette.common.black
  },
  messageBubble: {
    backgroundColor: '#FA9884',
    color: 'whitesmoke'
  }
}));

interface Props {
  file: any;
  text?: string;
  sender: boolean;
  messageId: number;
}

export default function MessageBubble({
  file,
  text,
  sender,
  messageId
}: Props) {
  const classes = useStyles();
  return (
    <Box
      key={messageId}
      className={classNames({ [classes.textLeft]: !sender }, classes.textRight)}
    >
      <Box
        className={classNames(
          { [classes.messageBubble]: sender },
          classes.alternateMessageBubble
        )}
      >
        {file ? (
          <Box>
            <AttachFileIcon className={classes.icon} />
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

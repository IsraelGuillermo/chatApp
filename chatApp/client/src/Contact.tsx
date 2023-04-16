import Avatar from './Avatar';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
const useStyles = makeStyles((theme) => ({
  container: {
    borderBottom: 'whitesmoke solid 1px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  selected: {
    backgroundColor: '#3C486B',
    color: 'whitesmoke'
  },
  selectedBar: {
    width: theme.spacing(0.5),
    height: '3.5rem',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: '#F45050'
  },
  avatarContainer: {
    paddingTop: '.5rem',
    paddingBottom: '.5rem',
    paddingLeft: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  username: {
    color: 'black'
  }
}));
interface Props {
  id: string;
  onClick: (value: string) => void;
  selected: boolean;
  username: string;
  online: boolean;
}

export default function Contact({
  id,
  onClick,
  selected,
  username,
  online
}: Props) {
  const classes = useStyles();
  return (
    <Box
      className={classNames(
        { [classes.selected]: selected },
        classes.container
      )}
      key={id}
      onClick={() => onClick(id)}
    >
      {selected && <Box className={classes.selectedBar}></Box>}
      <Box className={classes.avatarContainer}>
        <Avatar online={online} userId={id} username={username[0]} />
        <Box className={classNames({ [classes.username]: !selected })}>
          {username}
        </Box>
      </Box>
    </Box>
  );
}

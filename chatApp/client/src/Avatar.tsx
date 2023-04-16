import { Box } from '@material-ui/core';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '2.5rem',
    height: '2.5rem',
    position: 'relative',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    border: 'whitesmoke solid 1px',
    marginRight: 4
  },
  status: {
    width: '.8rem',
    height: '.8rem',
    position: 'absolute',
    borderRadius: '50%',
    border: 'whitesmoke solid 1px',
    bottom: 0,
    right: 0
  },
  statusOnline: {
    backgroundColor: theme.palette.success.main
  },
  statusOffline: {
    backgroundColor: theme.palette.action.disabled
  },
  avatarText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
}));

interface Props {
  userId: string;
  username: string;
  online: boolean;
}

export default function Avatar({ userId, username, online }: Props) {
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
  const classes = useStyles();
  return (
    <Box className={classNames(classes.container, `${color}`)}>
      <Box className={classes.avatarText}>
        {username}

        <Box
          className={classNames(
            { [classes.statusOnline]: online },
            { [classes.statusOffline]: !online },
            classes.status
          )}
        />
      </Box>
    </Box>
  );
}

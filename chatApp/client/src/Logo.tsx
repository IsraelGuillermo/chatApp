import { Box } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    color: theme.palette.primary.main,
    display: 'flex',
    padding: '1rem',
    alignItems: 'center'
  },
  icon: {
    marginRight: 8
  },
  typography: {
    fontWeight: 'bolder',
    fontSize: 24
  }
}));
export default function Logo() {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <ChatIcon className={classes.icon} />
      <Box className={classes.typography}>ChatApp</Box>
    </Box>
  );
}

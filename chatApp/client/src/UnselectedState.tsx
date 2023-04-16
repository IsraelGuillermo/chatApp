import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export default function UnselectedState() {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Typography color='textSecondary'>
        <ArrowBackIcon />
        Select A Person From the Sidebar
      </Typography>
    </Box>
  );
}

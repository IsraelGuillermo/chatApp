import { useContext } from 'react';
import Register from './Register';
import { UserContext } from './UserContext';

export default function Routes() {
  const { loggedInUser, id } = useContext(UserContext);

  if (loggedInUser) {
    return 'logged in!';
  }
  return <Register />;
}

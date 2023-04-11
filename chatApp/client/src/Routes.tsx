import { useContext } from 'react';
import Chat from './Chat';
import RegisterAndLoginForm from './RegisterAndLoginForm';
import { UserContext } from './UserContext';

export default function Routes() {
  const { loggedInUser, id } = useContext(UserContext);

  if (loggedInUser) {
    return <Chat />;
  }
  return <RegisterAndLoginForm />;
}

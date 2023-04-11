import { useContext } from 'react';
import RegisterAndLoginForm from './RegisterAndLoginForm';
import { UserContext } from './UserContext';

export default function Routes() {
  const { loggedInUser, id } = useContext(UserContext);

  if (loggedInUser) {
    return <div>logged In {loggedInUser}</div>;
  }
  return <RegisterAndLoginForm />;
}

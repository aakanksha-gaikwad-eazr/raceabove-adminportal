import { AuthProvider } from '../../../context/authProvider';
import RegisterView from './RegisterView';

export default function RegisterWithJWT() {
  return <AuthProvider>
      <RegisterView />
    </AuthProvider>;
}

import { AuthProvider } from '../../../context/authProvider';
import RegisterView from './RegisterView';

export default function RegisterWithFirebase() {
  return <AuthProvider>
      <RegisterView />
    </AuthProvider>;
}
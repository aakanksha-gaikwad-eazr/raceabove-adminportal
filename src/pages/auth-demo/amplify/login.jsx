import { AuthProvider } from '../../../context/authProvider';
import LoginView from './LoginView';
export default function LoginWithAmplify() {
  return <AuthProvider>
      <LoginView />
    </AuthProvider>;
}
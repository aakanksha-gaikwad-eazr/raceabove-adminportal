import { AuthProvider } from '../../../context/authProvider'
import LoginView from './LoginView';
export default function LoginWithFirebase() {
  return <AuthProvider>
      <LoginView />
    </AuthProvider>;
} 
import { AuthProvider } from '@/context/authProvider';

import LoginView from './LoginView';
export default function LoginWithAuth0() {
  return <AuthProvider>
      <LoginView />
    </AuthProvider>;
}

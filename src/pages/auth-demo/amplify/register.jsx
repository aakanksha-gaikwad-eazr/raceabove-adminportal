// import { AuthProvider } from '../../../context/jwtContext';

import { AuthProvider } from '../../../context/authProvider';
import RegisterView from './RegisterView';
export default function RegisterWithAmplify() {
  return <AuthProvider>
      <RegisterView />
    </AuthProvider>;
}
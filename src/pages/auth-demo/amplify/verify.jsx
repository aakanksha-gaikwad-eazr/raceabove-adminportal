import { AuthProvider } from '../../../context/authProvider';
import VerifyView from './VerifyView';

export default function VerifyWithAmplify() {
  return <AuthProvider>
      <VerifyView />
    </AuthProvider>;
}
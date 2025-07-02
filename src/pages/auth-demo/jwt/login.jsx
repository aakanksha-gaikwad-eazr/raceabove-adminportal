import AuthContext from '../../../context/jwtContext';
import LoginView from './LoginView';

export default function LoginWithJWT() {
  return <AuthContext.Provider>
      <LoginView />
    </AuthContext.Provider>;
}
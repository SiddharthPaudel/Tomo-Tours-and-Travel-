import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const mode = searchParams.get('mode'); // Firebase sets this automatically
  const oobCode = searchParams.get('oobCode'); // The secret security code

  useEffect(() => {
    switch (mode) {
      case 'resetPassword':
        navigate(`/reset-password?oobCode=${oobCode}`);
        break;
      case 'verifyEmail':
        navigate(`/verify-email?oobCode=${oobCode}`);
        break;
      default:
        navigate('/login');
    }
  }, [mode, oobCode, navigate]);

  return null; // Or a simple loading spinner
};

export default AuthHandler;
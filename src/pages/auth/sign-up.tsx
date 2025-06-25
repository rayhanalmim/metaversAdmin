import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserAuthForm } from './components/user-auth-form';
import { Bot, ArrowLeft } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sign-in since admin dashboard doesn't need user registration
    navigate('/sign-in', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}

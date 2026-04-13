import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Auth Form */}
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          Secure, reliable, and easy to use
        </p>
      </div>
    </div>
  );
}

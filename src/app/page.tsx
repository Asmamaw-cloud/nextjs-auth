'use client';

import { useState } from 'react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import MfaSetup from './mfa/page';

export default function MainPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [totp, setTotp] = useState('');
  const [mfaVerified, setMfaVerified] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      setUserId(res.data.userId);

      // const mfaCheck = await axios.post('/api/auth/mfa/check', { userId: res.data.userId });
      // if (mfaCheck.data.mfaEnabled) setMfaRequired(true);
      // else setMfaVerified(true);
    } catch (err) {
      console.error("Error happened", err);
    }
  };

  const handleVerifyMfa = async () => {
    try {
      const res = await axios.post('/api/auth/mfa/verify', { userId, token: totp });
      if (res.data.verified) {
        setMfaVerified(true);
        setMfaRequired(false);
        alert('MFA verified! Fully logged in.');
      } else {
        alert('Invalid MFA token.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    try {
      const res = await axios.post('/api/auth/refresh');
      console.log("response from refresh route: ", res)
      setAccessToken(res.data.accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    signIn(provider);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">
          Authentication Demo
        </h1>

        {!accessToken && !session ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Email Login</h2>
            <input
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mb-6"
              onClick={handleLogin}
            >
              Login
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Or Social Login</h2>
            <div className="flex justify-between gap-4">
              <button
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                onClick={() => handleSocialLogin('google')}
              >
                Google
              </button>
              <button
                className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
                onClick={() => handleSocialLogin('github')}
              >
                GitHub
              </button>
            </div>
          </>
        ) : mfaRequired && !mfaVerified ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Enter MFA Code</h2>
            <input
              className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="123456"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
            />
            <button
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              onClick={handleVerifyMfa}
            >
              Verify
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-center overflow-x-auto">
              {accessToken
                ? `Access Token: ${accessToken}`
                : `Logged in as ${session?.user?.email} (${session?.user?.provider})`}
            </p>
            {accessToken && (
              <button
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition mb-4"
                onClick={handleRefresh}
              >
                Refresh Token
              </button>
            )}

            <h2 className="text-xl font-semibold mb-4 text-center">MFA Setup</h2>
            {accessToken && <MfaSetup userId={userId} />}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, User, X } from 'lucide-react';
import { authenticateLocalAccount } from '../utils/storage';
import { GrovepathEmblem } from './PixelSprites';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticate: (payload: {
    displayName: string;
    groveName: string;
    isLoginMode: boolean;
  }) => void;
}

export function AuthModal({ open, onClose, onAuthenticate }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [groveName, setGroveName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setShowPassword(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = authenticateLocalAccount(mode, {
      name,
      password,
      groveName,
    });

    if (res.ok === false) {
      setError(res.error);
      return;
    }

    setPassword('');
    onAuthenticate({
      displayName: res.account.displayName,
      groveName: res.account.groveName,
      isLoginMode: mode === 'login' || res.isReturning,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C180E]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="pixel-frame relative w-full max-w-sm p-6 bg-[#FAF6EE]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center border-2 border-[#1A531A]/30 text-[#132A16] hover:border-[#1A531A]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <GrovepathEmblem size={36} />
          <h2 id="auth-modal-title" className="font-pixel text-2xl font-bold text-[#1A531A]">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
        </div>

        <div className="mb-4 grid grid-cols-2 border-2 border-[#1A531A] p-0.5 bg-[#FFFDF8]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-1.5 text-xs font-semibold ${
              mode === 'login' ? 'bg-[#1A531A] text-[#FAF6EE]' : 'text-[#4A634D]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-1.5 text-xs font-semibold ${
              mode === 'signup' ? 'bg-[#1A531A] text-[#FAF6EE]' : 'text-[#4A634D]'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A634D]" />
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              aria-label="Your Name"
              className="w-full border-2 border-[#1A531A]/40 bg-[#FFFDF8] pl-9 pr-3 py-2 text-sm text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A634D]" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              className="w-full border-2 border-[#1A531A]/40 bg-[#FFFDF8] pl-9 pr-10 py-2 text-sm text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A634D] hover:text-[#1A531A]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {mode === 'signup' && (
            <input
              type="text"
              value={groveName}
              onChange={(e) => setGroveName(e.target.value)}
              placeholder="Grove Name (optional)"
              aria-label="Grove Name"
              className="w-full border-2 border-[#1A531A]/40 bg-[#FFFDF8] px-3 py-2 text-sm text-[#132A16] focus:border-[#1A531A] focus:outline-none"
            />
          )}

          {error && (
            <p className="text-xs font-semibold text-[#991B1B]" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="pixel-btn-primary w-full py-2.5 text-sm font-semibold"
          >
            {mode === 'login' ? 'Enter Grove' : 'Create Grove'}
          </button>
        </form>
      </div>
    </div>
  );
}

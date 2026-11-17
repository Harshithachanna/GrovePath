import React from 'react';
import { BarChart3, LogOut, Settings, Sparkles, Sprout } from 'lucide-react';
import { GrovepathEmblem } from './PixelSprites';

interface TopNavProps {
  isAuthenticated: boolean;
  displayName: string;
  onStartGrove: () => void;
  onOpenAuth: () => void;
  onLogOut: () => void;
}

export function TopNav({
  isAuthenticated,
  displayName,
  onStartGrove,
  onOpenAuth,
  onLogOut,
}: TopNavProps) {
  const navItems = [
    { href: '#grove', label: 'Grove', icon: <Sprout className="h-3.5 w-3.5" /> },
    { href: '#inspector', label: 'Growth', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { href: '#insights', label: 'Insights', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { href: '#settings', label: 'Settings', icon: <Settings className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#9DC183]/30 bg-[#0C180E]/92 text-[#FAF6EE] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8">
        {/* Zone 1: Grovepath Emblem + Wordmark */}
        <a
          href={isAuthenticated ? '#grove' : '#hero'}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9DC183]"
        >
          <GrovepathEmblem size={28} />
          <span className="font-pixel text-lg sm:text-xl font-bold tracking-tight text-[#FAF6EE]">
            Grovepath
          </span>
        </a>

        {/* Zone 2: Visual Section Jump Icons */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium" aria-label="Sections">
          {isAuthenticated ? (
            navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[#FAF6EE]/80 hover:text-[#FAF6EE] hover:underline underline-offset-4 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))
          ) : (
            <a
              href="#glimpse"
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 text-[#FAF6EE]/80 hover:text-[#FAF6EE] hover:underline underline-offset-4 transition-colors"
            >
              <Sprout className="h-3.5 w-3.5" />
              <span>Glimpse</span>
            </a>
          )}
        </nav>

        {/* Zone 3: Auth & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <span className="font-pixel text-sm font-bold text-[#D2B48C] whitespace-nowrap">
                {displayName}
              </span>
              <button
                type="button"
                onClick={onLogOut}
                className="inline-flex items-center gap-1.5 border border-[#9DC183]/45 bg-[#132A16] px-3 py-1.5 text-xs font-semibold text-[#FAF6EE] hover:border-[#FAF6EE] whitespace-nowrap shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenAuth}
                className="whitespace-nowrap shrink-0 text-xs sm:text-sm font-medium text-[#D2B48C] hover:text-[#FAF6EE] px-2 py-1.5 transition-colors"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onStartGrove}
                className="pixel-btn-primary px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0"
              >
                Start Your Grove
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

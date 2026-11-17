import type { GroveState, StoredAccount } from '../types/grove';

const STORAGE_KEY = 'grovepath_sanctuary_v2';
const ACCOUNTS_KEY = 'grovepath_accounts_v1';
const ACCOUNT_GROVE_PREFIX = 'grovepath_grove_';

export function createEmptyGroveState(): GroveState {
  return {
    profile: {
      isAuthenticated: false,
      displayName: 'Navigator',
      groveName: 'My Grove',
    },
    settings: {
      soundEnabled: true,
      reducedMotion: false,
    },
    habits: [],
    logs: [],
    reminders: [],
  };
}

export function loadGroveState(): GroveState {
  const empty = createEmptyGroveState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<GroveState>;
    return {
      profile: {
        isAuthenticated: Boolean(parsed.profile?.isAuthenticated),
        displayName: parsed.profile?.displayName || empty.profile.displayName,
        groveName: parsed.profile?.groveName || empty.profile.groveName,
      },
      settings: { ...empty.settings, ...(parsed.settings ?? {}) },
      habits: Array.isArray(parsed.habits) ? parsed.habits : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      reminders: Array.isArray(parsed.reminders) ? parsed.reminders : [],
    };
  } catch {
    return empty;
  }
}

export function saveGroveState(state: GroveState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.profile.isAuthenticated && state.profile.displayName) {
      const key = `${ACCOUNT_GROVE_PREFIX}${normalizeUsername(state.profile.displayName)}`;
      localStorage.setItem(key, JSON.stringify(state));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function loadAccountGroveState(username: string): GroveState | null {
  try {
    const raw = localStorage.getItem(`${ACCOUNT_GROVE_PREFIX}${normalizeUsername(username)}`);
    if (!raw) return null;
    const empty = createEmptyGroveState();
    const parsed = JSON.parse(raw) as Partial<GroveState>;
    return {
      profile: {
        isAuthenticated: true,
        displayName: parsed.profile?.displayName || username,
        groveName: parsed.profile?.groveName || `${username}'s Grove`,
      },
      settings: { ...empty.settings, ...(parsed.settings ?? {}) },
      habits: Array.isArray(parsed.habits) ? parsed.habits : [],
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
      reminders: Array.isArray(parsed.reminders) ? parsed.reminders : [],
    };
  } catch {
    return null;
  }
}

function normalizeUsername(name: string): string {
  return name.trim().toLowerCase();
}

function loadAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StoredAccount>;
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, StoredAccount>): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage errors
  }
}

export function authenticateLocalAccount(
  mode: 'login' | 'signup',
  payload: { name: string; password: string; groveName?: string }
):
  | { ok: true; account: StoredAccount; isReturning: boolean }
  | { ok: false; error: string } {
  const displayName = payload.name.trim();
  const username = normalizeUsername(displayName);
  const password = payload.password;

  if (!displayName) {
    return { ok: false, error: 'Enter your name' };
  }
  if (password.length < 4) {
    return { ok: false, error: 'Password must be at least 4 characters' };
  }

  const accounts = loadAccounts();
  const existing = accounts[username];

  if (mode === 'signup') {
    if (existing) {
      return { ok: false, error: 'Name already registered — use Log In' };
    }
    const account: StoredAccount = {
      username,
      displayName,
      password,
      groveName: payload.groveName?.trim() || `${displayName}'s Grove`,
    };
    accounts[username] = account;
    saveAccounts(accounts);
    return { ok: true, account, isReturning: false };
  }

  // Log In mode
  if (existing) {
    if (existing.password !== password) {
      return { ok: false, error: 'Incorrect password' };
    }
    return { ok: true, account: existing, isReturning: true };
  }

  // First-time direct login creates their personal Name + Password account smoothly
  const account: StoredAccount = {
    username,
    displayName,
    password,
    groveName: payload.groveName?.trim() || `${displayName}'s Grove`,
  };
  accounts[username] = account;
  saveAccounts(accounts);
  return { ok: true, account, isReturning: false };
}

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import CryptoJS from 'crypto-js';

export interface VaultSecret {
  id: string;
  user_id: string;
  service_name: string;
  encrypted_data: string;
  created_at: string;
  updated_at: string;
  decryptedValue?: string; 
}

interface VaultState {
  secrets: VaultSecret[];
  isLoading: boolean;
  isUnlocked: boolean;
  masterPassword: null | string;
  unlockVault: (password: string) => Promise<boolean>;
  lockVault: () => void;
  fetchSecrets: () => Promise<void>;
  addSecret: (service: string, secretValue: string) => Promise<void>;
  deleteSecret: (id: string) => Promise<void>;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  secrets: [],
  isLoading: false,
  isUnlocked: false,
  masterPassword: null,

  unlockVault: async (password) => {
    set({ masterPassword: password, isUnlocked: true });
    await get().fetchSecrets();
    return true;
  },

  lockVault: () => {
    set({ isUnlocked: false, masterPassword: null, secrets: [] });
  },

  fetchSecrets: async () => {
    const { isUnlocked, masterPassword } = get();
    if (!isUnlocked || !masterPassword) return;

    set({ isLoading: true });
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('vault_secrets')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      const decryptedSecrets = data.map((secret: any) => {
        try {
          const bytes = CryptoJS.AES.decrypt(secret.encrypted_data, masterPassword);
          const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
          return { ...secret, decryptedValue };
        } catch (e) {
          return { ...secret, decryptedValue: 'Decryption failed. Wrong password?' };
        }
      });
      set({ secrets: decryptedSecrets as VaultSecret[] });
    }
    set({ isLoading: false });
  },

  addSecret: async (service, secretValue) => {
    const { isUnlocked, masterPassword } = get();
    if (!isUnlocked || !masterPassword) return;

    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) return;

    const encrypted_data = CryptoJS.AES.encrypt(secretValue, masterPassword).toString();

    await supabase.from('vault_secrets').insert({
      user_id: userId,
      service_name: service,
      encrypted_data
    });

    get().fetchSecrets();
  },

  deleteSecret: async (id) => {
    await supabase.from('vault_secrets').delete().eq('id', id);
    get().fetchSecrets();
  }
}));

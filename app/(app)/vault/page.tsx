'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { Shield, Lock, Unlock, Copy, Trash2, Eye, EyeOff, Plus, RefreshCw } from 'lucide-react';
import { useVaultStore } from '@/store/useVaultStore';
import { cn } from '@/lib/utils';

export default function VaultPage() {
  const { secrets, isUnlocked, unlockVault, lockVault, addSecret, deleteSecret } = useVaultStore();
  
  const [passwordInput, setPasswordInput] = useState('');
  const [newService, setNewService] = useState('');
  const [newSecret, setNewSecret] = useState('');
  
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await useVaultStore.getState().fetchSecrets();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    await unlockVault(passwordInput);
    setPasswordInput('');
  };

  const handleAddSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService || !newSecret) return;
    await addSecret(newService, newSecret);
    setNewService('');
    setNewSecret('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleVisibility = (id: string) => {
    setVisibleSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Shield size={64} className="text-stone-900 mb-4" />
        <h1 className="font-[family-name:var(--font-space-mono)] font-black text-3xl uppercase tracking-wider text-stone-900 text-center">
          Personal Vault
        </h1>
        <p className="font-bold text-stone-600 text-center max-w-md">
          Your secrets are encrypted locally using AES-256 before syncing to the cloud. Enter your master password to unlock.
        </p>
        
        <RetroCard title="Unlock Vault" className="w-full max-w-md p-6">
          <form onSubmit={handleUnlock} className="space-y-4">
            <RetroInput 
              type="password" 
              placeholder="Master Password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              required
            />
            <RetroButton type="submit" label="Unlock Vault" icon={Unlock} variant="primary" className="w-full" />
          </form>
        </RetroCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Shield size={24} /> Personal Vault
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Securely encrypted local secrets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RetroButton 
            onClick={handleRefresh} 
            icon={RefreshCw} 
            label=""
            className={isRefreshing ? 'animate-spin' : ''} 
          />
          <RetroButton onClick={lockVault} label="Lock Vault" icon={Lock} variant="danger" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Secret */}
        <RetroCard title="Store New Secret" icon={Plus} accentColor="indigo" className="lg:col-span-1 h-fit">
          <form onSubmit={handleAddSecret} className="space-y-4">
            <RetroInput placeholder="Service / Label (e.g. GitHub Token)" value={newService} onChange={e => setNewService(e.target.value)} required />
            <RetroInput type="password" placeholder="Secret Value" value={newSecret} onChange={e => setNewSecret(e.target.value)} required />
            <RetroButton type="submit" label="Encrypt & Save" variant="primary" className="w-full" />
          </form>
        </RetroCard>

        {/* Secret List */}
        <RetroCard title="Your Secrets" icon={Shield} accentColor="indigo" className="lg:col-span-2">
          {secrets.length === 0 ? (
            <div className="p-4 text-center font-bold text-stone-500 border-2 border-dashed border-stone-300 rounded">No secrets stored in vault.</div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {secrets.map(secret => (
                <div key={secret.id} className="p-4 bg-stone-50 border-[3px] border-stone-900 rounded" style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-black text-stone-900 font-[family-name:var(--font-space-mono)] uppercase text-lg">{secret.service_name}</h4>
                    <span className="text-xs font-bold text-stone-500">
                      {new Date(secret.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 px-3 py-2 bg-stone-200 border-2 border-stone-900 rounded font-[family-name:var(--font-space-mono)] text-sm overflow-x-auto whitespace-nowrap">
                      {visibleSecrets[secret.id] ? secret.decryptedValue : '••••••••••••••••••••••••••••••••'}
                    </div>
                    <button 
                      onClick={() => toggleVisibility(secret.id)}
                      className="p-2 bg-stone-300 border-2 border-stone-900 rounded hover:bg-stone-400 active:translate-y-0.5"
                    >
                      {visibleSecrets[secret.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(secret.decryptedValue || '')}
                      className="p-2 bg-indigo-400 border-2 border-stone-900 rounded hover:bg-indigo-500 active:translate-y-0.5 text-stone-900"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => deleteSecret(secret.id)}
                      className="p-2 bg-red-400 border-2 border-stone-900 rounded hover:bg-red-500 active:translate-y-0.5 text-stone-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </RetroCard>
      </div>
    </div>
  );
}

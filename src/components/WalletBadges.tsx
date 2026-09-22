import React from 'react';
import { QrCode, Banknote, ShieldCheck } from 'lucide-react';

interface WalletBadgesProps {
  wallets: string[];
  size?: 'sm' | 'md';
}

export const WalletBadges: React.FC<WalletBadgesProps> = ({ wallets, size = 'sm' }) => {
  const isSm = size === 'sm';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {wallets.map((wallet) => {
        if (wallet === 'eSewa') {
          return (
            <span
              key={wallet}
              id="wallet-badge-esewa"
              className={`inline-flex items-center gap-1 font-bold rounded-lg border transition-all ${
                isSm
                  ? 'px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'px-2.5 py-1 text-xs bg-emerald-100/80 text-emerald-900 border-emerald-400 font-extrabold shadow-2xs'
              }`}
              title="Pay via eSewa directly to restaurant"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#60bb46]" />
              <span>eSewa</span>
            </span>
          );
        }
        if (wallet === 'Khalti') {
          return (
            <span
              key={wallet}
              id="wallet-badge-khalti"
              className={`inline-flex items-center gap-1 font-bold rounded-lg border transition-all ${
                isSm
                  ? 'px-2 py-0.5 text-[10px] bg-purple-50 text-purple-900 border-purple-300'
                  : 'px-2.5 py-1 text-xs bg-purple-100/80 text-purple-950 border-purple-400 font-extrabold shadow-2xs'
              }`}
              title="Pay via Khalti digital wallet"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5c2d91]" />
              <span>Khalti</span>
            </span>
          );
        }
        if (wallet.includes('Fonepay') || wallet.includes('QR')) {
          return (
            <span
              key={wallet}
              id="wallet-badge-fonepay"
              className={`inline-flex items-center gap-1 font-bold rounded-lg border transition-all ${
                isSm
                  ? 'px-2 py-0.5 text-[10px] bg-rose-50 text-rose-900 border-rose-300'
                  : 'px-2.5 py-1 text-xs bg-rose-100/80 text-rose-950 border-rose-400 font-extrabold shadow-2xs'
              }`}
              title="Scan Fonepay QR code upon delivery"
            >
              <QrCode className="w-3 h-3 text-[#e31b23]" />
              <span>Fonepay QR</span>
            </span>
          );
        }
        return (
          <span
            key={wallet}
            id="wallet-badge-cod"
            className={`inline-flex items-center gap-1 font-medium rounded-lg border transition-all ${
              isSm
                ? 'px-2 py-0.5 text-[10px] bg-stone-100 text-stone-800 border-stone-300'
                : 'px-2.5 py-1 text-xs bg-stone-100 text-stone-800 border-stone-300 shadow-2xs'
            }`}
          >
            <Banknote className="w-3 h-3 text-stone-600" />
            <span>Cash on Delivery</span>
          </span>
        );
      })}
    </div>
  );
};

import React, { useState } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '../config/siteConfig';

interface BusinessConfigModalProps {
  isOpen: boolean;
  config: SiteConfig;
  onClose: () => void;
  onSave: (updated: SiteConfig) => void;
}

export const BusinessConfigModal: React.FC<BusinessConfigModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
}) => {
  const [draft, setDraft] = useState<SiteConfig>(config);

  if (!isOpen) return null;

  const handleServicePriceChange = (id: string, newPrice: string) => {
    setDraft((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id ? { ...s, price: newPrice } : s
      ),
    }));
  };

  const handleResetPlaceholders = () => {
    setDraft(DEFAULT_SITE_CONFIG);
    onSave(DEFAULT_SITE_CONFIG);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Konfigurasi Data Bisnis Barbershop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#05070B]/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#05070B] border border-white/30 p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-4">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-white/60">
              Konfigurasi Terpusat (siteConfig.ts)
            </div>
            <h3 className="font-display text-xl font-bold text-white mt-0.5">
              Edit Data Bisnis &amp; Placeholder
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel konfigurasi"
            className="p-2 border border-white/20 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono-tabular uppercase text-white/75">
                Nama Barbershop
              </label>
              <input
                type="text"
                value={draft.brandName}
                onChange={(e) =>
                  setDraft({ ...draft, brandName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#0B1F3A]/40 border border-white/25 text-white focus:border-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono-tabular uppercase text-white/75">
                WhatsApp Bisnis (Tanpa +)
              </label>
              <input
                type="text"
                value={draft.whatsappInternational}
                onChange={(e) =>
                  setDraft({ ...draft, whatsappInternational: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#0B1F3A]/40 border border-white/25 text-white font-mono-tabular focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono-tabular uppercase text-white/75">
                Alamat Lengkap Malang
              </label>
              <input
                type="text"
                value={draft.address}
                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0B1F3A]/40 border border-white/25 text-white focus:border-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono-tabular uppercase text-white/75">
                Jam Operasional
              </label>
              <input
                type="text"
                value={draft.operatingHours}
                onChange={(e) =>
                  setDraft({ ...draft, operatingHours: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#0B1F3A]/40 border border-white/25 text-white font-mono-tabular focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono-tabular uppercase text-white/75">
              Link Google Maps
            </label>
            <input
              type="text"
              value={draft.googleMapsUrl}
              onChange={(e) =>
                setDraft({ ...draft, googleMapsUrl: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-[#0B1F3A]/40 border border-white/25 text-white font-mono-tabular focus:border-white focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/15 space-y-3">
            <div className="text-xs font-mono-tabular uppercase text-white/75">
              Daftar Harga Layanan (Default: RpXX.XXX)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {draft.services.map((srv) => (
                <div key={srv.id} className="flex items-center justify-between gap-2 bg-[#0B1F3A]/25 p-2.5 border border-white/15">
                  <span className="text-xs text-white/85 truncate">
                    {srv.index}. {srv.name}
                  </span>
                  <input
                    type="text"
                    value={srv.price}
                    onChange={(e) =>
                      handleServicePriceChange(srv.id, e.target.value)
                    }
                    className="w-28 px-2.5 py-1 bg-[#05070B] border border-white/25 text-xs font-mono-tabular text-white text-right focus:border-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetPlaceholders}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-white/25 text-xs font-mono-tabular text-white/80 hover:text-white hover:border-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Placeholder PRD</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-[#05070B] text-xs font-bold tracking-widest uppercase hover:bg-white/90 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

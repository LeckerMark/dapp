import React from 'react';
import { ShieldCheck, Lock, Zap, Globe, ExternalLink, Twitter, Github, MessageCircle } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: 'Bank-Grade Security', desc: 'Multi-layer encryption', color: 'var(--binance-gold)' },
  { icon: Lock, title: 'Non-Custodial', desc: 'Your keys, your crypto', color: 'var(--binance-green)' },
  { icon: Zap, title: 'Instant Transfers', desc: 'Lightning-fast execution', color: 'var(--binance-blue)' },
  { icon: Globe, title: 'Multi-Chain', desc: '6+ networks supported', color: '#8247E5' },
];

const stats = [
  { value: '$2.5B+', label: 'Volume' },
  { value: '150K+', label: 'Transactions' },
  { value: '99.9%', label: 'Uptime' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--binance-gray-light)] bg-[var(--binance-black)]/80">
      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="p-4 bg-[var(--binance-dark)] rounded-lg border border-[var(--binance-gray-light)] hover:border-[var(--binance-gold)]/30 transition-colors"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <h3 className="text-sm font-medium text-[var(--binance-text)] mb-0.5">{feature.title}</h3>
              <p className="text-xs text-[var(--binance-text-secondary)]">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-12 mt-10 py-8 border-t border-b border-[var(--binance-gray-light)]">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-semibold text-gold-gradient font-mono">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-[var(--binance-text-secondary)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--binance-gray-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--binance-gold)] to-[var(--binance-gold-dark)] rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[var(--binance-black)]" />
              </div>
              <span className="text-sm text-[var(--binance-text-secondary)]">
                © 2024 CryptoTransfer Pro
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[Twitter, Github, MessageCircle].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--binance-gray)] hover:bg-[var(--binance-gray-light)] border border-[var(--binance-gray-light)] text-[var(--binance-text-secondary)] hover:text-[var(--binance-gold)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-xs text-[var(--binance-text-secondary)]">
              <a href="#" className="hover:text-[var(--binance-text)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--binance-text)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--binance-text)] transition-colors flex items-center gap-1">
                Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

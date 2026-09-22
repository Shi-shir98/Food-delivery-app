import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, ShieldCheck, Phone, MessageSquare, Info, X, Globe, MapPin, Check, ChevronDown } from 'lucide-react';
import { Restaurant, Language } from '../types.ts';
import { NEPAL_CITIES } from '../data/cities.ts';
import { t } from '../utils/i18n.ts';

interface NavbarProps {
  currentRestaurant: Restaurant | null;
  onBackToFeed: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  language: Language;
  onToggleLanguage: () => void;
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRestaurant,
  onBackToFeed,
  cartCount,
  cartTotal,
  onOpenCart,
  language,
  onToggleLanguage,
  selectedCityId,
  onSelectCity,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const activeCity = NEPAL_CITIES.find((c) => c.id === selectedCityId) || NEPAL_CITIES[0];

  return (
    <>
      <header
        id="app-header"
        className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md backdrop-blur-md bg-stone-900/95"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left section: Logo or Back Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {currentRestaurant ? (
              <button
                id="btn-back-to-feed"
                onClick={onBackToFeed}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Back to all restaurants"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{t(language, 'allRestaurants')}</span>
              </button>
            ) : null}

            <div
              onClick={currentRestaurant ? onBackToFeed : undefined}
              className={`flex items-center gap-2 sm:gap-2.5 ${currentRestaurant ? 'cursor-pointer' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-sm font-bold text-lg tracking-tight shrink-0">
                D
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-none">
                    {language === 'ne' ? 'डाइरेक्ट फुड' : 'DirectFood'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider shrink-0">
                    Nepal
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 hidden sm:block leading-none mt-1">
                  {t(language, 'tagline')}
                </p>
              </div>
            </div>
          </div>

          {/* Right section: City Switcher + Language Toggle + Info pill + Cart button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* City Selection Dropdown Button */}
            <div className="relative">
              <button
                id="btn-city-selector"
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-750 text-stone-200 text-xs font-semibold transition-all border border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Select target city in Nepal"
                title="Change active target city in Nepal"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="max-w-[85px] sm:max-w-none truncate">
                  {language === 'ne' ? activeCity.nameNepali : activeCity.name}
                </span>
                {activeCity.isMainCity && (
                  <span className="hidden md:inline text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80">
                    {language === 'ne' ? 'राजधानी' : 'Capital'}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {/* City Dropdown Menu */}
              {showCityDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowCityDropdown(false)}
                  />
                  <div
                    id="dropdown-cities-menu"
                    className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl p-2 z-40 text-xs animate-fade-in"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-800 flex items-center justify-between">
                      <span>{t(language, 'selectCity')}</span>
                      <span className="text-[10px] text-emerald-400">0% Commission</span>
                    </div>

                    <div className="py-1 space-y-1">
                      {NEPAL_CITIES.map((city) => {
                        const isSelected = city.id === selectedCityId;
                        return (
                          <button
                            key={city.id}
                            id={`city-option-${city.id}`}
                            onClick={() => {
                              onSelectCity(city.id);
                              setShowCityDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start justify-between gap-2 ${
                              isSelected
                                ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200'
                                : 'hover:bg-stone-800 text-stone-300 hover:text-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs">
                                  {language === 'ne' ? city.nameNepali : city.name}
                                </span>
                                {city.isMainCity && (
                                  <span className="text-[9px] font-bold px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    {language === 'ne' ? 'मुख्य राजधानी' : 'Main City'}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                                {language === 'ne' ? city.taglineNepali : city.tagline}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Language Switcher Toggle */}
            <button
              id="btn-toggle-language"
              onClick={onToggleLanguage}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all border border-stone-700 flex items-center gap-1 sm:gap-1.5"
              title="Switch language between English and Nepali"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Why Direct button */}
            <button
              id="btn-why-direct"
              onClick={() => setShowInfoModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors hidden sm:flex items-center gap-1.5 border border-stone-800"
              title="Learn how direct ordering works in Nepal"
            >
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t(language, 'whyDirect')}</span>
            </button>

            {/* Cart trigger button */}
            <button
              id="btn-open-cart-header"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-semibold">{cartCount > 0 ? `Rs. ${cartTotal}` : t(language, 'cart')}</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Info Modal explaining zero-commission direct model for Nepal */}
      {showInfoModal && (
        <div
          id="modal-direct-info"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="w-full max-w-md bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="btn-close-direct-info"
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'ne' ? 'नेपालमा सिधा अर्डर कसरी काम गर्छ?' : 'How Direct Delivery Works in Nepal'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mb-4 leading-relaxed">
              {language === 'ne'
                ? 'डेलिभरी प्लेटफर्महरूले रेस्टुरेन्टहरूबाट २०-३०% सम्म कमिसन लिन्छन् जसले गर्दा खाना महँगो हुन्छ। डाइरेक्ट फुड मार्फत तपाईं काठमाडौँ उपत्यका तथा अन्य सहरका रेस्टुरेन्टहरूलाई सिधै सम्पर्क गरेर अर्डर गर्न सक्नुहुन्छ।'
                : 'Conventional aggregators charge local restaurants up to 30% commission. By ordering directly on WhatsApp, Viber, or Direct Phone, 100% of your bill supports the local kitchen in Kathmandu and across Nepal.'}
            </p>

            <div className="space-y-3 mb-5">
              <div className="flex gap-3 items-start p-3 rounded-xl bg-stone-800/60 border border-stone-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    {language === 'ne' ? '१. परिकार रोज्नुहोस्' : '1. Choose your dishes'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {language === 'ne'
                      ? 'काठमाडौँको बफ सी-मोमो, नेवारी समय् बजि, मुस्ताङी थकाली, लाफिङ वा पिज्जा कार्टमा थप्नुहोस्।'
                      : 'Add iconic Kathmandu Mo:Mo, Newari Samay Baji, Thakali, or Laphing to your cart.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 rounded-xl bg-stone-800/60 border border-stone-800">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    {language === 'ne' ? '२. ट्रिपल-एक्सन अर्डर' : '2. Triple-Action Dispatch'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {language === 'ne'
                      ? 'व्हाट्सएप, भाइबर वा सिधै फोन कल गर्नुहोस्। तपाईंको वडा नं., टोल र अर्डर विवरण तुरुन्त पठाइनेछ।'
                      : 'Order via WhatsApp, Viber, or Direct Call. Your Ward No. and items are pre-formatted.'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 rounded-xl bg-stone-800/60 border border-stone-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                    {language === 'ne' ? '३. इसेवा/खल्ती/क्यासबाट भुक्तानी' : '3. Pay on Delivery'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {language === 'ne'
                      ? 'डेलिभरीमा Fonepay QR स्क्यान गर्नुहोस् वा इसेवा/खल्ती/क्यास मार्फत भुक्तानी गर्नुहोस्।'
                      : 'Scan Fonepay QR on delivery or pay via eSewa, Khalti, or Cash on Delivery.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              id="btn-understand-direct-info"
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
            >
              {language === 'ne' ? 'बुझें, अर्डर सुरु गरौं' : "Got it, let's order!"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

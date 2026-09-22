import React, { useState, useMemo } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Phone,
  Copy,
  Check,
  MapPin,
  User,
  CreditCard,
  FileText,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Building,
  Navigation,
  QrCode,
  Share2,
} from 'lucide-react';
import { Restaurant, CartItem, CustomerDetails, Language } from '../types.ts';
import {
  formatLocalizedOrderMessage,
  generateWhatsAppUrl,
  generateViberDeepLink,
} from '../utils/messaging.ts';
import { WalletBadges } from './WalletBadges.tsx';
import { t } from '../utils/i18n.ts';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  cart: CartItem[];
  customer: CustomerDetails;
  onUpdateCustomer: (updated: Partial<CustomerDetails>) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  language: Language;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  cart,
  customer,
  onUpdateCustomer,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  language,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [addressError, setAddressError] = useState(false);

  // Calculations in Nepalese Rupees (Rs.)
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  // Delivery fee logic
  const estimatedDeliveryFee = subtotal >= 600 ? 0 : 40;
  const total = subtotal + estimatedDeliveryFee;

  // Pre-filled formatted message
  const formattedMessage = useMemo(() => {
    return formatLocalizedOrderMessage(restaurant, cart, customer, subtotal, estimatedDeliveryFee, language);
  }, [restaurant, cart, customer, subtotal, estimatedDeliveryFee, language]);

  if (!isOpen) return null;

  const validateAddress = (): boolean => {
    if (!customer.toleStreet.trim() && !customer.wardNo.trim() && !customer.nearestLandmark.trim()) {
      setAddressError(true);
      const input = document.getElementById('input-customer-tole');
      input?.focus();
      return false;
    }
    setAddressError(false);
    return true;
  };

  // 1. WhatsApp Order Action
  const handleWhatsAppOrder = () => {
    if (!validateAddress()) return;
    const url = generateWhatsAppUrl(restaurant, cart, customer, subtotal, estimatedDeliveryFee, language);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 2. Viber Order Action (Triple-Action Checkout)
  const handleViberOrder = () => {
    if (!validateAddress()) return;

    // Copy formatted text to clipboard so user can immediately paste in Viber chat
    navigator.clipboard.writeText(formattedMessage);
    setActionFeedback(
      language === 'ne'
        ? 'भाइबर च्याट खुल्दैछ! अर्डर विवरण कपी गरिएको छ, च्याटमा पेस्ट गर्नुहोस्।'
        : 'Opening Viber! Order summary copied to clipboard, ready to paste in chat.'
    );
    setTimeout(() => setActionFeedback(null), 5000);

    const viberUrl = generateViberDeepLink(restaurant);
    window.location.href = viberUrl;
  };

  // 3. Call Restaurant Action
  const handleCallToOrder = () => {
    navigator.clipboard.writeText(formattedMessage);
    setActionFeedback(
      language === 'ne'
        ? 'अर्डर विवरण कपी भयो! रेस्टुरेन्टलाई फोन लाग्दैछ।'
        : 'Order copied to clipboard! Calling the restaurant now.'
    );
    setTimeout(() => setActionFeedback(null), 5000);

    window.location.href = `tel:${restaurant.contact.phoneNumber}`;
  };

  const handleCopyOrderText = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div
      id="modal-direct-order"
      role="dialog"
      aria-modal="true"
      aria-labelledby="direct-order-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {t(language, 'zeroCommission')}
              </span>
              <span className="text-xs text-stone-400">
                {language === 'ne'
                  ? `${restaurant.cityNepali || restaurant.city || 'काठमाडौँ'} सिधा डेलिभरी`
                  : `${restaurant.city || 'Kathmandu'} Direct Dispatch`}
              </span>
            </div>
            <h2 id="direct-order-heading" className="text-lg sm:text-xl font-bold text-white mt-1">
              {language === 'ne' && restaurant.nameNepali ? restaurant.nameNepali : restaurant.name}
            </h2>
          </div>

          <button
            id="btn-close-cart-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close order dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-stone-900">
          {cart.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800">{t(language, 'emptyCartTitle')}</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {t(language, 'emptyCartDesc')}
              </p>
              <button
                id="btn-empty-cart-return"
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
              >
                {t(language, 'browseMenu')}
              </button>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {t(language, 'selectedItems')} ({cart.reduce((a, b) => a + b.quantity, 0)})
                  </h3>
                  <button
                    id="btn-clear-entire-cart"
                    onClick={onClearCart}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    {t(language, 'clearAll')}
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => {
                    const itemName = language === 'ne' && item.menuItem.nameNepali ? item.menuItem.nameNepali : item.menuItem.name;
                    return (
                      <div
                        key={item.menuItem.id}
                        className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-stone-900 truncate">
                              {itemName}
                            </h4>
                            <span className="text-xs font-bold text-stone-600">
                              Rs. {item.menuItem.price * item.quantity}
                              <span className="text-stone-400 font-normal ml-1">
                                (Rs. {item.menuItem.price} each)
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity Steppers & Remove */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
                            <button
                              id={`cart-decrease-${item.menuItem.id}`}
                              onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                              className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              id={`cart-increase-${item.menuItem.id}`}
                              onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                              className="w-7 h-7 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-700 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            id={`cart-delete-${item.menuItem.id}`}
                            onClick={() => onRemoveItem(item.menuItem.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Localized Nepal Delivery Details Form */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {t(language, 'deliveryDetailsTitle')}
                  </h3>
                  <span className="text-[11px] text-stone-400">{t(language, 'deliverySubtitle')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t(language, 'fullName')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-name"
                        type="text"
                        value={customer.name}
                        onChange={(e) => onUpdateCustomer({ name: e.target.value })}
                        placeholder="e.g. Bikash Sharma / सुजन थापा"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t(language, 'phoneNumber')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-phone"
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => onUpdateCustomer({ phone: e.target.value })}
                        placeholder="e.g. 98470XXXXX / 98075XXXXX"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Ward Number (Nepal specific) */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t(language, 'wardNo')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-ward"
                        type="text"
                        value={customer.wardNo}
                        onChange={(e) => {
                          onUpdateCustomer({ wardNo: e.target.value });
                          if (e.target.value.trim()) setAddressError(false);
                        }}
                        placeholder={t(language, 'wardPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Tole / Street (Nepal specific) */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t(language, 'toleStreet')} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-tole"
                        type="text"
                        value={customer.toleStreet}
                        onChange={(e) => {
                          onUpdateCustomer({ toleStreet: e.target.value });
                          if (e.target.value.trim()) setAddressError(false);
                        }}
                        placeholder={t(language, 'tolePlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Nearest Landmark (Nepal specific) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t(language, 'landmark')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-landmark"
                        type="text"
                        value={customer.nearestLandmark}
                        onChange={(e) => {
                          onUpdateCustomer({ nearestLandmark: e.target.value });
                          if (e.target.value.trim()) setAddressError(false);
                        }}
                        placeholder={t(language, 'landmarkPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {addressError && (
                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {t(language, 'addressRequired')}
                      </p>
                    </div>
                  )}

                  {/* Special Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {t(language, 'driverNotes')}
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        id="input-customer-notes"
                        type="text"
                        value={customer.deliveryNotes}
                        onChange={(e) => onUpdateCustomer({ deliveryNotes: e.target.value })}
                        placeholder={t(language, 'notesPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Direct Digital Wallet Payment Selector */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t(language, 'acceptedWallets')}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {restaurant.contact.acceptedWallets.map((wallet) => (
                        <button
                          key={wallet}
                          type="button"
                          id={`btn-payment-${wallet.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          onClick={() => onUpdateCustomer({ paymentPreference: wallet })}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                            customer.paymentPreference === wallet
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-extrabold shadow-xs'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <span>{wallet}</span>
                          <span className="text-[10px] font-normal text-stone-400">Direct Pay</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Breakdown in Nepalese Rupees */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>{t(language, 'subtotal')}</span>
                  <span className="font-semibold text-stone-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t(language, 'deliveryFee')}</span>
                  <span className="font-semibold text-stone-900">
                    {estimatedDeliveryFee === 0 ? t(language, 'zeroRupees') : `Rs. ${estimatedDeliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t(language, 'platformFee')}</span>
                  <span className="font-bold text-emerald-600">{t(language, 'zeroRupees')}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 mt-2 flex justify-between text-sm sm:text-base font-extrabold text-stone-900">
                  <span>{t(language, 'totalAmount')}</span>
                  <span className="text-emerald-700">Rs. {total}</span>
                </div>
                <p className="text-[11px] text-stone-400 pt-1">
                  * {language === 'ne'
                    ? `अर्डर सिधै ${restaurant.nameNepali || restaurant.name} सँग WhatsApp, Viber वा फोन कल मार्फत पुष्टि हुन्छ।`
                    : `Final order and payment are confirmed directly with ${restaurant.name} upon contact.`}
                </p>
              </div>

              {/* Live WhatsApp / Viber Message Preview Toggle */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <button
                  id="btn-toggle-whatsapp-preview"
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-4 py-2.5 bg-stone-100 hover:bg-stone-200/80 flex items-center justify-between text-xs font-semibold text-stone-700 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {t(language, 'previewMessage')}
                  </span>
                  {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showPreview && (
                  <div className="p-4 bg-emerald-950/5 border-t border-stone-200">
                    <pre className="text-[11px] font-mono text-stone-800 whitespace-pre-wrap bg-white p-3 rounded-xl border border-stone-200 leading-relaxed max-h-48 overflow-y-auto">
                      {formattedMessage}
                    </pre>
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleCopyOrderText}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-semibold transition-colors"
                      >
                        {copiedSummary ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{t(language, 'copiedText')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t(language, 'copyText')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer with TRIPLE-ACTION CHECKOUT */}
        {cart.length > 0 && (
          <div className="bg-stone-50 border-t border-stone-200 px-5 sm:px-6 py-4 shrink-0 space-y-2.5">
            {/* Triple Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Action 1: Order via WhatsApp */}
              <button
                id="btn-confirm-whatsapp-order"
                onClick={handleWhatsAppOrder}
                className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                </div>
                <span>{t(language, 'orderWhatsApp')}</span>
              </button>

              {/* Action 2: Order via Viber */}
              <button
                id="btn-confirm-viber-order"
                onClick={handleViberOrder}
                className="py-3 px-3 rounded-2xl bg-[#7360f2] hover:bg-[#604edf] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                title="Open Viber Chat with pre-filled details"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 fill-white" />
                </div>
                <span>{t(language, 'orderViber')}</span>
              </button>

              {/* Action 3: Call Restaurant */}
              <button
                id="btn-call-to-order"
                onClick={handleCallToOrder}
                className="py-3 px-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors border border-stone-700"
                title={`Call ${restaurant.contact.phoneNumber}`}
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t(language, 'callRestaurant')}</span>
              </button>
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div
                id="toast-order-feedback"
                className="p-2.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-900 text-xs font-semibold flex items-center justify-center gap-1.5 animate-fade-in text-center"
              >
                <Check className="w-4 h-4 text-purple-700 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-stone-500 text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp: {restaurant.contact.formattedWhatsApp}
              </span>
              <span>•</span>
              <span>Viber: {restaurant.contact.formattedViber}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

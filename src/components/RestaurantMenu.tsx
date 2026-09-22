import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Restaurant, MenuItem, CartItem, Language } from '../types.ts';
import { WalletBadges } from './WalletBadges.tsx';
import { StarRating } from './StarRating.tsx';
import { t } from '../utils/i18n.ts';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onOpenCart: () => void;
  onBackToFeed: () => void;
  language: Language;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  restaurant,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
  onBackToFeed,
  language,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(restaurant.categories[0]?.id || '');
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  // Load existing rating for this restaurant
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`directfood_rating_${restaurant.id}`);
      if (stored) {
        setUserRating(Number(stored));
      } else {
        setUserRating(null);
      }
    } catch {
      // Ignore
    }
  }, [restaurant.id]);

  const handleRateRestaurant = (stars: number) => {
    setUserRating(stars);
    setShowRatingSuccess(true);
    try {
      localStorage.setItem(`directfood_rating_${restaurant.id}`, String(stars));
    } catch {
      // Ignore
    }
    setTimeout(() => {
      setShowRatingSuccess(false);
    }, 4000);
  };

  const getItemQuantity = (itemId: string): number => {
    const found = cart.find((c) => c.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const totalCartItems = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cart.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0);

  return (
    <div className="w-full pb-28">
      {/* Restaurant Header Banner */}
      <div className="relative bg-stone-900 text-white">
        <div className="relative min-h-[280px] sm:min-h-[340px] w-full overflow-hidden">
          <img
            src={restaurant.heroImage}
            alt={restaurant.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-black/40" />

          {/* Top navigation overlay */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between z-10">
            <button
              id="btn-back-menu-top"
              onClick={onBackToFeed}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold transition-all border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t(language, 'allRestaurants')}</span>
            </button>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                restaurant.isOpen ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  restaurant.isOpen ? 'bg-white animate-pulse' : 'bg-stone-400'
                }`}
              />
              {restaurant.isOpen ? t(language, 'openForOrders') : t(language, 'closedNow')}
            </span>
          </div>

          {/* Restaurant Header Details */}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {language === 'ne' && restaurant.cuisineTypeNepali ? restaurant.cuisineTypeNepali : restaurant.cuisineType}
                  </span>
                  <div className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center shadow-xs">
                    <StarRating
                      id={`menu-header-rating-${restaurant.id}`}
                      rating={restaurant.rating}
                      reviewCount={restaurant.reviewCount}
                      size="sm"
                      theme="dark"
                      showTopBadge={true}
                      language={language}
                    />
                  </div>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {language === 'ne' && restaurant.nameNepali ? restaurant.nameNepali : restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-stone-300 mt-1 max-w-xl font-normal">
                  {language === 'ne' && restaurant.taglineNepali ? restaurant.taglineNepali : restaurant.tagline}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {restaurant.openingHours} • {restaurant.deliveryInfo.timeEstimate}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {language === 'ne' && restaurant.contact.addressNepali ? restaurant.contact.addressNepali : restaurant.contact.address}
                  </span>
                </div>

                {/* User Interactive 5-Star Rating Feedback Bar */}
                <div className="mt-3.5 inline-flex items-center flex-wrap gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-stone-200">
                  <span className="text-stone-300 font-medium text-[11px] sm:text-xs">
                    {userRating ? t(language, 'yourRating') : t(language, 'rateThisKitchen')}
                  </span>
                  <StarRating
                    id={`menu-interactive-stars-${restaurant.id}`}
                    rating={userRating || 0}
                    userRating={userRating}
                    showScore={false}
                    showCount={false}
                    size="sm"
                    theme="dark"
                    interactive={true}
                    onRate={handleRateRestaurant}
                  />
                  {userRating && (
                    <span className="font-bold text-amber-300 text-xs">
                      {userRating}/5 ★
                    </span>
                  )}
                  {showRatingSuccess && (
                    <span className="text-emerald-300 font-semibold text-[11px] flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/60 animate-fade-in">
                      <Check className="w-3 h-3 text-emerald-400" />
                      {t(language, 'ratedSuccess')}
                    </span>
                  )}
                </div>

                {/* Accepted Digital Wallets Section */}
                <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{t(language, 'acceptedWallets')}</span>
                  </div>
                  <WalletBadges wallets={restaurant.contact.acceptedWallets} size="md" />
                </div>
              </div>

              {/* Direct Quick Actions on Header */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  id="btn-direct-whatsapp-header"
                  href={`https://wa.me/${restaurant.contact.whatsAppNumber}?text=${encodeURIComponent(
                    language === 'ne'
                      ? `नमस्ते ${restaurant.nameNepali || restaurant.name}! म डाइरेक्ट फुड ${restaurant.cityNepali || 'नेपाल'} मार्फत मेनु हेर्दैछु।`
                      : `Namaste ${restaurant.name}! I am browsing your menu on DirectFood ${restaurant.city || 'Nepal'}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>WhatsApp</span>
                </a>

                <a
                  id="btn-direct-viber-header"
                  href={`viber://chat?number=%2B${restaurant.contact.viberNumber}`}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#7360f2] hover:bg-[#604edf] text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Viber</span>
                </a>

                <a
                  id="btn-direct-phone-header"
                  href={`tel:${restaurant.contact.phoneNumber}`}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs border border-stone-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{restaurant.contact.formattedPhone.split('/')[0]}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Ordering Notice Banner */}
        <div className="bg-stone-950 border-t border-stone-800 py-2.5 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-400 gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-stone-200 font-semibold">
                {language === 'ne' ? 'सिधा भान्सा डेलिभरी:' : 'Direct Kitchen Delivery:'}
              </span>
              <span>
                {language === 'ne'
                  ? '१००% भुक्तानी सिधै स्थानीय रेस्टुरेन्टलाई जान्छ।'
                  : '100% of your bill goes directly to the restaurant with zero commission.'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span>{t(language, 'minOrderPrefix')}{restaurant.deliveryInfo.minOrder}</span>
              <span>•</span>
              <span>{t(language, 'deliveryFeePrefix')}{restaurant.deliveryInfo.deliveryFeeEstimate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Tabs Bar */}
      <div className="sticky top-16 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
            {restaurant.categories.map((cat) => {
              const catTitle = language === 'ne' && cat.nameNepali ? cat.nameNepali : cat.name;
              return (
                <button
                  key={cat.id}
                  id={`cat-tab-${cat.id}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const el = document.getElementById(`category-section-${cat.id}`);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 130;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {catTitle} ({cat.items.length})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categorized Menu Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {restaurant.categories.map((category) => {
          const categoryName = language === 'ne' && category.nameNepali ? category.nameNepali : category.name;

          return (
            <section
              key={category.id}
              id={`category-section-${category.id}`}
              className="scroll-mt-36"
            >
              <div className="border-b border-stone-200 pb-3 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    {categoryName}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {category.items.length} {language === 'ne' ? 'परिकार उपलब्ध' : 'items available'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {category.items.map((item) => {
                  const quantity = getItemQuantity(item.id);
                  const itemName = language === 'ne' && item.nameNepali ? item.nameNepali : item.name;
                  const itemDesc = language === 'ne' && item.descriptionNepali ? item.descriptionNepali : item.description;

                  return (
                    <div
                      key={item.id}
                      id={`menu-item-card-${item.id}`}
                      className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex gap-4 hover:border-emerald-500/40 hover:shadow-sm transition-all"
                    >
                      {/* Item Information */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Dietary Badges */}
                          {item.dietaryBadges && item.dietaryBadges.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              {item.dietaryBadges.map((badge) => (
                                <span
                                  key={badge}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    badge === 'Popular' || badge === 'House Special' || badge === 'Chef Choice'
                                      ? 'bg-amber-100 text-amber-900'
                                      : badge === 'Vegetarian' || badge === 'Vegan'
                                      ? 'bg-emerald-100 text-emerald-900'
                                      : badge === 'Spicy'
                                      ? 'bg-rose-100 text-rose-900'
                                      : 'bg-stone-100 text-stone-700'
                                  }`}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}

                          <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                            {itemName}
                          </h3>

                          <p className="text-xs sm:text-sm text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                            {itemDesc}
                          </p>
                        </div>

                        {/* Price and Cart Action */}
                        <div className="mt-4 pt-2 flex items-center justify-between">
                          <span className="text-base font-extrabold text-stone-900">
                            Rs. {item.price}
                          </span>

                          {quantity > 0 ? (
                            <div className="flex items-center gap-2 bg-stone-900 text-white rounded-xl p-1">
                              <button
                                id={`btn-decrease-qty-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-7 h-7 rounded-lg hover:bg-stone-800 flex items-center justify-center text-white transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-bold min-w-5 text-center">
                                {quantity}
                              </span>
                              <button
                                id={`btn-increase-qty-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-7 h-7 rounded-lg hover:bg-stone-800 flex items-center justify-center text-white transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              id={`btn-add-item-${item.id}`}
                              onClick={() => onAddToCart(item)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-800 font-semibold text-xs transition-colors border border-stone-200 hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{language === 'ne' ? 'थप्नुहोस्' : 'Add'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Food Image */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-stone-100 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartItems > 0 && (
        <aside
          id="bar-floating-direct-cart"
          aria-label="Direct Order Summary"
          className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 text-white border-t border-stone-800 backdrop-blur-md px-4 py-3 shadow-2xl animate-slide-up"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-white">
                    {totalCartItems} {language === 'ne' ? 'परिकार' : totalCartItems === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-stone-400 text-xs">•</span>
                  <span className="font-extrabold text-base text-emerald-400">
                    Rs. {totalCartPrice}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 hidden sm:block">
                  {language === 'ne'
                    ? `${restaurant.nameNepali || restaurant.name} मा सिधै अर्डर`
                    : `Direct dispatch to ${restaurant.name}`}
                </p>
              </div>
            </div>

            <button
              id="btn-floating-review-order"
              onClick={onOpenCart}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950" />
              <span>{language === 'ne' ? 'अर्डर विवरण हेर्नुहोस् &rarr;' : 'Review Direct Order &rarr;'}</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

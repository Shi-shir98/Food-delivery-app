import React, { useState, useEffect } from 'react';
import { MOCK_RESTAURANTS } from './data/mockRestaurants.ts';
import { Restaurant, MenuItem, CartItem, CustomerDetails, Language } from './types.ts';
import { NEPAL_CITIES } from './data/cities.ts';
import { Navbar } from './components/Navbar.tsx';
import { HomeFeed } from './components/HomeFeed.tsx';
import { RestaurantMenu } from './components/RestaurantMenu.tsx';
import { DirectOrderModal } from './components/DirectOrderModal.tsx';
import { ShieldCheck, Heart, MessageCircle, Phone, QrCode, MapPin } from 'lucide-react';
import { t } from './utils/i18n.ts';

const STORAGE_KEY_CUSTOMER = 'directfood_nepal_customer_info';
const STORAGE_KEY_LANG = 'directfood_nepal_language';
const STORAGE_KEY_CITY = 'directfood_nepal_selected_city';

export default function App() {
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Target City state: Default to 'kathmandu' (the main city of Nepal)
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CITY);
      if (saved && NEPAL_CITIES.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'kathmandu'; // Default target main city of Nepal
  });

  const handleSelectCity = (cityId: string) => {
    setSelectedCityId(cityId);
    try {
      localStorage.setItem(STORAGE_KEY_CITY, cityId);
    } catch {
      // Ignore
    }
  };

  // Language state (Bilingual support: English / Nepali)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'ne') return saved;
    } catch {
      // Ignore
    }
    return 'en';
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ne' : 'en';
      try {
        localStorage.setItem(STORAGE_KEY_LANG, next);
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Localized Nepal customer details with persistence
  const [customer, setCustomer] = useState<CustomerDetails>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      name: 'Aayush Shrestha',
      phone: '9841234567',
      city: 'Kathmandu Valley',
      wardNo: 'Ward No. 10',
      toleStreet: 'New Baneshwor',
      nearestLandmark: 'Opposite Bhatbhateni Supermarket, Baneshwor',
      deliveryNotes: 'Make it spicy, please bring Fonepay QR code',
      paymentPreference: 'Fonepay QR',
    };
  });

  // Save customer details whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMER, JSON.stringify(customer));
    } catch {
      // Ignore
    }
  }, [customer]);

  const handleUpdateCustomer = (updated: Partial<CustomerDetails>) => {
    setCustomer((prev) => ({ ...prev, ...updated }));
  };

  // Switch restaurant view
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToFeed = () => {
    setSelectedRestaurant(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Management
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.menuItem.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null);
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);

  const currentActiveCity = NEPAL_CITIES.find((c) => c.id === selectedCityId) || NEPAL_CITIES[0];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans antialiased text-stone-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation with City Selector and Language Switcher */}
      <Navbar
        currentRestaurant={selectedRestaurant}
        onBackToFeed={handleBackToFeed}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        onOpenCart={() => {
          if (cart.length === 0 && !selectedRestaurant) {
            // Pick first restaurant of active city
            const cityMatch = restaurants.find(
              (r) => (r.city || '').toLowerCase().includes(currentActiveCity.name.toLowerCase())
            );
            setSelectedRestaurant(cityMatch || restaurants[0]);
          }
          setIsCartOpen(true);
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        selectedCityId={selectedCityId}
        onSelectCity={handleSelectCity}
      />

      {/* Main View: Either Restaurant Menu or Home Feed */}
      <div className="flex-1">
        {selectedRestaurant ? (
          <RestaurantMenu
            restaurant={selectedRestaurant}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenCart={() => setIsCartOpen(true)}
            onBackToFeed={handleBackToFeed}
            language={language}
          />
        ) : (
          <HomeFeed
            restaurants={restaurants}
            onSelectRestaurant={handleSelectRestaurant}
            language={language}
            selectedCityId={selectedCityId}
            onSelectCity={handleSelectCity}
          />
        )}
      </div>

      {/* Direct Order Cart Modal (with Triple-Action Checkout & Nepal Localized Delivery) */}
      {selectedRestaurant && (
        <DirectOrderModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          restaurant={selectedRestaurant}
          cart={cart}
          customer={customer}
          onUpdateCustomer={handleUpdateCustomer}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          language={language}
        />
      )}

      {/* Footer tailored for Kathmandu and Nepal Market */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 font-bold flex items-center justify-center text-base shrink-0">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-tight">DirectFood Nepal</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {currentActiveCity.name}
                </span>
                {currentActiveCity.isMainCity && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Main City
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {language === 'ne'
                  ? 'काठमाडौँ उपत्यका तथा नेपालका प्रमुख सहरहरूबाट कमिसन-रहित सिधा अर्डर (व्हाट्सएप, भाइबर र फोन कल)।'
                  : 'Bypassing commissions for kitchens in Kathmandu and major cities across Nepal.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-stone-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% to Kitchen
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              WhatsApp wa.me
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-purple-400" />
              Viber Deep Link
            </span>
            <span className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-rose-400" />
              eSewa / Khalti / Fonepay
            </span>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-1">
            Built for food lovers across Nepal{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}

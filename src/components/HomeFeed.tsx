import React, { useState, useMemo } from 'react';
import { Search, Star, Clock, MapPin, MessageCircle, Phone, Sparkles, Building2, ChevronRight, Navigation, ArrowUpDown } from 'lucide-react';
import { Restaurant, Language } from '../types.ts';
import { NEPAL_CITIES } from '../data/cities.ts';
import { WalletBadges } from './WalletBadges.tsx';
import { StarRating } from './StarRating.tsx';
import { t } from '../utils/i18n.ts';

interface HomeFeedProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  language: Language;
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  restaurants,
  onSelectRestaurant,
  language,
  selectedCityId,
  onSelectCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortByRating, setSortByRating] = useState(false);

  // Active City metadata
  const activeCity = useMemo(() => {
    return NEPAL_CITIES.find((c) => c.id === selectedCityId) || NEPAL_CITIES[0];
  }, [selectedCityId]);

  // Filter restaurants by active city first
  const cityRestaurants = useMemo(() => {
    if (selectedCityId === 'all') return restaurants;
    const cityNameLower = activeCity.name.toLowerCase();
    return restaurants.filter((r) => {
      const rCity = (r.city || '').toLowerCase();
      return rCity.includes(cityNameLower) || cityNameLower.includes(rCity);
    });
  }, [restaurants, selectedCityId, activeCity]);

  // Extract unique cuisines available in the city
  const cuisines = useMemo(() => {
    const list = Array.from(new Set(cityRestaurants.map((r) => r.cuisineType)));
    return ['All', ...list];
  }, [cityRestaurants]);

  // Top rated count (>= 4.8)
  const topRatedCount = useMemo(() => {
    return cityRestaurants.filter((r) => r.rating >= 4.8).length;
  }, [cityRestaurants]);

  // Filtered restaurants based on search, cuisine, area, open status, and rating
  const filteredRestaurants = useMemo(() => {
    const list = cityRestaurants.filter((r) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        r.name.toLowerCase().includes(query) ||
        (r.nameNepali && r.nameNepali.toLowerCase().includes(query)) ||
        r.cuisineType.toLowerCase().includes(query) ||
        (r.cuisineTypeNepali && r.cuisineTypeNepali.toLowerCase().includes(query)) ||
        r.contact.address.toLowerCase().includes(query) ||
        (r.contact.addressNepali && r.contact.addressNepali.toLowerCase().includes(query)) ||
        r.categories.some((c) =>
          c.items.some(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              (item.nameNepali && item.nameNepali.toLowerCase().includes(query)) ||
              item.description.toLowerCase().includes(query)
          )
        );

      const matchesCuisine = selectedCuisine === 'All' || r.cuisineType === selectedCuisine;
      const matchesArea =
        selectedArea === 'All' ||
        r.contact.address.toLowerCase().includes(selectedArea.toLowerCase());
      const matchesOpen = !onlyOpen || r.isOpen;
      const matchesRating = minRating === null || r.rating >= minRating;

      return matchesSearch && matchesCuisine && matchesArea && matchesOpen && matchesRating;
    });

    if (sortByRating) {
      return [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [cityRestaurants, searchQuery, selectedCuisine, selectedArea, onlyOpen, minRating, sortByRating]);

  return (
    <div className="w-full pb-16">
      {/* Hero Value Proposition */}
      <section className="bg-stone-900 text-stone-100 py-10 sm:py-14 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Zero Commission + Main City Pill */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-800/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t(language, 'zeroCommission')}</span>
              </div>

              {activeCity.isMainCity && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-800/70">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ne' ? 'काठमाडौँ उपत्यका - मुख्य राजधानी केन्द्र' : 'Kathmandu Valley - Main Capital Hub'}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {language === 'ne' ? (
                <>
                  {activeCity.nameNepali}को मौलिक खाना, <br className="hidden sm:inline" />
                  <span className="text-emerald-400">१००% सिधै भान्साबाट अर्डर।</span>
                </>
              ) : (
                <>
                  Fresh Food in {activeCity.name},{' '}
                  <br className="hidden sm:inline" />
                  <span className="text-emerald-400">Ordered 100% Direct.</span>
                </>
              )}
            </h1>

            <p className="mt-3 text-sm sm:text-base md:text-lg text-stone-300 leading-relaxed font-normal">
              {language === 'ne'
                ? `बिचौलियाको २५-३०% कमिसन हटाउनुहोस्। ${activeCity.nameNepali}का प्रख्यात रेस्टुरेन्टहरूबाट सिधै व्हाट्सएप, भाइबर वा फोन कल मार्फत अर्डर गर्नुहोस्। इसेवा, खल्ती, फोनपे क्युआर वा क्यास अन डेलिभरी मार्फत भुक्तानी गर्नुहोस्।`
                : `Skip 25-30% aggregator commissions. Connect directly with kitchens in ${activeCity.name} via WhatsApp, Viber, or phone call. Support local cooks and pay via eSewa, Khalti, Fonepay QR, or Cash on Delivery.`}
            </p>
          </div>

          {/* City Selection Bar */}
          <div className="mt-7 pt-5 border-t border-stone-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'ne' ? 'लक्षित सहर छनोट गर्नुहोस्:' : 'Target City in Nepal:'}
              </span>
              <span className="text-[11px] text-stone-400 hidden sm:inline">
                {language === 'ne' ? 'प्रमुख सहरका भान्साहरू' : 'Direct kitchen dispatch'}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {NEPAL_CITIES.map((city) => {
                const isActive = city.id === selectedCityId;
                return (
                  <button
                    key={city.id}
                    id={`city-tab-${city.id}`}
                    onClick={() => {
                      onSelectCity(city.id);
                      setSelectedArea('All');
                      setSelectedCuisine('All');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md border border-emerald-500'
                        : 'bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-750 border border-stone-700/70'
                    }`}
                  >
                    <span>{language === 'ne' ? city.nameNepali : city.name}</span>
                    {city.isMainCity && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isActive
                            ? 'bg-stone-900/60 text-amber-200'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {language === 'ne' ? 'राजधानी' : 'Capital'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar & Quick controls */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                id="input-restaurant-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeCity.id === 'kathmandu'
                    ? language === 'ne'
                      ? 'काठमाडौँ मोमो, छोइला, समय् बजि, थकाली, लाफिङ, सेकुवा खोज्नुहोस्...'
                      : 'Search Kathmandu Buff Mo:Mo, Choila, Samay Baji, Laphing, Thakali...'
                    : t(language, 'searchPlaceholder')
                }
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-400 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-white px-2 py-1 bg-stone-700 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-filter-top-rated"
                onClick={() => setMinRating(minRating !== null ? null : 4.8)}
                className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                  minRating !== null
                    ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-sm'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
                title="Filter to 4.8+ rated restaurants"
              >
                <Star
                  className={`w-4 h-4 ${
                    minRating !== null ? 'text-stone-950 fill-stone-950' : 'text-amber-400 fill-amber-400'
                  }`}
                />
                <span>{t(language, 'topRated')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    minRating !== null ? 'bg-stone-900 text-amber-300' : 'bg-stone-700 text-stone-300'
                  }`}
                >
                  {topRatedCount}
                </span>
              </button>

              <button
                id="btn-filter-open-only"
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shrink-0 ${
                  onlyOpen
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    onlyOpen ? 'bg-white' : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <span className="hidden sm:inline">{t(language, 'openOnly')}</span>
                <span className="sm:hidden">{language === 'ne' ? 'खुला' : 'Open'}</span>
              </button>
            </div>
          </div>

          {/* Popular Areas Quick Filter (e.g., Kathmandu: Baneshwor, Jhamsikhel, Thamel, Boudha, Lazimpat) */}
          {activeCity.popularAreas.length > 0 && (
            <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-stone-400 shrink-0 font-medium mr-1 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-stone-400" />
                {language === 'ne' ? 'क्षेत्र:' : 'Area:'}
              </span>
              <button
                id="area-filter-all"
                onClick={() => setSelectedArea('All')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedArea === 'All'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t(language, 'all')}
              </button>
              {activeCity.popularAreas.map((area) => (
                <button
                  key={area}
                  id={`area-filter-${area.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedArea(selectedArea === area ? 'All' : area)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                    selectedArea === area
                      ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                      : 'bg-stone-850 border-stone-750 text-stone-300 hover:text-white hover:bg-stone-750'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}

          {/* Cuisine Categories Pills */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {cuisines.map((cuisine) => {
              const matchedRestaurant = cityRestaurants.find((r) => r.cuisineType === cuisine);
              const label =
                language === 'ne' && matchedRestaurant?.cuisineTypeNepali
                  ? matchedRestaurant.cuisineTypeNepali
                  : cuisine === 'All'
                  ? t(language, 'all')
                  : cuisine;

              return (
                <button
                  key={cuisine}
                  id={`cuisine-filter-${cuisine.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCuisine === cuisine
                      ? 'bg-emerald-500 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700 border border-stone-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Rating Selection & Sorting Controls */}
          <div className="mt-3.5 pt-3 border-t border-stone-800/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <span className="text-stone-400 shrink-0 font-medium mr-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {language === 'ne' ? 'रेटिङ छनोट:' : 'Select Rating:'}
              </span>
              <button
                id="rating-filter-all"
                onClick={() => setMinRating(null)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  minRating === null
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-stone-400 hover:text-stone-200 border border-stone-800 bg-stone-850'
                }`}
              >
                {t(language, 'allRatings')}
              </button>
              <button
                id="rating-filter-4-8"
                onClick={() => setMinRating(minRating === 4.8 ? null : 4.8)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all border flex items-center gap-1 ${
                  minRating === 4.8
                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-sm'
                    : 'bg-stone-850 border-stone-750 text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <span>★ 4.8+</span>
                <span className="hidden sm:inline">{language === 'ne' ? 'उत्कृष्ट' : 'Top Rated'}</span>
              </button>
              <button
                id="rating-filter-4-9"
                onClick={() => setMinRating(minRating === 4.9 ? null : 4.9)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all border flex items-center gap-1 ${
                  minRating === 4.9
                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-sm'
                    : 'bg-stone-850 border-stone-750 text-stone-300 hover:text-white hover:bg-stone-750'
                }`}
              >
                <span>★ 4.9+</span>
                <span className="hidden sm:inline">{language === 'ne' ? 'असाधारण' : 'Outstanding'}</span>
              </button>
            </div>

            {/* Sort by rating toggle */}
            <button
              id="btn-sort-by-rating"
              onClick={() => setSortByRating(!sortByRating)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                sortByRating
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'bg-stone-850 border-stone-750 text-stone-300 hover:text-white hover:bg-stone-750'
              }`}
              title="Sort kitchens by highest rating first"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{t(language, 'sortByRating')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Restaurant Feed Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {language === 'ne'
                  ? `${activeCity.nameNepali}का प्रमाणित रेस्टुरेन्टहरू`
                  : `Popular Kitchens in ${activeCity.name}`}
              </h2>
              {activeCity.isMainCity && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {language === 'ne' ? 'मुख्य राजधानी' : 'Capital Hub'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {t(language, 'showingKitchens')} {activeCity.name} ({filteredRestaurants.length})
              {selectedArea !== 'All' && ` • Area: ${selectedArea}`}
            </p>
          </div>

          {/* Quick city switch dropdown prompt */}
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <span>{language === 'ne' ? 'अन्य सहर हेर्नुहोस्:' : 'Switch city:'}</span>
            <select
              value={selectedCityId}
              onChange={(e) => onSelectCity(e.target.value)}
              className="px-2 py-1 rounded-lg border border-stone-300 bg-white text-stone-800 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {NEPAL_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.isMainCity ? '★' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div
            id="empty-restaurants-state"
            className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8"
          >
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">
              {language === 'ne' ? 'कुनै रेस्टुरेन्ट भेटिएन' : `No restaurants found in ${activeCity.name}`}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
              {language === 'ne'
                ? 'तपाईंको खोजी अनुसार कुनै परिणाम फेला परेन। कृपया फिल्टर हटाउनुहोस् वा अर्को सहर छान्नुहोस्।'
                : "We couldn't find any kitchen matching your current filter in this city. Try resetting filters or switching city."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCuisine('All');
                  setSelectedArea('All');
                  setOnlyOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                {language === 'ne' ? 'सबै फिल्टर हटाउनुहोस्' : 'Reset All Filters'}
              </button>
              {selectedCityId !== 'kathmandu' && (
                <button
                  onClick={() => onSelectCity('kathmandu')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
                >
                  {language === 'ne' ? 'काठमाडौँ उपत्यका हेर्नुहोस्' : 'View Kathmandu Valley (Main City)'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                id={`restaurant-card-${restaurant.id}`}
                onClick={() => onSelectRestaurant(restaurant)}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-500/50 transition-all duration-200 cursor-pointer flex flex-col text-left"
              >
                {/* Hero Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={restaurant.heroImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Open / Closed Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        restaurant.isOpen
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-800/90 text-stone-300'
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

                  {/* Cuisine Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900/80 backdrop-blur-sm text-stone-100 border border-white/10 shadow-sm">
                      {language === 'ne' && restaurant.cuisineTypeNepali
                        ? restaurant.cuisineTypeNepali
                        : restaurant.cuisineType}
                    </span>
                  </div>

                  {/* Rating Pill overlay at bottom */}
                  <div className="absolute bottom-3 left-3 flex items-center px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm border border-white/10 shadow-sm">
                    <StarRating
                      id={`card-overlay-rating-${restaurant.id}`}
                      rating={restaurant.rating}
                      reviewCount={restaurant.reviewCount}
                      size="xs"
                      theme="dark"
                      showCount={true}
                      language={language}
                    />
                  </div>
                </div>

                {/* Restaurant Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {language === 'ne' && restaurant.nameNepali ? restaurant.nameNepali : restaurant.name}
                    </h3>

                    {/* 5-Star Rating Component on Card Body */}
                    <div className="mt-2 flex items-center">
                      <StarRating
                        id={`card-body-rating-${restaurant.id}`}
                        rating={restaurant.rating}
                        reviewCount={restaurant.reviewCount}
                        size="sm"
                        theme="light"
                        showTopBadge={true}
                        language={language}
                      />
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-1 mt-1.5 font-medium">
                      {language === 'ne' && restaurant.taglineNepali ? restaurant.taglineNepali : restaurant.tagline}
                    </p>

                    {/* Operational Details (City & Address) */}
                    <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-stone-600 border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{restaurant.deliveryInfo.timeEstimate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-emerald-800">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[220px]">
                          {language === 'ne' && restaurant.contact.addressNepali
                            ? restaurant.contact.addressNepali
                            : restaurant.contact.address}
                        </span>
                      </div>
                    </div>

                    {/* Direct Wallet Payments on Card */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                        {language === 'ne' ? 'स्वीकृत डिजिटल वालेट:' : 'Accepted Direct Payments:'}
                      </span>
                      <WalletBadges wallets={restaurant.contact.acceptedWallets} size="sm" />
                    </div>
                  </div>

                  {/* Direct Contact Channels Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        WhatsApp
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-bold">
                        <Phone className="w-3 h-3 text-purple-600" />
                        Viber
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                      {t(language, 'viewMenu')} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

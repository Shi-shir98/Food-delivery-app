export type Language = 'en' | 'ne';

export type DigitalWallet = 'eSewa' | 'Khalti' | 'Fonepay QR' | 'Cash on Delivery';

export interface MenuItem {
  id: string;
  name: string;
  nameNepali?: string;
  description: string;
  descriptionNepali?: string;
  price: number; // in Nepalese Rupees (Rs. / NPR)
  category: string;
  image: string;
  dietaryBadges?: string[];
  popular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameNepali?: string;
  items: MenuItem[];
}

export interface RestaurantContact {
  whatsAppNumber: string; // Clean number with Nepal country code (e.g. '9779857012345')
  formattedWhatsApp: string; // e.g. '+977 98570-12345'
  viberNumber: string; // Number for viber://chat?number=
  formattedViber: string;
  phoneNumber: string; // For tel: links
  formattedPhone: string;
  address: string; // e.g. 'Traffic Chowk, Ward 6, Butwal'
  addressNepali?: string;
  acceptedWallets: string[]; // ['eSewa', 'Khalti', 'Fonepay QR', 'Cash on Delivery']
  directPaymentMethods: string[];
}

export interface DeliveryInfo {
  timeEstimate: string;
  minOrder: number; // in Rs.
  deliveryFeeEstimate: string; // e.g. 'Rs. 40 (Free over Rs. 500)'
  radiusKm: number;
}

export interface CityOption {
  id: string;
  name: string;
  nameNepali: string;
  isMainCity?: boolean;
  tagline: string;
  taglineNepali: string;
  popularAreas: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  nameNepali?: string;
  city: string; // e.g. 'Kathmandu', 'Pokhara', 'Butwal'
  cityNepali?: string;
  tagline: string;
  taglineNepali?: string;
  heroImage: string;
  logoImage?: string;
  cuisineType: string;
  cuisineTypeNepali?: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: string;
  deliveryInfo: DeliveryInfo;
  contact: RestaurantContact;
  categories: MenuCategory[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string; // e.g. 98XXXXXXXX
  city: string; // e.g. 'Kathmandu'
  wardNo: string; // Ward Number (e.g. 'Ward No. 10')
  toleStreet: string; // Tole / Street (e.g. 'New Baneshwor')
  nearestLandmark: string; // Nearest Landmark (e.g. 'Opposite Bhatbhateni Supermarket')
  deliveryNotes: string;
  paymentPreference: string;
}


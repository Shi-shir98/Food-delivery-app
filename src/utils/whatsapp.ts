import { CartItem, CustomerDetails, Restaurant, Language } from '../types.ts';
import { formatLocalizedOrderMessage, generateWhatsAppUrl as genWAUrl } from './messaging.ts';

export function formatWhatsAppOrderMessage(
  restaurant: Restaurant,
  cart: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  deliveryFee: number = 0,
  language: Language = 'en'
): string {
  return formatLocalizedOrderMessage(restaurant, cart, customer, subtotal, deliveryFee, language);
}

export function generateWhatsAppUrl(
  restaurant: Restaurant,
  cart: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  deliveryFee: number = 0,
  language: Language = 'en'
): string {
  return genWAUrl(restaurant, cart, customer, subtotal, deliveryFee, language);
}

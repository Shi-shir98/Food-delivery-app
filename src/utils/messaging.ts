import { CartItem, CustomerDetails, Restaurant, Language } from '../types.ts';

export function formatLocalizedOrderMessage(
  restaurant: Restaurant,
  cart: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  deliveryFee: number = 0,
  lang: Language = 'en'
): string {
  const lines: string[] = [];
  const isNepali = lang === 'ne';

  if (isNepali) {
    lines.push(`नमस्ते ${restaurant.nameNepali || restaurant.name}! 🙏`);
    lines.push(`म डाइरेक्ट फुड मार्फत डेलिभरी अर्डर गर्न चाहन्छु:`);
    lines.push(``);
    lines.push(`📋 *अर्डर गरिएका परिकारहरू:*`);
  } else {
    lines.push(`Namaste ${restaurant.name}! 🙏`);
    lines.push(`I would like to place a direct delivery order:`);
    lines.push(``);
    lines.push(`📋 *ORDER ITEMS:*`);
  }

  cart.forEach((item) => {
    const itemTotal = item.menuItem.price * item.quantity;
    const itemName = isNepali && item.menuItem.nameNepali ? item.menuItem.nameNepali : item.menuItem.name;
    lines.push(`• ${item.quantity}x ${itemName} — Rs. ${itemTotal}`);
    if (item.specialInstructions && item.specialInstructions.trim()) {
      lines.push(`  ↳ नोट: _${item.specialInstructions.trim()}_`);
    }
  });

  const total = subtotal + deliveryFee;
  lines.push(``);
  if (isNepali) {
    lines.push(`💰 *रकम विवरण:*`);
    lines.push(`• परिकार जम्मा: Rs. ${subtotal}`);
    if (deliveryFee > 0) {
      lines.push(`• डेलिभरी शुल्क: Rs. ${deliveryFee}`);
    }
    lines.push(`• *कुल भुक्तानी: Rs. ${total}*`);
    lines.push(``);
    const cityNameNe = restaurant.cityNepali || restaurant.city || 'काठमाडौँ';
    lines.push(`📍 *${cityNameNe} डेलिभरी ठेगाना:*`);
    lines.push(`• ग्राहकको नाम: ${customer.name.trim() || 'उल्लेख छैन'}`);
    lines.push(`• मोबाइल नम्बर: ${customer.phone.trim() || 'उल्लेख छैन'}`);
    if (customer.wardNo.trim()) {
      lines.push(`• वडा नम्बर: ${customer.wardNo.trim()}`);
    }
    if (customer.toleStreet.trim()) {
      lines.push(`• टोल / सडक: ${customer.toleStreet.trim()}`);
    }
    if (customer.nearestLandmark.trim()) {
      lines.push(`• नजिकको ल्याण्डमार्क: ${customer.nearestLandmark.trim()}`);
    }
    if (customer.deliveryNotes.trim()) {
      lines.push(`• विशेष निर्देशन: ${customer.deliveryNotes.trim()}`);
    }
    lines.push(`• भुक्तानी माध्यम: ${customer.paymentPreference || 'Cash on Delivery'}`);
    lines.push(``);
    lines.push(`🚀 डाइरेक्ट अर्डर (०% प्लेटफर्म कमिसन - १००% रेस्टुरेन्टलाई)`);
  } else {
    lines.push(`💰 *PRICE BREAKDOWN:*`);
    lines.push(`• Items Subtotal: Rs. ${subtotal}`);
    if (deliveryFee > 0) {
      lines.push(`• Delivery Charge: Rs. ${deliveryFee}`);
    }
    lines.push(`• *Total Payable: Rs. ${total}*`);
    lines.push(``);
    const cityNameEn = (restaurant.city || 'Kathmandu').toUpperCase();
    lines.push(`📍 *DELIVERY DETAILS (${cityNameEn}):*`);
    lines.push(`• Customer Name: ${customer.name.trim() || 'Not specified'}`);
    lines.push(`• Mobile Phone: ${customer.phone.trim() || 'Not specified'}`);
    if (customer.wardNo.trim()) {
      lines.push(`• Ward Number: ${customer.wardNo.trim()}`);
    }
    if (customer.toleStreet.trim()) {
      lines.push(`• Tole / Street: ${customer.toleStreet.trim()}`);
    }
    if (customer.nearestLandmark.trim()) {
      lines.push(`• Nearest Landmark: ${customer.nearestLandmark.trim()}`);
    }
    if (customer.deliveryNotes.trim()) {
      lines.push(`• Delivery Note: ${customer.deliveryNotes.trim()}`);
    }
    lines.push(`• Payment Preference: ${customer.paymentPreference || 'Cash on Delivery'}`);
    lines.push(``);
    lines.push(`🚀 Placed directly via DirectFood ${restaurant.city || 'Nepal'} (0% Commission)`);
  }

  return lines.join('\n');
}

/**
 * Generate official WhatsApp wa.me API link
 */
export function generateWhatsAppUrl(
  restaurant: Restaurant,
  cart: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  deliveryFee: number = 0,
  lang: Language = 'en'
): string {
  const message = formatLocalizedOrderMessage(restaurant, cart, customer, subtotal, deliveryFee, lang);
  const cleanPhone = restaurant.contact.whatsAppNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate official Viber viber://chat deep link
 */
export function generateViberDeepLink(
  restaurant: Restaurant
): string {
  // Viber protocol accepts international phone number without leading + or with URL encoded %2B
  const cleanPhone = restaurant.contact.viberNumber.replace(/\D/g, '');
  return `viber://chat?number=%2B${cleanPhone}`;
}

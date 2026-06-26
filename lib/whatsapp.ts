import { OrderItem } from '@/types';
import { formatRupiah } from './utils';

export function generateOrderMessage(items: OrderItem[]): string {
  let message = 'Halo KWT Loh Jinawi 1! Saya ingin memesan:\n\n';
  let grandTotal = 0;

  items.forEach((item) => {
    const subtotal = item.qty * item.price;
    grandTotal += subtotal;
    const unit = item.unit || 'bungkus';
    message += `${item.name} × ${item.qty} ${unit} = ${formatRupiah(subtotal)}\n`;
  });

  message += `\nTotal: ${formatRupiah(grandTotal)}\n\n`;
  message += 'Mohon konfirmasi ketersediaan dan info pengiriman. Terima kasih 🙏';

  return message;
}

export function generateWhatsAppUrl(message: string, phone?: string): string {
  const adminPhone = phone || process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890';
  // Clean phone number: remove +, -, spaces
  const cleanPhone = adminPhone.replace(/[+\-\s]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateQuickOrderUrl(productName: string, qty: number, price: number, unit: string = 'bungkus'): string {
  const message = generateOrderMessage([{ name: productName, qty, price, unit }]);
  return generateWhatsAppUrl(message);
}

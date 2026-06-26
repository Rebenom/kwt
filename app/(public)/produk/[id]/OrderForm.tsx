'use client';

import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { generateOrderMessage, generateWhatsAppUrl } from '@/lib/whatsapp';

interface OrderFormProps {
  product: Product;
}

export default function OrderForm({ product }: OrderFormProps) {
  const [qty, setQty] = useState(1);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQty(1);
    } else if (value > product.stock) {
      setQty(product.stock);
    } else {
      setQty(value);
    }
  };

  const handleOrder = () => {
    const message = generateOrderMessage([
      {
        name: product.name,
        qty,
        price: product.price,
        unit: product.unit,
      },
    ]);
    const url = generateWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  const handleRestockInquiry = () => {
    const message = `Halo KWT Loh Jinawi 1! Apakah produk "${product.name}" sudah tersedia kembali? Saya tertarik untuk memesannya. Terima kasih.`;
    const url = generateWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  if (isOutOfStock) {
    return (
      <div className="flex flex-col gap-3">
        <Button disabled fullWidth variant="secondary" className="font-bold py-3">
          Stok Habis
        </Button>
        <Button
          fullWidth
          variant="primary"
          icon={<MessageCircle className="w-5 h-5 fill-current" />}
          className="font-bold py-3"
          onClick={handleRestockInquiry}
        >
          Tanyakan Restok via WhatsApp
        </Button>
      </div>
    );
  }

  const subtotal = qty * product.price;

  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50/70">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Jumlah Pesanan:</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
          <button
            type="button"
            onClick={handleDecrement}
            className="p-2 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-200"
            disabled={qty <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={handleInputChange}
            className="w-12 text-center text-sm font-bold text-gray-900 focus:outline-none border-none py-1.5"
          />
          <button
            type="button"
            onClick={handleIncrement}
            className="p-2 text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-200"
            disabled={qty >= product.stock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <span className="text-sm font-semibold text-gray-600">Subtotal:</span>
        <span className="text-xl font-extrabold text-primary">{formatRupiah(subtotal)}</span>
      </div>

      <Button
        fullWidth
        size="lg"
        icon={<ShoppingCart className="w-5 h-5" />}
        className="font-extrabold shadow-sm py-3"
        onClick={handleOrder}
      >
        Pesan via WhatsApp
      </Button>
    </div>
  );
}

"use client";

import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { GroceryItem as GroceryType } from '@/types';

export default function GroceryItem({
  item,
  onUpdate,
}: {
  item: GroceryType;
  onUpdate: () => void;
}) {
  const togglePurchased = async () => {
    try {
      // Correct endpoint: PATCH /api/groceries/{id}/toggle
      await api.patch(`/groceries/${item.id}/toggle`);
      onUpdate();
    } catch {
      toast.error('Failed to update item.');
    }
  };

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-[20px] border-2 transition-all duration-300 group"
      style={{
        background: item.isPurchased ? 'var(--mint-green)' : 'var(--base-white)',
        borderColor: item.isPurchased ? 'var(--base-white)' : 'var(--bg-cream)',
        opacity: item.isPurchased ? 0.8 : 1,
        transform: item.isPurchased ? 'scale(0.99)' : 'scale(1)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Custom Checkbox */}
      <button
        onClick={togglePurchased}
        className="flex-shrink-0 w-8 h-8 rounded-full border-3 transition-all duration-200 flex items-center justify-center"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: item.isPurchased ? 'none' : '3px solid var(--sky-blue)',
          background: item.isPurchased ? '#2B7A2B' : 'transparent',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        aria-label={item.isPurchased ? 'Mark as not purchased' : 'Mark as purchased'}
      >
        {item.isPurchased && (
          <span style={{ color: 'white', fontSize: '1rem', fontWeight: 900 }}>✓</span>
        )}
      </button>

      {/* Item name */}
      <span
        className="flex-1 font-bold text-base transition-all duration-300"
        style={{
          color: item.isPurchased ? '#2B7A2B' : 'var(--dark-brown)',
          textDecoration: item.isPurchased ? 'line-through' : 'none',
        }}
      >
        {item.name}
      </span>

      {/* Status badge */}
      {item.isPurchased && (
        <span className="text-xs font-black px-2.5 py-1 rounded-full border-2 border-white"
          style={{ background: 'var(--base-white)', color: '#2B7A2B' }}>
          ✓ Got it!
        </span>
      )}
    </div>
  );
}

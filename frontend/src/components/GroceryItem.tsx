"use client";

import { api } from '@/lib/api';

export default function GroceryItem({ item, onUpdate }: { item: any, onUpdate: () => void }) {
  const togglePurchased = async () => {
    await api.patch(`/groceries/${item.id}`);
    onUpdate();
  };

  return (
    <div onClick={togglePurchased} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1.5rem', 
      padding: '1.5rem',
      cursor: 'pointer',
      backgroundColor: item.isPurchased ? 'var(--pink-light)' : 'var(--base-white)',
      opacity: item.isPurchased ? 0.7 : 1,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: item.isPurchased ? 'scale(0.98)' : 'scale(1)',
      borderLeft: item.isPurchased ? '6px solid var(--baby-pink)' : '6px solid var(--sky-blue)',
      borderRadius: '20px',
      boxShadow: '0 2px 8px rgba(139,94,52,0.06)',
      border: `2px solid ${item.isPurchased ? 'var(--baby-pink)' : 'transparent'}`,
    }}>
      
      {/* Custom Checkbox */}
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        border: item.isPurchased ? 'none' : '3px solid var(--sky-blue)',
        backgroundColor: item.isPurchased ? 'var(--baby-pink)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        flexShrink: 0
      }}>
        {item.isPurchased && <span style={{ color: 'var(--dark-brown)', fontSize: '1.2rem', fontWeight: 900 }}>✓</span>}
      </div>

      <span style={{ 
        flex: 1,
        fontSize: '1.25rem',
        fontWeight: 700,
        color: item.isPurchased ? 'var(--text-muted)' : 'var(--dark-brown)',
        textDecoration: item.isPurchased ? 'line-through' : 'none',
        transition: 'all 0.3s ease'
      }}>
        {item.name}
      </span>
      
    </div>
  );
}

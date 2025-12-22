// src/components/letter-designer/AssetStore.tsx

import React, { useState } from 'react';
import { ASSETS, AssetItem } from './assets';

interface AssetStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'envelope' | 'paper' | 'background', item: AssetItem) => void;
}

export const AssetStore: React.FC<AssetStoreProps> = ({ isOpen, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState<'envelope' | 'paper' | 'background'>('envelope');

  if (!isOpen) return null;

  let currentItems: AssetItem[] = [];
  if (activeTab === 'envelope') currentItems = ASSETS.envelopes;
  else if (activeTab === 'paper') currentItems = ASSETS.papers;
  else currentItems = ASSETS.backgrounds;

  const getTabStyle = (tabName: string): React.CSSProperties => ({
    ...styles.tab,
    borderBottom: activeTab === tabName ? '3px solid #4a90e2' : 'none',
    color: activeTab === tabName ? '#fff' : '#888'
  });

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        <div style={styles.header}>
          <h2 style={styles.title}>🏪 Cửa Hàng Vật Phẩm</h2>
          <button style={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <div style={styles.tabs}>
          <button style={getTabStyle('envelope')} onClick={() => setActiveTab('envelope')}>
            ✉️ Phong Bì
          </button>
          <button style={getTabStyle('paper')} onClick={() => setActiveTab('paper')}>
            📄 Giấy Thư
          </button>
          <button style={getTabStyle('background')} onClick={() => setActiveTab('background')}>
            🌄 Phông Nền
          </button>
        </div>

        <div style={styles.grid}>
          {currentItems.map((item) => (
            <div 
              key={item.id} 
              style={styles.card}
              onClick={() => {
                onSelect(activeTab, item);
                onClose();
              }}
            >
              <div style={styles.imageWrapper}>
                {item.thumb ? (
                   <img src={item.thumb} alt={item.name} style={styles.image} />
                ) : (
                   <div style={{...styles.image, background: item.color}} />
                )}
              </div>
              <div style={styles.cardInfo}>
                <div style={styles.cardName}>{item.name}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// --- STYLES ---
const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: '850px',
    height: '600px',
    backgroundColor: '#181818',
    borderRadius: '8px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  header: {
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #222',
    flexShrink: 0,
  },
  title: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: '1px',
    margin: 0,
  },
  btnClose: {
    background: 'none',
    border: 'none',
    color: '#555',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
  },
  tabs: {
    display: 'flex',
    background: '#121212',
    padding: '0 20px',
    gap: '10px',
    flexShrink: 0,
  },
  tab: {
    padding: '15px 20px',
    background: 'none',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.5px',
  },
  grid: {
    flex: 1,
    padding: '25px',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gridAutoRows: 'min-content',
    alignContent: 'start',
    gap: '20px',
    background: '#181818',
  },
  card: {
    background: '#222',
    borderRadius: '6px',
    border: '1px solid #333',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    width: '100%',
    height: '130px',
    backgroundColor: '#111',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardInfo: {
    padding: '12px',
    textAlign: 'left',
    borderTop: '1px solid #2a2a2a',
  },
  cardName: {
    fontSize: '12px',
    color: '#eee',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
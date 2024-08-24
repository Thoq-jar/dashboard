import React from 'react';

export default function Wallpaper({ backgroundImage }: { backgroundImage: string }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      backgroundSize: 'cover',
      backgroundImage: `url(${backgroundImage})`,
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        zIndex: 1,
      }} />
    </div>
  );
}
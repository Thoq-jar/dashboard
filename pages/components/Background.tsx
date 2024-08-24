import React from 'react';

interface WallpaperProps {
  backgroundImage: string;
  tintColor: string;
}

export default function Wallpaper({ backgroundImage }: WallpaperProps) {
  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundBlendMode: 'multiply',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: -1,
    }} />
  );
}
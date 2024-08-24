'use client';
import React from 'react';
import PanelContents from './PanelContents';

export default function Panel({ onImageUpload, onRevertToDefault }: { onImageUpload: (base64Image: string) => void, onRevertToDefault: () => void }) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      position: 'fixed',
      top: '50%',
      left: '50%',
      borderRadius: '50px',
      height: '78%',
      width: '80%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      padding: '10px',
    }}>
      <div style={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}>
        <PanelContents onImageUpload={onImageUpload} onRevertToDefault={onRevertToDefault} />
      </div>
    </div>
  );
}
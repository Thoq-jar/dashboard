'use client';
import React from 'react';
import { PanelContents } from './PanelContents';

export default function Panel() {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(15px)',
      position: 'fixed',
      top: '50%',
      left: '50%',
      borderRadius: '50px',
      height: '80%',
      width: '70%',
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
        <PanelContents />
      </div>
    </div>
  );
}
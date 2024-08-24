import { Wallpaper } from './components/background';
import { Panel } from './components/panel';
import React from 'react';

export default function Home() {
  return (
    <>
      <Panel />
      <Wallpaper />
    </>
  );
}
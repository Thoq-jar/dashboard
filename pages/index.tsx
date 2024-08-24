import Wallpaper from './components/Background';
import Panel from './components/Panel';
import React from 'react';

export default function Home() {
  return (
    <>
      <title>Dashboard</title>
      <Panel />
      <Wallpaper />
    </>
  );
}
import Wallpaper from './components/Background';
import Panel from './components/Panel';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const defaultImage = 'background.jpg';
  const [backgroundImage, setBackgroundImage] = useState(defaultImage);

  useEffect(() => {
    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
  }, []);

  const handleImageUpload = (base64Image: string) => {
    setBackgroundImage(base64Image);
    localStorage.setItem('backgroundImage', base64Image);
  };

  const handleRevertToDefault = () => {
    setBackgroundImage(defaultImage);
    localStorage.removeItem('backgroundImage');
  };

  return (
    <>
      <Wallpaper backgroundImage={backgroundImage} />
      <Panel onImageUpload={handleImageUpload} onRevertToDefault={handleRevertToDefault} />
    </>
  );
}
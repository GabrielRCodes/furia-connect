'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function HomeLogo() {
  const [imgSrc, setImgSrc] = useState("https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png");

  const handleError = () => {
    setImgSrc("https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80");
  };

  return (
    <div className="mx-auto w-64 h-64 relative mb-4">
      <Image 
        src={imgSrc}
        alt="FURIA Connect Logo"
        width={256}
        height={256}
        className="rounded-full"
        onError={handleError}
      />
    </div>
  );
} 
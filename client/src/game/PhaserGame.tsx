import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-container',
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
    },
  },
  backgroundColor: '#111827',
};

export const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="phaser-container" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} />;
};

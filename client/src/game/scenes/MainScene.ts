import Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import { GameStatePayload, PlayerInputPayload } from '../../types/game';

export class MainScene extends Phaser.Scene {
  private socket!: Socket;
  private players: Record<string, { sprite: Phaser.GameObjects.Sprite, hpBar: Phaser.GameObjects.Graphics }> = {};
  private projectiles: Record<string, Phaser.GameObjects.Rectangle> = {};
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private starfield!: Phaser.GameObjects.TileSprite;

  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('player_ship', '/assets/player_ship.png');
    this.load.image('enemy_ship', '/assets/enemy_ship.png');
  }

  create() {
    // Create scrolling starfield background
    this.starfield = this.add.tileSprite(400, 300, 800, 600, 'player_ship'); 
    // Wait, we don't have a starfield asset, let's draw a grid using Graphics instead
    this.starfield.destroy();
    
    const grid = this.add.graphics();
    grid.lineStyle(1, 0xffffff, 0.1);
    for (let i = 0; i < 800; i += 40) {
      grid.moveTo(i, 0); grid.lineTo(i, 600);
    }
    for (let i = 0; i < 600; i += 40) {
      grid.moveTo(0, i); grid.lineTo(800, i);
    }
    grid.strokePath();

    this.add.text(10, 10, 'StellarStrike Arena', { color: '#0ea5e9', fontSize: '20px', fontStyle: 'bold' });

    // Initialize Socket.io to port 3002
    this.socket = io('http://localhost:3002');

    this.socket.on('gameStateUpdate', (state: GameStatePayload) => {
      // 1. Remove disconnected or dead players
      for (const id in this.players) {
        if (!state.players[id] || state.players[id].health <= 0) {
          this.players[id].sprite.destroy();
          this.players[id].hpBar.destroy();
          delete this.players[id];
        }
      }

      // 2. Update or add players
      for (const id in state.players) {
        const pState = state.players[id];
        if (pState.health <= 0) continue;

        if (!this.players[id]) {
          // Create new player sprite
          const texture = id === this.socket.id ? 'player_ship' : 'enemy_ship';
          const sprite = this.add.sprite(pState.x, pState.y, texture);
          sprite.setDisplaySize(64, 64); // Scale the AI generated sprite down
          
          const hpBar = this.add.graphics();
          this.players[id] = { sprite, hpBar };
        }

        // Update position and rotation
        const pObj = this.players[id];
        pObj.sprite.x = pState.x;
        pObj.sprite.y = pState.y;
        pObj.sprite.rotation = pState.rotation + Math.PI / 2; // Adjust rotation if sprite is drawn pointing up

        // Update Health Bar
        pObj.hpBar.clear();
        pObj.hpBar.fillStyle(0x000000, 0.8);
        pObj.hpBar.fillRect(pState.x - 20, pState.y - 45, 40, 6);
        pObj.hpBar.fillStyle(pState.health > 50 ? 0x00ff00 : 0xff0000, 1);
        pObj.hpBar.fillRect(pState.x - 20, pState.y - 45, 40 * (pState.health / 100), 6);
      }

      // 3. Update projectiles
      // Remove dead projectiles
      for (const pid in this.projectiles) {
        if (!state.projectiles || !state.projectiles[pid]) {
          this.projectiles[pid].destroy();
          delete this.projectiles[pid];
        }
      }

      // Add or update active projectiles
      if (state.projectiles) {
        for (const pid in state.projectiles) {
          const proj = state.projectiles[pid];
          if (!this.projectiles[pid]) {
            const color = proj.ownerId === this.socket.id ? 0x00ffff : 0xff0000;
            const rect = this.add.rectangle(proj.x, proj.y, 16, 4, color);
            this.projectiles[pid] = rect;
          }
          this.projectiles[pid].x = proj.x;
          this.projectiles[pid].y = proj.y;
          this.projectiles[pid].rotation = proj.rotation;
        }
      }
    });

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Clean up socket when scene is destroyed
    this.events.on('shutdown', () => {
      if (this.socket) {
        this.socket.disconnect();
      }
    });
  }

  update() {
    if (!this.socket || !this.socket.connected) return;

    const pointer = this.input.activePointer;

    // Send input to server safely
    const input: PlayerInputPayload = {
      up: (this.cursors && this.cursors.up.isDown) || (this.wKey && this.wKey.isDown) || false,
      down: (this.cursors && this.cursors.down.isDown) || (this.sKey && this.sKey.isDown) || false,
      left: (this.cursors && this.cursors.left.isDown) || (this.aKey && this.aKey.isDown) || false,
      right: (this.cursors && this.cursors.right.isDown) || (this.dKey && this.dKey.isDown) || false,
      shoot: (pointer && pointer.leftButtonDown()) || (this.spaceKey && this.spaceKey.isDown) || false,
      rotation: 0
    };

    try {
      if (this.socket.id && this.players[this.socket.id] && pointer) {
         const myPlayer = this.players[this.socket.id].sprite;
         input.rotation = Phaser.Math.Angle.Between(myPlayer.x, myPlayer.y, pointer.x, pointer.y);
      }
    } catch (err) {
      console.error("Error calculating rotation:", err);
    }

    this.socket.emit('playerInput', input);
  }
}

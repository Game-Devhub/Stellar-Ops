import Phaser from 'phaser';
import { io, Socket } from 'socket.io-client';
import { GameStatePayload, PlayerInputPayload } from '../../types/game';

export class MainScene extends Phaser.Scene {
  private socket!: Socket;
  private players: Record<string, Phaser.GameObjects.Rectangle> = {};
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('MainScene');
  }

  create() {
    this.add.text(10, 10, 'StellarStrike Arena', { color: '#0f0' });

    // Initialize Socket.io
    this.socket = io('http://localhost:3001');

    this.socket.on('gameStateUpdate', (state: GameStatePayload) => {
      // Remove disconnected players
      for (const id in this.players) {
        if (!state.players[id]) {
          this.players[id].destroy();
          delete this.players[id];
        }
      }

      // Update or add players
      for (const id in state.players) {
        const pState = state.players[id];
        if (!this.players[id]) {
          // Create new player square
          const color = id === this.socket.id ? 0x00ff00 : 0xff0000;
          this.players[id] = this.add.rectangle(pState.x, pState.y, 32, 32, color);
        } else {
          // Update position
          this.players[id].x = pState.x;
          this.players[id].y = pState.y;
          this.players[id].rotation = pState.rotation;
        }
      }
    });

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  update() {
    if (!this.socket || !this.socket.connected) return;

    // Send input to server
    const input: PlayerInputPayload = {
      up: this.cursors.up.isDown || this.wKey.isDown,
      down: this.cursors.down.isDown || this.sKey.isDown,
      left: this.cursors.left.isDown || this.aKey.isDown,
      right: this.cursors.right.isDown || this.dKey.isDown,
      rotation: 0 // We'll skip mouse aim rotation for now to keep it simple, or implement it if needed
    };

    // Calculate rotation towards mouse if we wanted to
    const pointer = this.input.activePointer;
    if (this.socket.id && this.players[this.socket.id]) {
       const myPlayer = this.players[this.socket.id];
       input.rotation = Phaser.Math.Angle.Between(myPlayer.x, myPlayer.y, pointer.x, pointer.y);
    }

    this.socket.emit('playerInput', input);
  }
}

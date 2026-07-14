import { PlayerState, PlayerInputPayload } from '../types/game';

export class GameState {
  public players: Record<string, PlayerState> = {};

  addPlayer(id: string) {
    this.players[id] = {
      id,
      x: Math.random() * 600 + 100, // Random spawn
      y: Math.random() * 400 + 100,
      rotation: 0,
      health: 100
    };
  }

  removePlayer(id: string) {
    delete this.players[id];
  }

  handlePlayerInput(id: string, input: PlayerInputPayload) {
    const player = this.players[id];
    if (!player) return;

    const speed = 5;
    if (input.up) player.y -= speed;
    if (input.down) player.y += speed;
    if (input.left) player.x -= speed;
    if (input.right) player.x += speed;

    player.rotation = input.rotation;
  }

  getState() {
    return { players: this.players };
  }
}

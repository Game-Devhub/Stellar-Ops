export interface PlayerState {
  id: string;
  x: number;
  y: number;
  rotation: number;
  health: number;
}

export interface GameStatePayload {
  players: Record<string, PlayerState>;
}

export interface PlayerInputPayload {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  rotation: number;
}

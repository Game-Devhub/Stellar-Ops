export interface PlayerState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  health: number;
  score: number;
}

export interface ProjectileState {
  id: string;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  ownerId: string;
  life: number;
}

export interface GameStatePayload {
  players: Record<string, PlayerState>;
  projectiles: Record<string, ProjectileState>;
}

export interface PlayerInputPayload {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
  rotation: number;
}

import { PlayerState, PlayerInputPayload, ProjectileState } from '../types/game';

export class GameState {
  public players: Record<string, PlayerState> = {};
  public projectiles: Record<string, ProjectileState> = {};
  private lastShootTime: Record<string, number> = {};
  private projectileIdCounter = 0;

  addPlayer(id: string) {
    this.players[id] = {
      id,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      vx: 0,
      vy: 0,
      rotation: 0,
      health: 100,
      score: 0
    };
    this.lastShootTime[id] = 0;
  }

  removePlayer(id: string) {
    delete this.players[id];
    delete this.lastShootTime[id];
  }

  handlePlayerInput(id: string, input: PlayerInputPayload) {
    const player = this.players[id];
    if (!player || player.health <= 0) return;

    // Apply thrust based on input (W/S/A/D moves in world space for now, or relative to rotation if desired. Let's do world space)
    const acceleration = 0.5;
    if (input.up) player.vy -= acceleration;
    if (input.down) player.vy += acceleration;
    if (input.left) player.vx -= acceleration;
    if (input.right) player.vx += acceleration;

    player.rotation = input.rotation;

    // Shooting
    if (input.shoot) {
      const now = Date.now();
      if (now - this.lastShootTime[id] > 200) { // 200ms cooldown
        this.lastShootTime[id] = now;
        this.spawnProjectile(player);
      }
    }
  }

  private spawnProjectile(player: PlayerState) {
    this.projectileIdCounter++;
    const pid = `proj_${this.projectileIdCounter}`;
    
    // Spawn projectile at player position, moving in direction of rotation
    const speed = 15;
    this.projectiles[pid] = {
      id: pid,
      x: player.x + Math.cos(player.rotation) * 20,
      y: player.y + Math.sin(player.rotation) * 20,
      rotation: player.rotation,
      speed: speed,
      ownerId: player.id,
      life: 60 // 60 frames = 1 second
    };
  }

  update() {
    // Update players
    for (const id in this.players) {
      const p = this.players[id];
      if (p.health <= 0) continue; // dead

      // Apply drag
      p.vx *= 0.92;
      p.vy *= 0.92;

      // Integrate velocity
      p.x += p.vx;
      p.y += p.vy;

      // Bound to arena (800x600)
      if (p.x < 20) { p.x = 20; p.vx = 0; }
      if (p.x > 780) { p.x = 780; p.vx = 0; }
      if (p.y < 20) { p.y = 20; p.vy = 0; }
      if (p.y > 580) { p.y = 580; p.vy = 0; }
    }

    // Update projectiles and check collisions
    for (const pid in this.projectiles) {
      const proj = this.projectiles[pid];
      proj.x += Math.cos(proj.rotation) * proj.speed;
      proj.y += Math.sin(proj.rotation) * proj.speed;
      proj.life--;

      let hit = false;
      // Check collision with players
      for (const targetId in this.players) {
        if (targetId === proj.ownerId) continue;
        const target = this.players[targetId];
        if (target.health <= 0) continue;

        // Simple circle collision (radius ~16)
        const dx = target.x - proj.x;
        const dy = target.y - proj.y;
        if (dx * dx + dy * dy < 256) {
          // Hit!
          target.health -= 15;
          hit = true;
          
          if (target.health <= 0) {
            // Give score to owner
            if (this.players[proj.ownerId]) {
              this.players[proj.ownerId].score += 100;
            }
            // Respawn target after 2 seconds
            setTimeout(() => {
              if (this.players[targetId]) {
                this.players[targetId].health = 100;
                this.players[targetId].x = Math.random() * 600 + 100;
                this.players[targetId].y = Math.random() * 400 + 100;
                this.players[targetId].vx = 0;
                this.players[targetId].vy = 0;
              }
            }, 2000);
          }
          break;
        }
      }

      if (hit || proj.life <= 0 || proj.x < 0 || proj.x > 800 || proj.y < 0 || proj.y > 600) {
        delete this.projectiles[pid];
      }
    }
  }

  getState() {
    return { 
      players: this.players,
      projectiles: this.projectiles
    };
  }
}

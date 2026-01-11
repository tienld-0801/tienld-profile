export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  gravity: number;
  friction: number;
  size: number;
}

export interface Firework {
  x: number;
  y: number;
  vx: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  hue: number;
  isSpecial: boolean;
  size: number;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple 5x7 Dot Matrix Font for text to drone formation mapping
// 1 = dot, 0 = space
export const BITMAP_FONT: { [key: string]: number[][] } = {
  'A': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'B': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0]
  ],
  'C': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1]
  ],
  'D': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0]
  ],
  'E': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  'F': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0]
  ],
  'G': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1]
  ],
  'H': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'I': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1]
  ],
  'J': [
    [0,0,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [0,0,0,1,0],
    [1,0,0,1,0],
    [1,0,0,1,0],
    [0,1,1,0,0]
  ],
  'K': [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1]
  ],
  'L': [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  'M': [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'N': [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'O': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'P': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0]
  ],
  'Q': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,0],
    [0,1,1,0,1]
  ],
  'R': [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1]
  ],
  'S': [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0]
  ],
  'T': [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  'U': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  'V': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0]
  ],
  'W': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,0,0,0,1]
  ],
  'X': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  'Y': [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ],
  'Z': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  '1': [
    [0,0,1,0,0],
    [0,1,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0]
  ],
  '2': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [0,0,0,0,1],
    [0,0,1,1,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  '3': [
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,0,0,1,0],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '4': [
    [0,0,0,1,0],
    [0,0,1,1,0],
    [0,1,0,1,0],
    [1,0,0,1,0],
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,0,1,0]
  ],
  '5': [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '6': [
    [0,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '7': [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [0,1,0,0,0],
    [0,1,0,0,0]
  ],
  '8': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '9': [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '0': [
    [0,1,1,1,0],
    [1,0,0,1,1],
    [1,0,1,0,1],
    [1,1,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0]
  ],
  '!': [
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0]
  ],
  '-': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,1],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ],
  '+': [
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,0,0,0]
  ],
  '*': [
    [0,0,0,0,0],
    [1,0,1,0,1],
    [0,1,1,1,0],
    [1,1,1,1,1],
    [0,1,1,1,0],
    [1,0,1,0,1],
    [0,0,0,0,0]
  ],
  '#': [
    [0,1,0,1,0],
    [0,1,0,1,0],
    [1,1,1,1,1],
    [0,1,0,1,0],
    [1,1,1,1,1],
    [0,1,0,1,0],
    [0,1,0,1,0]
  ]
};

// Generates an array of target positions [x, y, z] for N drones
export function generateDroneShapePoints(
  pattern: string,
  customText: string,
  count: number,
  baseHeight: number,
  scaleFactor: number
): [number, number, number][] {
  const points: [number, number, number][] = [];

  switch (pattern) {
    case 'text': {
      const textToRender = (customText || '101').toUpperCase();
      const textPoints: [number, number, number][] = [];

      // Grid-based layout for characters
      const charWidth = 6; // 5 columns + 1 separator
      const totalWidth = textToRender.length * charWidth - 1;
      const startX = -totalWidth / 2;

      for (let c = 0; c < textToRender.length; c++) {
        const char = textToRender[c];
        const bitmap = BITMAP_FONT[char] || BITMAP_FONT[' '];
        const offset = startX + c * charWidth;

        for (let r = 0; r < 7; r++) {
          for (let col = 0; col < 5; col++) {
            if (bitmap[r] && bitmap[r][col] === 1) {
              // Map 2D coordinate to physical 3D plane in sky
              // X: horizontal, Y: vertical elevation, Z: depth index (slightly offset to add thickness)
              const xPoint = (offset + col) * scaleFactor * 1.5;
              const yPoint = baseHeight + (6 - r) * scaleFactor * 1.8;
              const zPoint = (Math.random() - 0.5) * scaleFactor * 0.5;
              textPoints.push([xPoint, yPoint, zPoint]);
            }
          }
        }
      }

      // If text points are too few or too many, we adjust
      if (textPoints.length === 0) {
        // Fallback heart
        return generateDroneShapePoints('heart', '', count, baseHeight, scaleFactor);
      }

      // Distribute N drones across the text positions (wrap around if N > textPoints.length)
      for (let i = 0; i < count; i++) {
        const index = i % textPoints.length;
        const base = textPoints[index];
        // Add tiny localized jitter to make it look organic
        const jitterX = (Math.random() - 0.5) * 0.3;
        const jitterY = (Math.random() - 0.5) * 0.3;
        const jitterZ = (Math.random() - 0.5) * 0.3;
        points.push([base[0] + jitterX, base[1] + jitterY, base[2] + jitterZ]);
      }
      break;
    }

    case 'heart': {
      // 3D Parametric Heart Shape
      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // Parametric equations for elegant heart
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        // Volumetric thickness
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 2.0;
        const z = r * Math.sin(angle);

        points.push([
          x * scaleFactor * 0.7,
          baseHeight + y * scaleFactor * 0.7,
          z * scaleFactor * 0.7
        ]);
      }
      break;
    }

    case 'star': {
      // 3D 5-pointed Star
      for (let i = 0; i < count; i++) {
        const step = Math.floor(Math.random() * 5);
        const ratio = Math.random();
        
        // Star points (outer and inner radii)
        const angle1 = (step * 2 * Math.PI) / 5 - Math.PI / 2;
        const angle2 = (((step + 1) * 2 * Math.PI) / 5) - Math.PI / 2;
        const angleMid = (angle1 + angle2) / 2;
        
        const rOuter = 15 * scaleFactor;
        const rInner = 6 * scaleFactor;
        
        // Connect point step to midpoint, and midpoint to step+1
        let pX, pY;
        if (ratio < 0.5) {
          const t = ratio * 2;
          pX = rOuter * Math.cos(angle1) * (1 - t) + rInner * Math.cos(angleMid) * t;
          pY = rOuter * Math.sin(angle1) * (1 - t) + rInner * Math.sin(angleMid) * t;
        } else {
          const t = (ratio - 0.5) * 2;
          pX = rInner * Math.cos(angleMid) * (1 - t) + rOuter * Math.cos(angle2) * t;
          pY = rInner * Math.sin(angleMid) * (1 - t) + rOuter * Math.sin(angle2) * t;
        }

        // Add 3D thickness
        const pZ = (Math.random() - 0.5) * 6 * scaleFactor;
        
        points.push([pX, baseHeight + pY, pZ]);
      }
      break;
    }

    case 'smiley': {
      // Smiling face outline, eyes & mouth
      for (let i = 0; i < count; i++) {
        const zone = i % 5;
        if (zone === 0 || zone === 1) {
          // Circular Outer Face Boundary
          const t = (Math.random() * Math.PI * 2);
          const r = 14 * scaleFactor;
          points.push([
            r * Math.cos(t),
            baseHeight + r * Math.sin(t),
            (Math.random() - 0.5) * scaleFactor
          ]);
        } else if (zone === 2) {
          // Left Eye (small circle/clump)
          const t = Math.random() * Math.PI * 2;
          const r = 1.5 * scaleFactor;
          points.push([
            -4.5 * scaleFactor + r * Math.cos(t),
            baseHeight + 3.5 * scaleFactor + r * Math.sin(t),
            (Math.random() - 0.5) * scaleFactor
          ]);
        } else if (zone === 3) {
          // Right Eye
          const t = Math.random() * Math.PI * 2;
          const r = 1.5 * scaleFactor;
          points.push([
            4.5 * scaleFactor + r * Math.cos(t),
            baseHeight + 3.5 * scaleFactor + r * Math.sin(t),
            (Math.random() - 0.5) * scaleFactor
          ]);
        } else {
          // Smile Mouth Arc (-0.75 PI to -0.25 PI)
          const t = -Math.PI * 0.8 + Math.random() * (Math.PI * 0.6);
          const r = 7 * scaleFactor;
          points.push([
            r * Math.cos(t),
            baseHeight + r * Math.sin(t) + 1.5 * scaleFactor,
            (Math.random() - 0.5) * scaleFactor
          ]);
        }
      }
      break;
    }

    case 'globe': {
      // Rotating 3D wireframe spherical globe
      const r = 12 * scaleFactor;
      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        points.push([x, baseHeight + y, z]);
      }
      break;
    }

    case 'dna': {
      // Futuristic Double Helix Spiral
      for (let i = 0; i < count; i++) {
        const strand = i % 3; // Strand 1, Strand 2, or cross-bridges
        const progress = Math.random();
        const length = 32 * scaleFactor;
        const z = -length / 2 + progress * length; // Spiral lies vertically
        const turns = progress * Math.PI * 6; // 3 full spins
        const radius = 6 * scaleFactor;

        if (strand === 0) {
          // Strand 1 (primary)
          const x = radius * Math.cos(turns);
          const y = radius * Math.sin(turns);
          points.push([x, baseHeight + z, y]);
        } else if (strand === 1) {
          // Strand 2 (offset by 180 degrees)
          const x = radius * Math.cos(turns + Math.PI);
          const y = radius * Math.sin(turns + Math.PI);
          points.push([x, baseHeight + z, y]);
        } else {
          // Connection bridge layers (placed at intervals)
          const intervalIndex = Math.floor(progress * 12) / 12;
          const bridgeTurns = intervalIndex * Math.PI * 6;
          const bridgeZ = -length / 2 + intervalIndex * length;
          
          // Interpolate point across the bridge line
          const lerpVal = Math.random();
          const x1 = radius * Math.cos(bridgeTurns);
          const y1 = radius * Math.sin(bridgeTurns);
          const x2 = radius * Math.cos(bridgeTurns + Math.PI);
          const y2 = radius * Math.sin(bridgeTurns + Math.PI);
          
          const rx = x1 * (1 - lerpVal) + x2 * lerpVal;
          const ry = y1 * (1 - lerpVal) + y2 * lerpVal;
          
          points.push([rx, baseHeight + bridgeZ, ry]);
        }
      }
      break;
    }

    default: {
      // Plane grid fallback
      for (let i = 0; i < count; i++) {
        const cols = Math.ceil(Math.sqrt(count));
        const col = i % cols;
        const row = Math.floor(i / cols);
        const spacing = 1.5 * scaleFactor;
        const x = (col - cols / 2) * spacing;
        const y = baseHeight + (row - cols / 2) * spacing;
        points.push([x, y, 0]);
      }
    }
  }

  return points;
}

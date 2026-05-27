/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LandmarkId = 'taipei101' | 'eiffel' | 'tokyo' | 'bridge';

export interface Landmark {
  id: LandmarkId;
  name: string;
  location: string;
  description: string;
  height: number;
}

export type FireworkType = 'peony' | 'chrysanthemum' | 'heart' | 'ring' | 'crossette' | 'streamer' | 'fountain';

export type ColorPreset = 'rainbow' | 'gold_silver' | 'neon' | 'sunset' | 'cyberpunk' | 'custom';

export interface FireworkParams {
  type: FireworkType;
  colorPreset: ColorPreset;
  primaryColor: string;
  secondaryColor: string;
  particleCount: number;
  size: number;
  speed: number;
  trailLength: number;
  gravity: number;
  altitude: number;
  soundEnabled: boolean;
  soundVolume: number;
}

export type DronePatternType = 'text' | 'heart' | 'star' | 'smiley' | 'globe' | 'dna';

export interface DroneParams {
  pattern: DronePatternType;
  customText: string;
  droneCount: number;
  color: string;
  glowStrength: number;
  flyingSpeed: number;
  height: number;
  scale: number;
}

export interface AtmosphereSettings {
  starDensity: number;
  reflectionIntensity: number;
  soundVolume: number;
  bloomEnabled: boolean;
  timeOfDay: 'night' | 'cyan_twilight' | 'deep_purple';
  showGrid: boolean;
}

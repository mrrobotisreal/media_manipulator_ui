import { z } from 'zod';

export const audioConversionSchema = z.object({
  format: z.enum(['mp3', 'wav', 'aac', 'ogg', 'flac', 'alac', 'opus', 'ac3', 'dts']),
  bitrate: z.enum(['128', '192', '256', '320', '512', '1024']).default('192'),
  sampleRate: z.enum(['22050', '44100', '48000', '96000', '192000']).default('44100'),
  channels: z.enum(['mono', 'stereo', '5.1', '7.1']).default('stereo'),
  speed: z.number().min(0.25).max(4).default(1),
  volume: z.number().min(0.1).max(2).default(1),

  // Trimming parameters (in seconds)
  trim: z.object({
    startTime: z.number().min(0),
    endTime: z.number().min(0),
  }).optional(),

  // Basic Audio Processing
  basicProcessing: z.object({
    // Volume Controls
    normalize: z.boolean().default(false).optional(),
    amplify: z.number().min(-60).max(60).default(0).optional(),
    fadeIn: z.number().min(0).max(30).default(0).optional(),
    fadeOut: z.number().min(0).max(30).default(0).optional(),
    dynamicRange: z.object({
      enabled: z.boolean().default(false),
      ratio: z.number().min(1).max(20).default(4),
      threshold: z.number().min(-60).max(0).default(-20),
    }).optional(),

    // EQ
    equalizer: z.object({
      enabled: z.boolean().default(false),
      preset: z.enum(['none', 'bass-boost', 'treble-boost', 'vocal', 'classical', 'rock', 'jazz']).default('none'),
      lowPass: z.number().min(20).max(20000).default(20000).optional(),
      highPass: z.number().min(20).max(20000).default(20).optional(),
      bands: z.array(z.object({
        frequency: z.number().min(20).max(20000),
        gain: z.number().min(-20).max(20),
        q: z.number().min(0.1).max(10).default(1),
      })).optional(),
    }).optional(),

    // Stereo Processing
    stereo: z.object({
      pan: z.number().min(-100).max(100).default(0).optional(),
      balance: z.number().min(-100).max(100).default(0).optional(),
      width: z.number().min(0).max(200).default(100).optional(),
      monoConversion: z.boolean().default(false).optional(),
      channelSwap: z.boolean().default(false).optional(),
    }).optional(),
  }).optional(),

  // Time-Based Effects
  timeBasedEffects: z.object({
    // Reverb
    reverb: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['none', 'room', 'hall', 'plate', 'spring']).default('none'),
      roomSize: z.number().min(0).max(100).default(50),
      damping: z.number().min(0).max(100).default(50),
      wetLevel: z.number().min(0).max(100).default(30),
      dryLevel: z.number().min(0).max(100).default(70),
    }).optional(),

    // Delay/Echo
    delay: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['none', 'echo', 'multi-tap', 'ping-pong']).default('none'),
      time: z.number().min(0).max(2000).default(500), // milliseconds
      feedback: z.number().min(0).max(95).default(30),
      wetLevel: z.number().min(0).max(100).default(25),
    }).optional(),

    // Modulation
    modulation: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['none', 'chorus', 'flanger', 'phaser', 'tremolo', 'vibrato']).default('none'),
      rate: z.number().min(0.1).max(20).default(2),
      depth: z.number().min(0).max(100).default(50),
      feedback: z.number().min(0).max(99).default(20),
    }).optional(),
  }).optional(),

  // Restoration & Cleanup
  restoration: z.object({
    // Noise Reduction
    noiseReduction: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['none', 'spectral', 'adaptive', 'gate']).default('none'),
      strength: z.number().min(0).max(100).default(50),
      sensitivity: z.number().min(0).max(100).default(50),
    }).optional(),

    // De-hum
    deHum: z.object({
      enabled: z.boolean().default(false),
      frequency: z.enum(['50hz', '60hz', 'auto']).default('auto'),
      harmonics: z.number().min(1).max(10).default(3),
    }).optional(),

    // Declip
    declip: z.object({
      enabled: z.boolean().default(false),
      threshold: z.number().min(0).max(100).default(95),
      strength: z.number().min(0).max(100).default(50),
    }).optional(),

    // Silence Detection
    silenceDetection: z.object({
      enabled: z.boolean().default(false),
      threshold: z.number().min(-80).max(-10).default(-50),
      minDuration: z.number().min(0.1).max(10).default(1),
      action: z.enum(['mark', 'remove', 'replace']).default('mark'),
    }).optional(),
  }).optional(),

  // Advanced Audio
  advanced: z.object({
    // Pitch Shifting
    pitchShift: z.object({
      enabled: z.boolean().default(false),
      semitones: z.number().min(-24).max(24).default(0),
      preserveFormants: z.boolean().default(true),
    }).optional(),

    // Time Stretching
    timeStretch: z.object({
      enabled: z.boolean().default(false),
      factor: z.number().min(0.25).max(4).default(1),
      algorithm: z.enum(['pitch', 'time', 'formant']).default('pitch'),
    }).optional(),

    // Spatial Audio
    spatialAudio: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['none', 'binaural', 'surround', '3d']).default('none'),
      position: z.object({
        x: z.number().min(-1).max(1).default(0),
        y: z.number().min(-1).max(1).default(0),
        z: z.number().min(-1).max(1).default(0),
      }).optional(),
    }).optional(),

    // Spectral Processing
    spectral: z.object({
      enabled: z.boolean().default(false),
      type: z.enum(['none', 'vocoder', 'formant', 'convolution']).default('none'),
      fftSize: z.number().min(256).max(8192).default(2048),
    }).optional(),
  }).optional(),
});

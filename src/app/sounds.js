// Audio context for better sound management
let audioContext = null;

// Sound effects for the game - using Web Audio API to generate sounds
export const sounds = {
  click: {
    frequency: 800,
    duration: 0.1,
    type: 'sine',
    volume: 0.3
  },
  win: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 - victory chord
    duration: 0.6,
    type: 'sine',
    volume: 0.4
  },
  lose: {
    frequencies: [196, 174.61, 146.83], // G3, F3, D3 - descending sad chord
    duration: 0.8,
    type: 'sine',
    volume: 0.3
  },
  draw: {
    frequency: 440,
    duration: 0.4,
    type: 'square',
    volume: 0.3
  },
  move: {
    frequency: 600,
    duration: 0.15,
    type: 'sine',
    volume: 0.2
  },
  line: {
    frequency: 1200,
    duration: 0.3,
    type: 'sine',
    volume: 0.4
  },
  powerup: {
    frequencies: [880, 1108.73, 1396.91], // A5, C#6, F6 - power chord
    duration: 0.3,
    type: 'sine',
    volume: 0.3
  },
  achievement: {
    frequencies: [523.25, 659.25, 783.99, 1046.50, 1318.51], // C5-E6 ascending
    duration: 1.2,
    type: 'sine',
    volume: 0.4
  }
};

// Initialize audio context
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Create oscillator-based sound
const createOscillatorSound = (frequency, duration, type = 'sine', volume = 0.5) => {
  if (!audioContext) return null;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
  
  return { oscillator, gainNode };
};

// Create chord (multiple frequencies)
const createChord = (frequencies, duration, type = 'sine', volume = 0.3) => {
  if (!audioContext) return [];
  
  return frequencies.map((frequency, index) => {
    const delay = index * 0.1; // Stagger notes slightly
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + delay + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
    
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);
    
    return { oscillator, gainNode };
  });
};

// Preload sounds (now just initializes audio context)
export const preloadSounds = async () => {
  try {
    initAudioContext();
    console.log('Audio system initialized successfully');
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
};

// Play a sound with Web Audio API for better timing and control
export const playSound = async (soundName, options = {}) => {
  try {
    if (!audioContext) {
      initAudioContext();
      // Resume context if it's suspended (required for user interaction)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    }

    const sound = sounds[soundName];
    if (!sound) {
      console.warn(`Sound '${soundName}' not found`);
      return null;
    }

    const volume = options.volume !== undefined ? options.volume : sound.volume;
    
    // Handle multi-frequency sounds (chords)
    if (sound.frequencies && Array.isArray(sound.frequencies)) {
      const oscillators = createChord(sound.frequencies, sound.duration, sound.type, volume);
      return {
        stop: () => {
          oscillators.forEach(({ oscillator }) => {
            try {
              oscillator.stop();
            } catch (e) {
              // Already stopped
            }
          });
        }
      };
    }
    
    // Handle single frequency sounds
    if (sound.frequency) {
      const result = createOscillatorSound(sound.frequency, sound.duration, sound.type, volume);
      return {
        stop: () => {
          if (result?.oscillator) {
            try {
              result.oscillator.stop();
            } catch (e) {
              // Already stopped
            }
          }
        }
      };
    }
    
    console.warn(`Sound '${soundName}' has invalid configuration`);
    return null;
    
  } catch (error) {
    console.warn('Error in playSound:', error);
    return null;
  }
};

// Audio context for better sound management
let audioContext = null;

// Sound effects for the game
export const sounds = {
  click: {
    url: 'https://assets.mixkit.co/active_storage/sfx/216/216-preview.mp3', // Soft click sound
    audio: null,
    buffer: null,
    volume: 0.4
  },
  win: {
    url: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Victory sound
    audio: null,
    buffer: null,
    volume: 0.6
  },
  lose: {
    url: 'https://assets.mixkit.co/active_storage/sfx/2588/2588-preview.mp3', // Lose sound
    audio: null,
    buffer: null,
    volume: 0.5
  },
  draw: {
    url: 'https://assets.mixkit.co/active_storage/sfx/133/133-preview.mp3', // Draw sound
    audio: null,
    buffer: null,
    volume: 0.5
  },
  move: {
    url: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Move sound
    audio: null,
    buffer: null,
    volume: 0.3
  },
  line: {
    url: 'https://assets.mixkit.co/active_storage/sfx/2575/2575-preview.mp3', // Line completion sound
    audio: null,
    buffer: null,
    volume: 0.6
  }
};

// Initialize audio context
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Load a single audio file
const loadAudio = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio:', error);
    return null;
  }
};

// Preload all sounds
export const preloadSounds = async () => {
  try {
    initAudioContext();
    
    // Load all sounds in parallel
    await Promise.all(
      Object.entries(sounds).map(async ([key, sound]) => {
        try {
          sound.buffer = await loadAudio(sound.url);
          sound.audio = new Audio(sound.url);
          sound.audio.load();
          sound.audio.volume = 0.5; // Default volume
          sound.audio.preload = 'auto';
        } catch (error) {
          console.error(`Error loading sound ${key}:`, error);
        }
      })
    );
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

// Play a sound with Web Audio API for better timing and control
export const playSound = async (soundName, options = {}) => {
  try {
    const sound = sounds[soundName];
    if (!sound) return;

    const volume = options.volume !== undefined ? options.volume : (sound.volume || 0.5);
    
    // Try Web Audio API first
    if (audioContext && sound.buffer) {
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      source.buffer = sound.buffer;
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Handle sound completion
      source.onended = options.onEnded || null;
      
      source.start(0);
      return { stop: () => source.stop() };
    }

    // Fallback to HTML5 Audio
    const audio = sound.audio || new Audio(sound.url);
    
    // Clone the audio element to allow overlapping sounds
    const audioClone = audio.cloneNode();
    audioClone.volume = volume;
    
    // Handle sound completion
    if (options.onEnded) {
      const endedHandler = () => {
        options.onEnded();
        audioClone.removeEventListener('ended', endedHandler);
      };
      audioClone.addEventListener('ended', endedHandler);
    }
    
    // Play the sound
    audioClone.play().catch(e => console.warn('Audio play failed:', e));
    
    return {
      stop: () => {
        audioClone.pause();
        audioClone.currentTime = 0;
      }
    };
    
  } catch (error) {
    console.error('Error in playSound:', error);
    return null;
  }
};

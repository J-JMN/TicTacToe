import { PARTICLE_TYPES } from './gameTypes.js';

// Enhanced Particle System for 3D TicTacToe
export class ParticleSystem {
  constructor(container, theme) {
    this.container = container;
    this.theme = theme;
    this.particles = [];
    this.isRunning = false;
    this.animationId = null;
    this.lastUpdateTime = 0;
    
    // Create canvas for complex particle effects
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1000';
    this.resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', () => this.resizeCanvas());
    
    if (container) {
      container.appendChild(this.canvas);
    }
  }

  resizeCanvas() {
    const rect = this.container?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  // Create different types of particles
  createParticles(type, options = {}) {
    const {
      x = this.canvas.width / 2,
      y = this.canvas.height / 2,
      count = 30,
      color = this.theme?.colors?.primary || '#6366f1',
      size = 4,
      duration = 2000
    } = options;

    switch (type) {
      case PARTICLE_TYPES.VICTORY:
        this.createVictoryParticles(x, y, count, color, duration);
        break;
      case PARTICLE_TYPES.POWER_UP:
        this.createPowerUpParticles(x, y, count, color, size);
        break;
      case PARTICLE_TYPES.EXPLOSION:
        this.createExplosionParticles(x, y, count, color);
        break;
      case PARTICLE_TYPES.MAGIC:
        this.createMagicParticles(x, y, count, color);
        break;
      case PARTICLE_TYPES.ICE:
        this.createIceParticles(x, y, count);
        break;
      case PARTICLE_TYPES.LIGHTNING:
        this.createLightningParticles(x, y, count);
        break;
      case PARTICLE_TYPES.SHIELD:
        this.createShieldParticles(x, y, count);
        break;
      case PARTICLE_TYPES.TIME:
        this.createTimeParticles(x, y, count);
        break;
      default:
        this.createDefaultParticles(x, y, count, color);
    }

    this.startAnimation();
  }

  createVictoryParticles(x, y, count, color, duration) {
    const colors = [
      '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'
    ];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'confetti',
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 15,
        vy: Math.random() * -10 - 5,
        gravity: 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4,
        life: 1,
        decay: 1 / (duration / 16.67), // 60fps
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
        width: Math.random() * 10 + 5,
        height: Math.random() * 6 + 3
      });
    }
  }

  createPowerUpParticles(x, y, count, color, size) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = 20 + Math.random() * 30;
      
      this.particles.push({
        type: 'power',
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        color: this.hexToRgba(color, 0.8),
        size: size + Math.random() * 4,
        life: 1,
        decay: 0.02,
        glow: true,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  createExplosionParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 3;
      
      this.particles.push({
        type: 'explosion',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#FF6B35',
        size: Math.random() * 6 + 2,
        life: 1,
        decay: 0.03,
        trail: true,
        trailLength: 5
      });
    }

    // Add shockwave
    this.particles.push({
      type: 'shockwave',
      x: x,
      y: y,
      radius: 0,
      maxRadius: 100,
      life: 1,
      decay: 0.05,
      color: color
    });
  }

  createMagicParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'magic',
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: '#8B5CF6',
        size: Math.random() * 4 + 2,
        life: 1,
        decay: 0.015,
        spiral: Math.random() * Math.PI * 2,
        spiralSpeed: 0.1,
        spiralRadius: 20 + Math.random() * 30
      });
    }
  }

  createIceParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'ice',
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: '#7DD3FC',
        size: Math.random() * 5 + 3,
        life: 1,
        decay: 0.02,
        crystalline: true,
        shimmer: Math.random() * Math.PI * 2
      });
    }
  }

  createLightningParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50;
      
      this.particles.push({
        type: 'lightning',
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: '#FEF08A',
        size: Math.random() * 3 + 1,
        life: 1,
        decay: 0.04,
        electric: true,
        spark: Math.random() < 0.3
      });
    }

    // Add lightning bolt
    this.createLightningBolt(x, y);
  }

  createLightningBolt(x, y) {
    const segments = 8;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
      const progress = i / segments;
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = progress * 80 - 40;
      points.push({ x: x + offsetX, y: y + offsetY });
    }

    this.particles.push({
      type: 'lightning_bolt',
      points: points,
      life: 1,
      decay: 0.1,
      color: '#F59E0B',
      width: 3
    });
  }

  createShieldParticles(x, y, count) {
    // Create shield ring
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 30;
      
      this.particles.push({
        type: 'shield',
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        angle: angle,
        radius: radius,
        centerX: x,
        centerY: y,
        color: '#10B981',
        size: 4,
        life: 1,
        decay: 0.01,
        orbital: true,
        orbitSpeed: 0.05
      });
    }
  }

  createTimeParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'time',
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color: '#06B6D4',
        size: Math.random() * 6 + 2,
        life: 1,
        decay: 0.02,
        timeWarp: true,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  createDefaultParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      
      this.particles.push({
        type: 'default',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        size: Math.random() * 4 + 2,
        life: 1,
        decay: 0.02
      });
    }
  }

  // Animation loop
  startAnimation() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastUpdateTime = performance.now();
    this.animate();
  }

  animate = (currentTime = performance.now()) => {
    const deltaTime = Math.min(currentTime - this.lastUpdateTime, 16.67);
    this.lastUpdateTime = currentTime;

    this.update(deltaTime / 16.67); // Normalize to 60fps
    this.render();

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
    }
  }

  update(deltaTime) {
    this.particles = this.particles.filter(particle => {
      // Update particle based on type
      switch (particle.type) {
        case 'confetti':
          this.updateConfetti(particle, deltaTime);
          break;
        case 'power':
          this.updatePower(particle, deltaTime);
          break;
        case 'explosion':
          this.updateExplosion(particle, deltaTime);
          break;
        case 'magic':
          this.updateMagic(particle, deltaTime);
          break;
        case 'ice':
          this.updateIce(particle, deltaTime);
          break;
        case 'lightning':
          this.updateLightning(particle, deltaTime);
          break;
        case 'lightning_bolt':
          this.updateLightningBolt(particle, deltaTime);
          break;
        case 'shield':
          this.updateShield(particle, deltaTime);
          break;
        case 'time':
          this.updateTime(particle, deltaTime);
          break;
        case 'shockwave':
          this.updateShockwave(particle, deltaTime);
          break;
        default:
          this.updateDefault(particle, deltaTime);
      }

      // Update life
      particle.life -= particle.decay * deltaTime;
      return particle.life > 0;
    });
  }

  updateConfetti(particle, deltaTime) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.vy += particle.gravity * deltaTime;
    particle.rotation += particle.rotationSpeed * deltaTime;
  }

  updatePower(particle, deltaTime) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.pulse += 0.2 * deltaTime;
    particle.size = particle.size + Math.sin(particle.pulse) * 0.5;
  }

  updateExplosion(particle, deltaTime) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.vx *= 0.98; // Friction
    particle.vy *= 0.98;
  }

  updateMagic(particle, deltaTime) {
    particle.spiral += particle.spiralSpeed * deltaTime;
    particle.x += Math.cos(particle.spiral) * 2 * deltaTime;
    particle.y += Math.sin(particle.spiral) * 2 * deltaTime;
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
  }

  updateIce(particle, deltaTime) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.shimmer += 0.3 * deltaTime;
    particle.vx *= 0.95; // Slow down
    particle.vy *= 0.95;
  }

  updateLightning(particle, deltaTime) {
    particle.x += particle.vx * deltaTime + (Math.random() - 0.5) * 3;
    particle.y += particle.vy * deltaTime + (Math.random() - 0.5) * 3;
  }

  updateLightningBolt(particle, deltaTime) {
    // Lightning bolt just fades
  }

  updateShield(particle, deltaTime) {
    if (particle.orbital) {
      particle.angle += particle.orbitSpeed * deltaTime;
      particle.x = particle.centerX + Math.cos(particle.angle) * particle.radius;
      particle.y = particle.centerY + Math.sin(particle.angle) * particle.radius;
    }
  }

  updateTime(particle, deltaTime) {
    particle.phase += 0.1 * deltaTime;
    const warp = Math.sin(particle.phase) * 0.5;
    particle.x += particle.vx * deltaTime * (1 + warp);
    particle.y += particle.vy * deltaTime * (1 + warp);
  }

  updateShockwave(particle, deltaTime) {
    particle.radius += (particle.maxRadius - particle.radius) * 0.1 * deltaTime;
  }

  updateDefault(particle, deltaTime) {
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life;

      switch (particle.type) {
        case 'confetti':
          this.renderConfetti(particle);
          break;
        case 'power':
          this.renderPower(particle);
          break;
        case 'explosion':
          this.renderExplosion(particle);
          break;
        case 'magic':
          this.renderMagic(particle);
          break;
        case 'ice':
          this.renderIce(particle);
          break;
        case 'lightning':
          this.renderLightning(particle);
          break;
        case 'lightning_bolt':
          this.renderLightningBolt(particle);
          break;
        case 'shield':
          this.renderShield(particle);
          break;
        case 'time':
          this.renderTime(particle);
          break;
        case 'shockwave':
          this.renderShockwave(particle);
          break;
        default:
          this.renderDefault(particle);
      }

      this.ctx.restore();
    });
  }

  renderConfetti(particle) {
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);
    this.ctx.fillStyle = particle.color;
    
    if (particle.shape === 'rect') {
      this.ctx.fillRect(-particle.width/2, -particle.height/2, particle.width, particle.height);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  renderPower(particle) {
    if (particle.glow) {
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = 10;
    }
    
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderExplosion(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderMagic(particle) {
    this.ctx.shadowColor = particle.color;
    this.ctx.shadowBlur = 5;
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add sparkle effect
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(particle.x - particle.size, particle.y);
    this.ctx.lineTo(particle.x + particle.size, particle.y);
    this.ctx.moveTo(particle.x, particle.y - particle.size);
    this.ctx.lineTo(particle.x, particle.y + particle.size);
    this.ctx.stroke();
  }

  renderIce(particle) {
    const shimmer = Math.sin(particle.shimmer) * 0.3 + 0.7;
    this.ctx.fillStyle = this.hexToRgba(particle.color, shimmer);
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1;
    
    // Draw crystal shape
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = particle.x + Math.cos(angle) * particle.size;
      const y = particle.y + Math.sin(angle) * particle.size;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  renderLightning(particle) {
    if (particle.spark) {
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = 8;
    }
    
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderLightningBolt(particle) {
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = particle.width;
    this.ctx.lineCap = 'round';
    this.ctx.shadowColor = particle.color;
    this.ctx.shadowBlur = 10;
    
    this.ctx.beginPath();
    particle.points.forEach((point, index) => {
      if (index === 0) {
        this.ctx.moveTo(point.x, point.y);
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    });
    this.ctx.stroke();
  }

  renderShield(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.shadowColor = particle.color;
    this.ctx.shadowBlur = 5;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderTime(particle) {
    const warp = Math.sin(particle.phase) * 0.5 + 0.5;
    this.ctx.fillStyle = this.hexToRgba(particle.color, warp);
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * warp, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderShockwave(particle) {
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  renderDefault(particle) {
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Utility functions
  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Clean up
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
}

// Export singleton instance
export const createParticleSystem = (container, theme) => {
  return new ParticleSystem(container, theme);
};

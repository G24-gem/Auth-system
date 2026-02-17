// Theme management with smooth day/night transitions based on time
class ThemeManager {
    constructor() {
        this.root = document.documentElement;
        this.timeDisplay = document.getElementById('current-time');
        this.updateTheme();
        this.updateTime();
        
        // Update theme and time periodically
        setInterval(() => this.updateTheme(), 60000); // Every minute
        setInterval(() => this.updateTime(), 1000); // Every second
    }

    updateTime() {
        if (!this.timeDisplay) return;
        
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        this.timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateTheme() {
        const hour = new Date().getHours();
        
        // Define time periods
        // Dawn: 5-7
        // Day: 7-17
        // Dusk: 17-19
        // Night: 19-5
        
        let theme = this.getThemeForHour(hour);
        this.applyTheme(theme);
        
        // Update theme mode display if on dashboard
        const themeModeDisplay = document.getElementById('theme-mode');
        if (themeModeDisplay) {
            themeModeDisplay.textContent = theme.name.toLowerCase();
        }
    }

    getThemeForHour(hour) {
        if (hour >= 5 && hour < 7) {
            return this.getDawnTheme(hour);
        } else if (hour >= 7 && hour < 17) {
            return this.getDayTheme(hour);
        } else if (hour >= 17 && hour < 19) {
            return this.getDuskTheme(hour);
        } else {
            return this.getNightTheme(hour);
        }
    }

    getDawnTheme(hour) {
        // Gradual transition from night to day (5-7 AM)
        const progress = (hour - 5) / 2; // 0 to 1
        
        return {
            name: 'Dawn',
            bgPrimary: this.interpolateColor('#1a1a2e', '#FFB6B9', progress),
            textPrimary: this.interpolateColor('#ecf0f1', '#2c3e50', progress),
            textSecondary: this.interpolateColor('#bdc3c7', '#7f8c8d', progress),
            celestialColor: this.interpolateColor('#f5f5dc', '#FFD700', progress),
            celestialGlow: `rgba(255, 215, 0, ${0.3 + progress * 0.3})`,
            cloudOpacity: progress,
            starsOpacity: 1 - progress,
            celestialTop: `${15 + progress * 5}%`,
            celestialRight: `${5 + progress * 5}%`
        };
    }

    getDayTheme(hour) {
        // Full daylight (7 AM - 5 PM)
        const midday = 12;
        const distanceFromMidday = Math.abs(hour - midday) / 5;
        const brightness = 1 - (distanceFromMidday * 0.2);
        
        return {
            name: 'Day',
            bgPrimary: `hsl(199, 53%, ${60 + brightness * 10}%)`,
            textPrimary: '#2c3e50',
            textSecondary: '#7f8c8d',
            celestialColor: '#FFD700',
            celestialGlow: 'rgba(255, 215, 0, 0.6)',
            cloudOpacity: 1,
            starsOpacity: 0,
            celestialTop: '15%',
            celestialRight: '10%'
        };
    }

    getDuskTheme(hour) {
        // Gradual transition from day to night (5-7 PM)
        const progress = (hour - 17) / 2; // 0 to 1
        
        return {
            name: 'Dusk',
            bgPrimary: this.interpolateColor('#87CEEB', '#4a4a6a', progress),
            textPrimary: this.interpolateColor('#2c3e50', '#ecf0f1', progress),
            textSecondary: this.interpolateColor('#7f8c8d', '#bdc3c7', progress),
            celestialColor: this.interpolateColor('#FFD700', '#f5f5dc', progress),
            celestialGlow: `rgba(255, 215, 0, ${0.6 - progress * 0.3})`,
            cloudOpacity: 1 - progress,
            starsOpacity: progress,
            celestialTop: `${20 + progress * 10}%`,
            celestialRight: `${10 + progress * 10}%`
        };
    }

    getNightTheme(hour) {
        // Full night (7 PM - 5 AM)
        return {
            name: 'Night',
            bgPrimary: '#1a1a2e',
            textPrimary: '#ecf0f1',
            textSecondary: '#bdc3c7',
            celestialColor: '#f5f5dc',
            celestialGlow: 'rgba(245, 245, 220, 0.4)',
            cloudOpacity: 0,
            starsOpacity: 1,
            celestialTop: '30%',
            celestialRight: '15%'
        };
    }

    applyTheme(theme) {
        this.root.style.setProperty('--bg-primary', theme.bgPrimary);
        this.root.style.setProperty('--text-primary', theme.textPrimary);
        this.root.style.setProperty('--text-secondary', theme.textSecondary);
        this.root.style.setProperty('--celestial-color', theme.celestialColor);
        this.root.style.setProperty('--celestial-glow', theme.celestialGlow);
        this.root.style.setProperty('--cloud-opacity', theme.cloudOpacity);
        this.root.style.setProperty('--stars-opacity', theme.starsOpacity);
        
        const celestialBody = document.querySelector('.celestial-body');
        if (celestialBody) {
            celestialBody.style.top = theme.celestialTop;
            celestialBody.style.right = theme.celestialRight;
        }
    }

    interpolateColor(color1, color2, factor) {
        // Convert hex to RGB
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        // Interpolate
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex values
        return {
            r: parseInt(hex.substr(0, 2), 16),
            g: parseInt(hex.substr(2, 2), 16),
            b: parseInt(hex.substr(4, 2), 16)
        };
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

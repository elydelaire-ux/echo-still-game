export class VirtualJoystick {
    public joyX: number = 0; // -1 to 1
    public joyY: number = 0; // -1 to 1
    public actionPressed: boolean = false;
    public jumpPressed: boolean = false;

    constructor() {
        if (this.isTouchDevice()) {
            this.init();
        }
    }

    private isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    private init() {
        const style = document.createElement('style');
        style.textContent = `
            #virtual-controls {
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                height: 150px;
                display: flex;
                justify-content: space-between;
                pointer-events: none; /* Let touches pass through to canvas if needed, but we intercept on window */
                z-index: 100;
            }
            .zone {
                width: 150px;
                height: 150px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: auto;
                touch-action: none;
                position: relative;
            }
            .stick {
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .btn-zone {
                display: flex;
                gap: 20px;
            }
            .btn {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: auto;
                touch-action: none;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-family: monospace;
                font-size: 20px;
            }
            .btn:active {
                background: rgba(255, 255, 255, 0.4);
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'virtual-controls';
        container.innerHTML = `
            <div class="zone" id="stick-zone">
                <div class="stick" id="stick"></div>
            </div>
            <div class="btn-zone">
                <div class="btn" id="btn-jump">JUMP</div>
                <div class="btn" id="btn-action">ACT</div>
            </div>
        `;
        document.body.appendChild(container);

        // Stick Logic
        const stickZone = document.getElementById('stick-zone')!;
        const stick = document.getElementById('stick')!;

        let startX = 0, startY = 0;

        stickZone.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            const rect = stickZone.getBoundingClientRect();
            // Center of zone
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            startX = touch.clientX;
            startY = touch.clientY;

            // Initial snap if not exactly center? actually joystick usually recenters.
        });

        stickZone.addEventListener('touchmove', (e) => {
            const touch = e.changedTouches[0];
            const rect = stickZone.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Delta from center
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;

            // Limit to radius
            const radius = rect.width / 2;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius) {
                dx = (dx / dist) * radius;
                dy = (dy / dist) * radius;
            }

            // Move stick visual
            stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

            // Normalize output
            this.joyX = dx / radius;
            this.joyY = dy / radius;
        });

        const resetStick = () => {
            stick.style.transform = `translate(-50%, -50%)`;
            this.joyX = 0;
            this.joyY = 0;
        };

        stickZone.addEventListener('touchend', resetStick);
        stickZone.addEventListener('touchcancel', resetStick);

        // Buttons
        const btnJump = document.getElementById('btn-jump')!;
        btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); this.jumpPressed = true; });
        btnJump.addEventListener('touchend', (e) => { e.preventDefault(); this.jumpPressed = false; });

        const btnAction = document.getElementById('btn-action')!;
        btnAction.addEventListener('touchstart', (e) => { e.preventDefault(); this.actionPressed = true; });
        btnAction.addEventListener('touchend', (e) => { e.preventDefault(); this.actionPressed = false; });
    }
}

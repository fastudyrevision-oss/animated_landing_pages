class FrameAnimation {
    constructor() {
        this.canvas = document.getElementById('animationCanvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: false });
        this.loadingIndicator = document.querySelector('.loading-indicator');
        this.contentWrapper = document.querySelector('.content-wrapper');
        this.overlay = document.querySelector('.overlay');
        
        // Frame configuration
        this.frameCount = 216;
        this.framePath = 'frames/frame_';
        this.frames = [];
        this.currentFrameIndex = 0;
        this.isLoading = true;
        this.isAnimating = false;
        this.animationComplete = false;
        this.lastFrameTime = 0;
        this.targetFPS = 24; // Cinematic frame rate
        this.frameInterval = 1000 / this.targetFPS;
        
        // Device pixel ratio for sharp rendering
        this.dpr = window.devicePixelRatio || 1;
        
        // Animation state and optimization
        this.preloadedFrames = 0;
        this.preloadBatchSize = 20; // Preload frames in batches
        this.cachedDimensions = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.preloadFrames();
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle button click
        const button = document.querySelector('.cta-button');
        if (button) {
            button.addEventListener('click', () => this.handleButtonClick());
        }
    }

    setupCanvas() {
        this.resizeCanvas();
    }

    resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // Clear cached dimensions on resize
        this.cachedDimensions = null;
        
        // Reset context transforms to prevent accumulation and flickering
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
    }

    handleResize() {
        this.resizeCanvas();
    }

    preloadFrames() {
        console.log(`Starting frame preload... (${this.frameCount} frames)`);
        const preloadQueue = [];
        
        // Create image loading promises
        for (let i = 1; i <= this.frameCount; i++) {
            preloadQueue.push(this.loadFrame(i));
        }
        
        // Load all frames in parallel with progress tracking
        Promise.all(preloadQueue)
            .then(() => {
                console.log(`✓ All ${this.frameCount} frames loaded successfully`);
                this.isLoading = false;
                this.hideLoadingIndicator();
                this.startAnimation();
            })
            .catch(error => {
                console.error('Error loading frames:', error);
                this.hideLoadingIndicator();
                this.showErrorFallback();
            });
    }

    loadFrame(frameNumber) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            // Format frame number with leading zeros (4 digits)
            const paddedNumber = String(frameNumber).padStart(4, '0');
            
            // Calculate timestamp: frames go from 0.80s to 7.97s over 216 frames
            const startTime = 0.80;
            const endTime = 7.97;
            const duration = endTime - startTime;
            const seconds = (startTime + (frameNumber - 1) * (duration / (this.frameCount - 1))).toFixed(2);
            
            img.src = `${this.framePath}${paddedNumber}_${seconds}s.png`;
            
            // Set timeout for frame loading (15 seconds max per frame)
            const loadTimeout = setTimeout(() => {
                console.warn(`⚠ Frame ${frameNumber} loading timeout`);
                this.frames[frameNumber - 1] = null;
                this.preloadedFrames++;
                resolve();
            }, 15000);
            
            img.onload = () => {
                clearTimeout(loadTimeout);
                this.frames[frameNumber - 1] = img;
                this.preloadedFrames++;
                const progress = (this.preloadedFrames / this.frameCount) * 100;
                // Log every 10 frames to reduce console spam
                if (frameNumber % 10 === 0 || frameNumber === 1) {
                    console.log(`Loading: ${Math.round(progress)}% (frame ${frameNumber}/${this.frameCount})`);
                }
                resolve();
            };
            
            img.onerror = () => {
                clearTimeout(loadTimeout);
                console.warn(`✗ Failed to load frame ${frameNumber}`);
                this.frames[frameNumber - 1] = null;
                this.preloadedFrames++;
                resolve();
            };
        });
    }

    updateLoadingProgress(progress) {
        // You can add a progress bar here if needed
        console.log(`Loading: ${Math.round(progress)}%`);
    }

    hideLoadingIndicator() {
        console.log('Hiding loading indicator');
        this.loadingIndicator.classList.add('hidden');
        // Content starts visible now (will be hidden initially and shown on completion)
    }

    showErrorFallback() {
        // Set a solid color background if frames fail to load
        this.ctx.fillStyle = 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        // Validate loaded frames before starting
        let validFrames = 0;
        let missingFrames = [];
        
        for (let i = 0; i < this.frames.length; i++) {
            if (this.frames[i] && this.frames[i].complete && this.frames[i].naturalWidth > 0) {
                validFrames++;
            } else {
                missingFrames.push(i + 1);
            }
        }
        
        console.log(`✓ Animation starting: ${validFrames}/${this.frameCount} frames ready`);
        if (missingFrames.length > 0 && missingFrames.length <= 20) {
            console.warn(`Missing frames: ${missingFrames.join(', ')}`);
        } else if (missingFrames.length > 20) {
            console.warn(`Missing ${missingFrames.length} frames`);
        }
        
        this.isAnimating = true;
        this.lastFrameTime = performance.now();
        this.animate();
    }

    animate = (currentTime = performance.now()) => {
        if (!this.isAnimating) return;
        
        const elapsed = currentTime - this.lastFrameTime;
        
        // Control frame rate - only update when enough time has passed
        if (elapsed >= this.frameInterval) {
            // Skip to next valid frame if current is missing
            let attemptsLeft = 5;
            while (attemptsLeft > 0) {
                const frame = this.frames[this.currentFrameIndex];
                if (frame && frame.complete && frame.naturalWidth > 0) {
                    break; // Found a valid frame
                }
                // Move to next frame if current is invalid
                if (this.currentFrameIndex < this.frameCount - 1) {
                    this.currentFrameIndex++;
                } else {
                    break; // Stop at last frame
                }
                attemptsLeft--;
            }
            
            this.renderFrame();
            
            // Check if we've reached the last frame
            if (this.currentFrameIndex >= this.frameCount - 1) {
                this.completeAnimation();
            } else {
                this.currentFrameIndex++;
                this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
            }
        }
        
        if (!this.animationComplete) {
            requestAnimationFrame(this.animate);
        }
    };

    renderFrame() {
        if (this.frames.length === 0) return;
        
        const frame = this.frames[this.currentFrameIndex];
        
        // Skip if frame is null or not loaded yet
        if (!frame || !frame.complete || frame.naturalWidth === 0) {
            return;
        }
        
        if (!this.cachedDimensions) {
            this.cachedDimensions = {
                width: this.canvas.width / this.dpr,
                height: this.canvas.height / this.dpr
            };
        }
        
        const { width, height } = this.cachedDimensions;
        
        // Clear canvas smoothly without flickering
        this.ctx.clearRect(0, 0, width, height);
        
        // Calculate scaling to fit frame to canvas while maintaining aspect ratio
        const frameAspect = frame.width / frame.height;
        const canvasAspect = width / height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (frameAspect > canvasAspect) {
            // Frame is wider than canvas
            drawHeight = height;
            drawWidth = height * frameAspect;
        } else {
            // Frame is taller than canvas
            drawWidth = width;
            drawHeight = width / frameAspect;
        }
        
        // Center the frame
        drawX = (width - drawWidth) / 2;
        drawY = (height - drawHeight) / 2;
        
        // Optimized rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        this.ctx.drawImage(frame, drawX, drawY, drawWidth, drawHeight);
    }

    handleButtonClick() {
        console.log('Get Started clicked');
        // Add your action here (e.g., scroll to next section, navigate, etc.)
        alert('Welcome to Trade an Idea!\nLet\'s start creating together.');
    }

    completeAnimation() {
        this.animationComplete = true;
        this.isAnimating = false;
        
        console.log('Animation complete - applying effects');
        
        // Apply zoom effect to canvas
        this.canvas.classList.add('canvas-zoom');
        
        // Apply fade-in to overlay and content
        this.overlay.classList.add('fade-in');
        this.contentWrapper.classList.add('fade-in-content');
    }
}

// Initialize animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FrameAnimation();
    });
} else {
    new FrameAnimation();
}

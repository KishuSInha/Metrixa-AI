const { app, BrowserWindow, ipcMain, desktopCapturer, nativeImage } = require('electron');
app.setName('Metrixa AI');
const path = require('path');
const Store = require('electron-store');
const https = require('https');
const http = require('http');
require('dotenv').config();

const store = new Store();
let mainWindow;
let monitoringInterval = null;

function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        console.log('Monitoring stopped.');
    }
}

function createWindow() {
    const iconPath = path.join(__dirname, 'assets/icon.png');
    let windowIcon = null;

    try {
        windowIcon = nativeImage.createFromPath(iconPath);
        if (windowIcon.isEmpty()) {
            console.error('⚠️ Could not load icon from path:', iconPath);
            windowIcon = null;
        }
    } catch (err) {
        console.error('❌ Error creating nativeImage from icon:', err);
    }

    mainWindow = new BrowserWindow({
        title: "Metrixa AI",
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
        frame: true,
        backgroundColor: '#F1EFEE',
        ...(windowIcon && { icon: windowIcon })
    });

    if (process.platform === 'darwin' && windowIcon) {
        try {
            app.dock.setIcon(windowIcon);
        } catch (err) {
            console.error('❌ Failed to set Dock icon:', err);
        }
    }

    mainWindow.loadFile('onboarding.html');
    // mainWindow.webContents.openDevTools({ mode: 'detach' });

    mainWindow.on('closed', () => {
        mainWindow = null;
        try {
            stopMonitoring();
        } catch (err) {
            console.error('Error during stopMonitoring on close:', err);
        }
    });
}

// IPC Handlers
ipcMain.on('complete-setup', () => {
    store.set('isSetupComplete', true);
    setTimeout(() => {
        if (mainWindow) {
            mainWindow.loadFile('main-app.html');
        }
    }, 500);
});

ipcMain.on('get-settings', (event) => {
    event.sender.send('settings-loaded', {
        apiKey: store.get('apiKey'),
        autoStart: store.get('autoStart')
    });
});

ipcMain.on('save-settings', (event, settings) => {
    if (settings.apiKey) store.set('apiKey', settings.apiKey);
    if (settings.autoStart !== undefined) store.set('autoStart', settings.autoStart);
    event.sender.send('settings-saved');
});

ipcMain.on('start-monitoring', () => {
    console.log('Starting monitoring...');
    if (monitoringInterval) clearInterval(monitoringInterval);

    monitoringInterval = setInterval(() => {
        captureAndAnalyze();
    }, 5000);
});

ipcMain.on('stop-monitoring', () => {
    console.log('Stopping monitoring...');
    stopMonitoring();
});

ipcMain.on('manual-analysis', () => {
    console.log('Manual analysis requested...');
    captureAndAnalyze();
});

// AI Service - Multi-tier approach
async function analyzeWithOllama(base64Image) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            model: "llava",
            prompt: "Analyze this screen and provide 2 short, actionable productivity tips. Format exactly like this:\nTITLE: [Title]\nDESCRIPTION: [One sentence description]\nCATEGORY: [Category]",
            images: [base64Image],
            stream: false
        });

        const options = {
            hostname: 'localhost',
            port: 11434,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            timeout: 30000
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    if (parsed.response) {
                        console.log('✓ Ollama analysis complete');
                        resolve(parsed.response);
                    } else {
                        reject(new Error('No response from Ollama'));
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Ollama request timeout'));
        });

        req.write(data);
        req.end();
    });
}

async function analyzeWithHuggingFace(base64Image) {
    const apiKey = store.get('huggingfaceApiKey') || process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) throw new Error('No Hugging Face API key');

    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            inputs: base64Image
        });

        const options = {
            hostname: 'api-inference.huggingface.co',
            path: '/models/Salesforce/blip-image-captioning-large',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            timeout: 30000
        };

        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    if (parsed[0] && parsed[0].generated_text) {
                        const caption = parsed[0].generated_text;
                        const formatted = `
TITLE: Screen Analysis
DESCRIPTION: ${caption}
CATEGORY: AI Analysis
                        `;
                        console.log('✓ Hugging Face analysis complete');
                        resolve(formatted);
                    } else {
                        reject(new Error('Invalid response from Hugging Face'));
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Hugging Face request timeout'));
        });

        req.write(data);
        req.end();
    });
}

function getMockAnalysis() {
    return `
TITLE: Organize Your Workspace
DESCRIPTION: Using virtual desktops (Mission Control) can help separate work contexts.
CATEGORY: Productivity

TITLE: Keyboard Shortcuts
DESCRIPTION: Learn Cmd+Tab for quick app switching to boost efficiency.
CATEGORY: Workflow
    `;
}

// Main Capture and Analyze Logic with Smart Fallbacks
async function captureAndAnalyze() {
    if (!mainWindow) return;

    mainWindow.webContents.send('analysis-result', 'Analyzing screen...');

    try {
        console.log('Capturing screen...');

        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1280, height: 720 }
        });

        if (sources.length === 0) throw new Error('No screen sources found');

        const base64Image = sources[0].thumbnail.toPNG().toString('base64');
        console.log('Screen captured successfully.');

        // Try Ollama first (local, unlimited)
        try {
            console.log('Trying Ollama local AI...');
            const result = await analyzeWithOllama(base64Image);
            mainWindow.webContents.send('analysis-result', result);
            return;
        } catch (ollamaError) {
            console.log('Ollama unavailable:', ollamaError.message);
        }

        // Fallback to Hugging Face
        try {
            console.log('Trying Hugging Face API...');
            const result = await analyzeWithHuggingFace(base64Image);
            mainWindow.webContents.send('analysis-result', result);
            return;
        } catch (hfError) {
            console.log('Hugging Face unavailable:', hfError.message);
        }

        // Final fallback to mock
        console.log('Using mock analysis (no AI available)');
        const mockResult = getMockAnalysis();
        mainWindow.webContents.send('analysis-result', mockResult);

    } catch (error) {
        console.error('Analysis failed:', error);
        mainWindow.webContents.send('analysis-result', `
TITLE: Analysis Error
DESCRIPTION: ${error.message}
CATEGORY: Error
        `);
    }
}

app.whenReady().then(() => {
    if (process.platform === 'darwin') {
        setTimeout(() => {
            const iconPath = path.join(__dirname, 'assets/icon.icns');
            try {
                const dockIcon = nativeImage.createFromPath(iconPath);
                if (!dockIcon.isEmpty()) {
                    app.dock.setIcon(dockIcon);
                    console.log('✓ Dock icon updated to native icns');
                }
            } catch (err) {
                console.error('Failed to set dock icon:', err);
            }
        }, 100);
    }

    createWindow();
    console.log('✓ Metrixa AI ready - Multi-tier AI service active');
    console.log('  Primary: Ollama (local)');
    console.log('  Fallback 1: Hugging Face API');
    console.log('  Fallback 2: Mock analysis');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

const { app, BrowserWindow, ipcMain, desktopCapturer, nativeImage, Menu } = require('electron');

// Force app name as early as possible
app.name = 'Metrixa AI';
if (app.setName) app.setName('Metrixa AI');
process.title = 'Metrixa AI';

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
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
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
        backgroundColor: '#F5F5F3',
        ...(windowIcon && { icon: windowIcon })
    });

    mainWindow.setTitle("Metrixa AI");

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

const { exec, spawn } = require('child_process');

// Helper to check if Ollama is installed
async function isOllamaInstalled() {
    return new Promise((resolve) => {
        exec('ollama --version', (error) => {
            resolve(!error);
        });
    });
}

// Helper to check if model exists
async function doesModelExist(modelName) {
    return new Promise((resolve) => {
        exec(`ollama list`, (error, stdout) => {
            if (error) return resolve(false);
            resolve(stdout.includes(modelName));
        });
    });
}

ipcMain.handle('is-ollama-installed', async () => {
    return await isOllamaInstalled();
});

ipcMain.on('check-ollama', async (event) => {
    const installed = await isOllamaInstalled();
    if (!installed) {
        event.sender.send('ollama-status', { status: 'missing', message: 'Ollama not found' });
        return;
    }

    const modelExists = await doesModelExist('llava');
    event.sender.send('ollama-status', {
        status: 'ready',
        modelExists,
        message: modelExists ? 'System ready' : 'Model download required'
    });
});

ipcMain.on('install-ollama', (event) => {
    console.log('Initiating Ollama installation...');
    // On macOS, we can point them to the download or attempt a brew install if possible
    // For a smoother "app" experience, we'll open the browser to the download page 
    // but in a real "auto-install" we might use a direct download and exec.
    // Let's implement a "Sovereign" auto-installer:
    const installCmd = '/bin/bash -c "$(curl -fsSL https://ollama.com/install.sh)"';

    const child = spawn('/bin/bash', ['-c', 'curl -fsSL https://ollama.com/install.sh | sh']);

    child.stdout.on('data', (data) => {
        event.sender.send('download-progress', { step: 'installing', detail: data.toString() });
    });

    child.on('close', async (code) => {
        const success = code === 0 || await isOllamaInstalled();
        event.sender.send('ollama-status', {
            status: success ? 'installed' : 'failed',
            message: success ? 'Installation successful' : 'Installation failed'
        });
    });
});

ipcMain.on('pull-model', (event) => {
    console.log('Pulling LLaVA model...');
    const child = spawn('ollama', ['pull', 'llava']);

    child.stdout.on('data', (data) => {
        const output = data.toString();
        // Ollama pull output usually contains percentages
        event.sender.send('download-progress', { step: 'pulling', detail: output });
    });

    child.on('close', (code) => {
        event.sender.send('ollama-status', {
            status: code === 0 ? 'ready' : 'failed',
            message: code === 0 ? 'Model ready' : 'Pull failed'
        });
    });
});

ipcMain.on('manual-analysis', (event, data) => {
    const query = data && data.query ? data.query : null;
    console.log(`Manual analysis requested with query: ${query}`);
    captureAndAnalyze(query);
});

// AI Service - Multi-tier approach
async function analyzeWithOllama(base64Image, query = null) {
    return new Promise((resolve, reject) => {
        const defaultPrompt = "Analyze this screen and provide 2 short, actionable productivity tips. Format exactly like this:\nTITLE: [Title]\nDESCRIPTION: [One sentence description]\nCATEGORY: [Category]";
        const prompt = query ? `User Query: ${query}\n\nPlease analyze the screen in context of this query and provide a helpful response. If the query is a general question, answer it based on the screen content.` : defaultPrompt;

        const data = JSON.stringify({
            model: "llava",
            prompt: prompt,
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

async function analyzeWithHuggingFace(base64Image, query = null) {
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
async function captureAndAnalyze(query = null) {
    if (!mainWindow) return;

    mainWindow.webContents.send('analysis-result', query ? 'Thinking...' : 'Analyzing screen...');

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
            const result = await analyzeWithOllama(base64Image, query);
            mainWindow.webContents.send('analysis-result', result);
            return;
        } catch (ollamaError) {
            console.log('Ollama unavailable:', ollamaError.message);
        }

        // Fallback to Hugging Face
        try {
            console.log('Trying Hugging Face API...');
            const result = await analyzeWithHuggingFace(base64Image, query);
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
    // Setup About Panel for macOS
    if (app.setAboutPanelOptions) {
        app.setAboutPanelOptions({
            applicationName: 'Metrixa AI',
            applicationVersion: '0.1.0',
            copyright: '© 2026 Metrixa AI',
            credits: 'The Metrixa AI Team',
            authors: ['Metrixa AI'],
            website: 'https://metrixaai.site',
            iconPath: path.join(__dirname, 'assets', 'icon.png')
        });
    }

    // Setup Menu for macOS name consistency
    const template = [
        ...(process.platform === 'darwin' ? [{
            label: 'Metrixa AI',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    if (process.platform === 'darwin') {
        const setDockIcon = (attempts = 0) => {
            const iconPath = path.join(__dirname, 'assets', 'icon.png');
            try {
                const dockIcon = nativeImage.createFromPath(iconPath);
                if (!dockIcon.isEmpty()) {
                    app.dock.setIcon(dockIcon);
                    console.log('✓ Dock icon updated successfully');
                } else if (attempts < 5) {
                    console.log(`Dock icon empty, retrying... (${attempts + 1}/5)`);
                    setTimeout(() => setDockIcon(attempts + 1), 500);
                }
            } catch (err) {
                console.error('Failed to set dock icon:', err);
                if (attempts < 5) setTimeout(() => setDockIcon(attempts + 1), 500);
            }
        };
        setDockIcon();
    }

    createWindow();
    console.log(`✓ Metrixa AI ready - App Name: ${app.name}`);
    console.log(`  Icon Path: ${path.join(__dirname, 'assets', 'icon.png')}`);
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

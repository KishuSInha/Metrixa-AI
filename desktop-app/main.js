const { app, BrowserWindow, ipcMain, desktopCapturer, nativeImage } = require('electron');
app.setName('Metrixa AI');
const path = require('path');
const Store = require('electron-store');
const OpenAI = require('openai');
require('dotenv').config();

const store = new Store();
let mainWindow;
let monitoringInterval = null;
let openaiClient = null;

function stopMonitoring() {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        console.log('Monitoring stopped.');
    }
}

// Initialize OpenAI from env or store
function initOpenAI() {
    const apiKey = store.get('apiKey') || process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
        openaiClient = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        console.log('✓ OpenAI initialized');
        return true;
    }
    return false;
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
            initOpenAI();
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
    initOpenAI();
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

// Capture and Analyze Logic
async function captureAndAnalyze() {
    if (!mainWindow) return;

    // Send immediate feedback
    mainWindow.webContents.send('analysis-result', 'Analyzing screen...');

    try {
        console.log('Capturing screen...');

        // Use native Electron desktopCapturer
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1280, height: 720 }
        });

        if (sources.length === 0) throw new Error('No screen sources found');

        const base64Image = sources[0].thumbnail.toPNG().toString('base64');
        console.log('Screen captured successfully.');

        if (!openaiClient) {
            const initialized = initOpenAI();
            if (!initialized) {
                // Fallback Mock Response
                console.log('No API Key - Using Mock Analysis');
                await new Promise(r => setTimeout(r, 1500));

                const mockResponse = `
TITLE: Organize Your Desktop
DESCRIPTION: Grouping scattered files into folders will reduce visual clutter.
CATEGORY: Organization

TITLE: Quick Launch
DESCRIPTION: Try Cmd+Space (Spotlight) to open apps instantly without searching.
CATEGORY: Productivity
                 `;

                mainWindow.webContents.send('analysis-result', mockResponse);
                return;
            }
        }

        console.log('Sending to OpenAI...');
        const response = await openaiClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this screen. Provide 2 short, actionable productivity tips. 
                            Format exactly like this:
                            TITLE: [Title]
                            DESCRIPTION: [One sentence description]
                            CATEGORY: [Category]`
                        },
                        { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}` } }
                    ]
                }
            ],
            max_tokens: 300
        });

        const suggestions = response.choices[0].message.content;
        console.log('Analysis result received');

        mainWindow.webContents.send('analysis-result', suggestions);

    } catch (error) {
        console.error('Analysis failed:', error);

        // Fallback for Quota Exceeded (429) or other API errors
        if (error.status === 429 || error.code === 'insufficient_quota') {
            console.log('Quota exceeded. Switching to Mock Analysis.');

            const mockResponse = `
TITLE: Maximize Screen Real Estate
DESCRIPTION: Window management apps like Rectangle can help you snap windows faster.
CATEGORY: Workflow

TITLE: Quota Exceeded (Demo Mode)
DESCRIPTION: Your OpenAI API key has reached its limit. This is a simulated response.
CATEGORY: System
            `;

            mainWindow.webContents.send('analysis-result', mockResponse);
        } else {
            mainWindow.webContents.send('analysis-result', `TITLE: Analysis Failed\nDESCRIPTION: ${error.message}\nCATEGORY: Error`);
        }
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
    initOpenAI();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Floating Panel Logic - Ghost-Style Refinement
const { ipcRenderer } = require('electron');

// Handle errors in renderer process
window.onerror = function(message, source, lineno, colno, error) {
    console.error('[UI] Error:', message, 'at', source, ':', lineno);
    return true;
};

let currentContext = null;
let isProcessing = false;
let hasMessages = false;

// DOM Elements
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const taskInput = document.getElementById('taskInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeContainer = document.getElementById('welcomeContainer');
const contextAppName = document.getElementById('contextAppName');

// Auto-resize textarea
function autoResize() {
    taskInput.style.height = 'auto';
    const newHeight = Math.min(taskInput.scrollHeight, 200);
    taskInput.style.height = newHeight + 'px';
    
    // Enable/disable send button based on content
    sendBtn.disabled = taskInput.value.trim().length === 0 || isProcessing;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContext();
    setupEventListeners();
    taskInput.focus();
});

// Setup Event Listeners
function setupEventListeners() {
    // Window controls
    closeBtn.addEventListener('click', () => {
        ipcRenderer.send('hide-floating-panel');
    });

    minimizeBtn.addEventListener('click', () => {
        ipcRenderer.send('minimize-floating-panel');
    });

    // Send button
    sendBtn.addEventListener('click', () => handleSend());

    // Input handling
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        
        // ESC to close
        if (e.key === 'Escape') {
            ipcRenderer.send('hide-floating-panel');
        }
    });

    // Auto-resize textarea
    taskInput.addEventListener('input', autoResize);
}

// Load Context
async function loadContext() {
    try {
        const result = await ipcRenderer.invoke('detect-context');
        if (result.success) {
            currentContext = result.data;
            displayContext(currentContext);
        }
    } catch (error) {
        console.error('Context load failed');
    }
}

// Display Context
function displayContext(context) {
    if (!context || !context.app) {
        contextAppName.textContent = 'Floating';
        return;
    }
    
    const appName = context.app.name || 'Floating';
    contextAppName.textContent = appName;
}

// Hide welcome and show messages
function hideWelcome() {
    if (!hasMessages && welcomeContainer) {
        welcomeContainer.classList.add('hidden');
        hasMessages = true;
    }
}

// Add Message to Chat
function addMessage(type, text) {
    hideWelcome();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    
    // Formatting: preserve line breaks, handle simple bolding
    let formattedText = text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    msgDiv.innerHTML = `<div class="message-bubble">${formattedText}</div>`;
    
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    
    return msgDiv;
}

// Scroll to bottom
function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 50);
}

// Handle Send
async function handleSend() {
    const text = taskInput.value.trim();
    if (!text || isProcessing) return;

    addMessage('user', text);
    taskInput.value = '';
    autoResize();
    
    isProcessing = true;
    taskInput.disabled = true;
    sendBtn.disabled = true;

    // Show processing indicator
    const aiMsgDiv = addMessage('ai', '...');
    const bubble = aiMsgDiv.querySelector('.message-bubble');
    bubble.innerHTML = '<div class="agent-status"><div class="status-spinner"></div><span>Metrixa is orchestrating...</span></div>';

    try {
        // Refresh context before planning
        const freshContext = await ipcRenderer.invoke('detect-context');
        if (freshContext.success) {
            currentContext = freshContext.data;
            displayContext(currentContext);
        }

        // Create plan
        const planResult = await ipcRenderer.invoke('create-plan', {
            intent: text,
            context: currentContext
        });

        if (!planResult.success) throw new Error(planResult.error);
        
        // Execute plan
        bubble.innerHTML = '<div class="agent-status"><div class="status-spinner"></div><span>Executing steps...</span></div>';
        
        const execResult = await ipcRenderer.invoke('execute-plan', {
            plan: planResult.data,
            context: currentContext
        });

        if (!execResult.success) throw new Error(execResult.error || 'Execution failed');

        const summary = execResult.summary || 'Task completed successfully.';
        bubble.innerHTML = summary.replace(/\n/g, '<br>');

    } catch (error) {
        bubble.innerHTML = `<span style="color: #ff5f57;">Error: ${error.message}</span>`;
    } finally {
        isProcessing = false;
        taskInput.disabled = false;
        sendBtn.disabled = false;
        taskInput.focus();
    }
}

// Listen for context updates
ipcRenderer.on('context-updated', (event, context) => {
    currentContext = context;
    displayContext(context);
});

// Listen for panel show
ipcRenderer.on('panel-show', () => {
    loadContext();
    taskInput.focus();
});

// Ping main process
setInterval(() => {
    ipcRenderer.send('panel-ping');
}, 5000);

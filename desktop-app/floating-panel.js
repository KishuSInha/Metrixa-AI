// Floating Panel Logic - Agent Execution UX
const { ipcRenderer } = require('electron');

// Handle errors in renderer process
window.onerror = function(message, source, lineno, colno, error) {
    console.error('[UI] Error:', message, 'at', source, ':', lineno);
    return true; // Prevent default error handling
};

window.onunhandledrejection = function(event) {
    console.error('[UI] Unhandled promise rejection:', event.reason);
    event.preventDefault();
};

let currentContext = null;
let isProcessing = false;
let hasMessages = false;
let showPlanBeforeExecute = false;
let currentPlan = null;

// DOM Elements
const closeBtn = document.getElementById('closeBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const taskInput = document.getElementById('taskInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeContainer = document.getElementById('welcomeContainer');
const agentStatus = document.getElementById('agentStatus');
const statusHeader = document.getElementById('statusHeader');
const statusSteps = document.getElementById('statusSteps');
const contextBar = document.getElementById('contextBar');
const contextAppName = document.getElementById('contextAppName');
const connectionStatus = document.getElementById('connectionStatus');
const scrollBottomBtn = document.getElementById('scrollBottomBtn');
const planToggle = document.getElementById('planToggle');
const planToggleSwitch = document.getElementById('planToggleSwitch');
const planPreview = document.getElementById('planPreview');

// Global function for quick action buttons
window.setInput = function(text) {
    taskInput.value = text;
    taskInput.focus();
    autoResize();
};

// Auto-resize textarea
function autoResize() {
    taskInput.style.height = 'auto';
    taskInput.style.height = Math.min(taskInput.scrollHeight, 120) + 'px';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadContext();
    setupEventListeners();
    setupScrollListener();
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
    sendBtn.addEventListener('click', () => handleSend(false));

    // Input handling
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const forceExecute = e.metaKey || e.ctrlKey; // ⌘+Enter or Ctrl+Enter
            handleSend(forceExecute);
        }
        
        // ESC to close
        if (e.key === 'Escape') {
            ipcRenderer.send('hide-floating-panel');
        }
    });

    // Auto-resize textarea
    taskInput.addEventListener('input', autoResize);

    // Scroll to bottom button
    scrollBottomBtn?.addEventListener('click', () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });

    // Plan toggle
    planToggle?.addEventListener('click', () => {
        showPlanBeforeExecute = !showPlanBeforeExecute;
        planToggleSwitch.classList.toggle('active', showPlanBeforeExecute);
        planPreview.classList.toggle('hidden', !showPlanBeforeExecute || !currentPlan);
    });
}

// Setup scroll listener
function setupScrollListener() {
    messagesContainer.addEventListener('scroll', () => {
        const isNearBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 100;
        scrollBottomBtn?.classList.toggle('visible', !isNearBottom);
    });
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
        contextBar.classList.add('hidden');
        connectionStatus.textContent = '';
        return;
    }
    
    const appNameText = context.app.name || 'Unknown App';
    const windowTitle = context.window?.title || '';
    
    // Update context bar
    if (windowTitle && windowTitle !== appNameText) {
        contextAppName.textContent = `${appNameText} – ${windowTitle.substring(0, 40)}${windowTitle.length > 40 ? '...' : ''}`;
    } else {
        contextAppName.textContent = appNameText;
    }
    
    contextBar.classList.remove('hidden');
    connectionStatus.textContent = `Connected to: ${appNameText}`;
}

// Hide welcome and show messages
function hideWelcome() {
    if (!hasMessages && welcomeContainer) {
        welcomeContainer.style.display = 'none';
        hasMessages = true;
    }
}

// Add Message to Chat - Minimal style
function addMessage(type, text) {
    hideWelcome();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    
    // Simple text formatting
    let formattedText = text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
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

// Show Agent Status with steps
function showAgentStatus(header, steps, activeStepIndex = -1) {
    agentStatus.classList.remove('hidden');
    statusHeader.textContent = header;
    
    statusSteps.innerHTML = '';
    steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'status-step';
        if (index === activeStepIndex) {
            stepEl.classList.add('active');
        } else if (index < activeStepIndex) {
            stepEl.classList.add('completed');
        }
        
        stepEl.innerHTML = `
            <div class="step-indicator"></div>
            <span>${step}</span>
        `;
        statusSteps.appendChild(stepEl);
    });
}

// Update Agent Status
function updateAgentStatus(header, activeStepIndex) {
    if (header) {
        statusHeader.textContent = header;
    }
    
    const steps = statusSteps.querySelectorAll('.status-step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === activeStepIndex) {
            step.classList.add('active');
        } else if (index < activeStepIndex) {
            step.classList.add('completed');
        }
    });
}

// Hide Agent Status
function hideAgentStatus() {
    agentStatus.classList.add('hidden');
}

// Display Plan Preview
function displayPlanPreview(plan) {
    if (!plan || !plan.steps) return;
    
    currentPlan = plan;
    planPreview.innerHTML = '';
    
    plan.steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'plan-step';
        stepEl.innerHTML = `
            <div class="plan-step-number">${index + 1}</div>
            <div class="plan-step-content">${step.description || step.action}</div>
        `;
        planPreview.appendChild(stepEl);
    });
    
    if (showPlanBeforeExecute) {
        planPreview.classList.remove('hidden');
    }
}

// Show error message
function showError(message) {
    hideAgentStatus();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.innerHTML = `<div class="message-bubble">${message}</div>`;
    messagesContainer.appendChild(errorDiv);
    scrollToBottom();
}

// Handle Send
async function handleSend(forceExecute = false) {
    const text = taskInput.value.trim();
    if (!text || isProcessing) return;

    addMessage('user', text);
    taskInput.value = '';
    autoResize();
    
    isProcessing = true;
    taskInput.disabled = true;
    sendBtn.disabled = true;
    planPreview.classList.add('hidden');

    try {
        showAgentStatus('Metrixa is working...', ['Analyzing...'], 0);

        const freshContext = await ipcRenderer.invoke('detect-context');
        if (freshContext.success) {
            currentContext = freshContext.data;
            displayContext(currentContext);
        }

        const result = await ipcRenderer.invoke('create-plan', {
            intent: text,
            context: currentContext
        });

        if (!result.success) {
            throw new Error(result.error);
        }

        const plan = result.data;
        
        if (showPlanBeforeExecute && !forceExecute) {
            displayPlanPreview(plan);
            hideAgentStatus();
            isProcessing = false;
            taskInput.disabled = false;
            sendBtn.disabled = false;
            taskInput.placeholder = 'Press ⌘+Enter to execute';
            taskInput.focus();
            return;
        }

        showAgentStatus('Executing...', ['Processing...'], 0);

        const execResult = await ipcRenderer.invoke('execute-plan', {
            plan: plan,
            context: currentContext
        });

        if (!execResult.success) {
            throw new Error(execResult.error || 'Execution failed');
        }

        const finalResult = execResult.results?.[execResult.results.length - 1];
        const summaryText = finalResult?.summaryText || finalResult?.summary || execResult.summary || 'Done';

        hideAgentStatus();
        addMessage('ai', summaryText);

    } catch (error) {
        hideAgentStatus();
        showError(`Error: ${error.message}`);
    } finally {
        isProcessing = false;
        taskInput.disabled = false;
        sendBtn.disabled = false;
        taskInput.placeholder = 'Type your task...';
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

// Listen for execution results (backup handler)
ipcRenderer.on('execution-result', (event, data) => {
    console.log('[UI] Received execution-result event:', data);
    if (data && data.result && !isProcessing) {
        hideAgentStatus();
        addMessage('ai', data.result);
    }
});

// Ping main process to check if we're alive
setInterval(() => {
    try {
        ipcRenderer.send('panel-ping');
    } catch (e) {
        console.error('[UI] Failed to ping main process');
    }
}, 5000);

// Handle crashes - try to recover
window.addEventListener('beforeunload', (e) => {
    console.log('[UI] Window unloading...');
});

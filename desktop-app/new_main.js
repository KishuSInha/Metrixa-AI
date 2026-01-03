const {app,BrowserWindow,globalShortcut,screen,desktopCapturer}=require('electron');
app.setName('Metrixa AI');
const path=require('path');
const Store=require('electron-store');
const openAI=require('openai');
const { log } = require('console');
require('dotenv').config();

const store=new Store();
let mainWindow;
let monitoringInterval=null;
let openaiClient=null;

function stopMonitoring(){
    if(monitoringInterval){
        clearInterval(monitoringInterval);
        monitoringInterval=null;
        console.log('Monitoring Stopped.');
        
    }
}

// Initializing open ai from env or the store
function initOpenAI(){
    const apiKey=store.get('apiKey')||process.env.OPENAI_API_KEY;
    
}
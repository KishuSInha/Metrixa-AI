const { desktopCapturer, screen } = require('electron');
const Tesseract = require('tesseract.js');

async function getScreenText(mainWindow) {
    let worker = null;
    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: screen.getPrimaryDisplay().size
        });
        if (sources.length === 0) throw new Error('No screen sources found');
        const buffer = sources[0].thumbnail.toPNG();

        console.log('Initializing Tesseract worker...');
        worker = await Tesseract.createWorker('eng');
        const result = await worker.recognize(buffer);

        console.log('OCR Complete. Confidence:', result.data.confidence);

        if (!result || !result.data) {
            console.error('OCR returned no data.');
            if (worker) await worker.terminate();
            return { text: '', words: [] };
        }

        // DEBUG: Log the keys to see if 'words' exists or is named something else
        console.log('OCR Data Keys:', Object.keys(result.data));
        if (result.data.words) {
            console.log('Words count:', result.data.words.length);
        } else {
            console.warn('WARNING: result.data.words is missing!');
        }

        let words = [];
        if (result.data.words) {
            words = result.data.words.map(w => ({
                text: w.text,
                confidence: w.confidence,
                bbox: w.bbox
            }));
        } else {
            console.warn('WARNING: result.data.words is missing. Returning empty word list.');
        }

        const data = {
            text: result.data.text,
            words: words,
            windowBounds: mainWindow.getBounds()
        };

        await worker.terminate();
        return data;
    } catch (err) {
        console.error('OCR failed:', err);
        if (worker) {
            try { await worker.terminate(); } catch (e) { }
        }
        throw err;
    }
}

const screenshot = require('screenshot-desktop');

async function readScreenText() {
    let worker = null;
    try {
        console.log('Capturing screen for OCR...');
        const img = await screenshot({ format: 'png' });

        console.log('Initializing Tesseract...');
        worker = await Tesseract.createWorker('eng');
        const { data } = await worker.recognize(img);

        await worker.terminate();
        return data?.text || "";
    } catch (err) {
        console.error('OCR (readScreenText) failed:', err);
        if (worker) {
            try { await worker.terminate(); } catch (e) { }
        }
        return "";
    }
}

module.exports = { getScreenText, readScreenText };

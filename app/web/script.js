// Initialize Icons with specific styling
lucide.createIcons();

let html5QrcodeScanner = null;
let isScanning = false;

// Init
window.onload = function() { startScanner(); };

// Helper to safely stop the scanner
async function safelyStopScanner() {
    if (html5QrcodeScanner) {
        try {
            if (html5QrcodeScanner.isScanning) {
                await html5QrcodeScanner.stop();
            }
        } catch (e) {
            console.log("Stop/Clear skipped or failed (harmless)", e);
        }
        isScanning = false;
    }
}

async function startScanner() {
    document.getElementById('processing-overlay').classList.add('hidden');
    
    try {
        await safelyStopScanner(); // Ensure previous instance is stopped
        
        if (!html5QrcodeScanner) {
            html5QrcodeScanner = new Html5Qrcode("reader");
        }
        
        const config = { 
            fps: 10, 
            // FIX: Ensure qrbox dimensions are never smaller than 50px
            qrbox: function(viewfinderWidth, viewfinderHeight) {
                const minSize = 50;
                return { 
                    width: viewfinderWidth < minSize ? 250 : viewfinderWidth, 
                    height: viewfinderHeight < minSize ? 250 : viewfinderHeight 
                };
            },
            aspectRatio: window.innerHeight / window.innerWidth,
            videoConstraints: {
                facingMode: "environment",
                focusMode: "continuous",
                width: { ideal: 1920 },
                height: { ideal: 1080 } 
            }
        };

        await html5QrcodeScanner.start(
            { facingMode: "environment" }, 
            config, 
            onScanSuccess, 
            () => {} 
        );
        
        isScanning = true;
        initAdvancedControls();

    } catch (err) {
        console.error("Camera Start Error", err);
        try {
             // Retry fallback without High Res
             await safelyStopScanner();
             await html5QrcodeScanner.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, onScanSuccess, () => {});
             isScanning = true;
             initAdvancedControls();
        } catch(e) {
            console.error("Fallback failed", e);
        }
    }
}

function onScanSuccess(decodedText, decodedResult) {
    if(!isScanning) return;
    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(50);
    handleSuccess(decodedText);
}

async function captureAndScan() {
    if (!html5QrcodeScanner || !isScanning) return;

    const videoEl = document.querySelector('#reader video');
    if(!videoEl) return;

    // Button press animation feedback
    const btn = document.getElementById('snap-btn');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => btn.style.transform = 'scale(1)', 150);

    videoEl.pause(); 
    
    document.getElementById('processing-overlay').classList.remove('hidden');
    document.getElementById('processing-text').textContent = "Scanning...";

    try {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

        await safelyStopScanner();

        if ('BarcodeDetector' in window) {
            try {
                const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
                const barcodes = await barcodeDetector.detect(canvas);
                if (barcodes.length > 0) {
                    handleSuccess(barcodes[0].rawValue);
                    return;
                }
            } catch (e) { console.log("Native detector failed, falling back..."); }
        }

        canvas.toBlob(async (blob) => {
            const file = new File([blob], "snap.jpg", { type: "image/jpeg" });
            try {
                if (!html5QrcodeScanner) html5QrcodeScanner = new Html5Qrcode("reader");
                
                const result = await html5QrcodeScanner.scanFile(file, true);
                handleSuccess(result);
            } catch (err) {
                showError("No barcode found. Try moving closer and holding steady.");
                closeErrorModal(); 
            }
        }, 'image/jpeg', 0.95);

    } catch (e) {
        console.error("Capture error", e);
        cancelProcessing(); 
        startScanner(); 
    }
}

function cancelProcessing() {
    if (!isScanning) {
        startScanner();
    } else {
        const videoEl = document.querySelector('#reader video');
        if(videoEl) videoEl.play();
        try { html5QrcodeScanner.resume(); } catch(e){}
    }
    document.getElementById('processing-overlay').classList.add('hidden');
}

function handleSuccess(decodedText) {
    safelyStopScanner().then(() => {
        fetchProductData(decodedText);
    });
}

async function initAdvancedControls() {
    try {
        if(!html5QrcodeScanner.html5Qrcode.videoElement) return;
        const track = html5QrcodeScanner.html5Qrcode.videoElement.srcObject.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if(capabilities.torch) document.getElementById('torch-btn').classList.remove('hidden');
        
        if(capabilities.zoom) {
            const zoomSlider = document.getElementById('zoom-slider');
            const zoomControls = document.getElementById('zoom-controls');
            zoomSlider.min = capabilities.zoom.min;
            zoomSlider.max = capabilities.zoom.max;
            zoomSlider.step = capabilities.zoom.step || 0.1;
            zoomControls.classList.remove('hidden');
        }
    } catch(e) {}
}

function handleZoom(value) {
    if(!html5QrcodeScanner) return;
    html5QrcodeScanner.applyVideoConstraints({ advanced: [{ zoom: parseFloat(value) }] });
}

let torchOn = false;
function toggleTorch() {
    if(!html5QrcodeScanner) return;
    torchOn = !torchOn;
    const btn = document.getElementById('torch-btn');
    if(torchOn) {
        btn.classList.remove('bg-yellow-400/20', 'text-yellow-300', 'border-yellow-400/50');
        btn.classList.add('bg-white/10', 'text-white', 'border-white/20');
    } else {
        btn.classList.add('bg-yellow-400/20', 'text-yellow-300', 'border-yellow-400/50');
        btn.classList.remove('bg-white/10', 'text-white', 'border-white/20');
    }
    html5QrcodeScanner.applyVideoConstraints({ advanced: [{ torch: torchOn }] });
}

function triggerFileInput() {
    document.getElementById('hidden-file-input').click();
}
function handleFileScan(input) {
    if (input.files.length === 0) return;
    document.getElementById('processing-overlay').classList.remove('hidden');
    document.getElementById('processing-text').textContent = "Processing...";
    
    safelyStopScanner().then(() => {
         if (!html5QrcodeScanner) html5QrcodeScanner = new Html5Qrcode("reader");
         return html5QrcodeScanner.scanFile(input.files[0], true);
    })
    .then(decodedText => handleSuccess(decodedText))
    .catch(err => {
        showError("Could not read barcode from image.");
        document.getElementById('processing-overlay').classList.add('hidden');
        input.value = '';
        startScanner();
    });
}

// --- Modal Logic ---
function showManualEntry() {
    document.getElementById('manual-modal').classList.remove('hidden');
    document.getElementById('manual-code-input').focus();
}
function closeManualEntry() { document.getElementById('manual-modal').classList.add('hidden'); }

function showInfoModal() { document.getElementById('info-modal').classList.remove('hidden'); }
function closeInfoModal() { document.getElementById('info-modal').classList.add('hidden'); }

function submitManualCode() {
    const code = document.getElementById('manual-code-input').value.trim();
    if (code) { closeManualEntry(); handleSuccess(code); }
}

async function fetchProductData(barcode) {
    document.getElementById('processing-overlay').classList.remove('hidden');
    document.getElementById('processing-text').textContent = "Fetching Details...";

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1 && data.product) {
            populateProduct(data.product);
            document.getElementById('scan-view').classList.add('hidden');
            document.getElementById('result-view').classList.remove('hidden');
        } else {
            throw new Error("Product not found");
        }
    } catch (error) {
        document.getElementById('processing-overlay').classList.add('hidden');
        showError("Product not found. Please check your connection.");
    }
}

function showError(msg) {
    document.getElementById('error-msg').textContent = msg;
    document.getElementById('error-modal').classList.remove('hidden');
}

function closeErrorModal() {
    document.getElementById('error-modal').classList.add('hidden');
    startScanner();
}

function populateProduct(product) {
    try {
        document.getElementById('product-name').textContent = product.product_name || "Unknown Product";
        document.getElementById('product-brand').textContent = product.brands || "Unknown Brand";
        
        const imgEl = document.getElementById('product-image');
        imgEl.src = product.image_front_url || product.image_url || 'https://via.placeholder.com/400x300?text=No+Image';
        
        const scoreBadge = document.getElementById('nutriscore-badge');
        const grade = (product.nutrition_grades || 'unknown').toLowerCase();
        document.getElementById('score-val').textContent = grade;
        scoreBadge.className = `absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider border border-white/20 backdrop-blur-sm nutri-score-${grade}`;

        const vegStatusIcon = document.getElementById('veg-status-icon');
        vegStatusIcon.innerHTML = ''; vegStatusIcon.classList.add('hidden');
        if (product.ingredients_analysis_tags) {
            const isVeg = product.ingredients_analysis_tags.some(tag => tag === 'en:vegetarian');
            const isNonVeg = product.ingredients_analysis_tags.some(tag => tag === 'en:non-vegetarian');
            if (isVeg) { vegStatusIcon.innerHTML = `<div class="veg-icon"><div class="veg-dot"></div></div>`; vegStatusIcon.classList.remove('hidden'); } 
            else if (isNonVeg) { vegStatusIcon.innerHTML = `<div class="non-veg-icon"><div class="non-veg-dot"></div></div>`; vegStatusIcon.classList.remove('hidden'); }
        }

        const originText = product.manufacturing_places || product.origins || product.emb_codes || "";
        const originSec = document.getElementById('origin-section');
        if (originText) { originSec.classList.remove('hidden'); document.getElementById('product-origin').textContent = originText; } 
        else { originSec.classList.add('hidden'); }

        const nutriments = product.nutriments || {};
        document.getElementById('val-cal').textContent = Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0);
        document.getElementById('val-sugar').textContent = (nutriments.sugars_100g || nutriments.sugars || 0).toFixed(1);
        document.getElementById('val-fat').textContent = (nutriments.fat_100g || nutriments.fat || 0).toFixed(1);
        document.getElementById('val-protein').textContent = (nutriments.proteins_100g || nutriments.proteins || 0).toFixed(1);

        document.getElementById('product-ingredients').textContent = product.ingredients_text_en || product.ingredients_text || "Ingredients list not available.";

        const container = document.getElementById('tags-container');
        container.innerHTML = '';
        const addTag = (text, color) => {
            const span = document.createElement('span');
            span.className = `text-[10px] uppercase px-3 py-1 bg-${color}-50 text-${color}-700 rounded-full font-bold border border-${color}-100`;
            span.textContent = text;
            container.appendChild(span);
        };
        if (product.labels_tags) {
            if (product.labels_tags.some(t => t.includes('vegan'))) addTag('Vegan', 'green');
            if (product.labels_tags.some(t => t.includes('gluten-free'))) addTag('Gluten Free', 'blue');
            if (product.labels_tags.some(t => t.includes('organic'))) addTag('Organic', 'emerald');
            if (product.labels_tags.some(t => t.includes('fssai'))) addTag('FSSAI', 'orange');
        }
    } catch(e) { console.error("Error populating data", e); }
}

function resetApp() { 
     document.getElementById('result-view').classList.add('hidden');
     document.getElementById('scan-view').classList.remove('hidden');
     startScanner();
}

// ===== ADSGRAM ΡΥΘΜΙΣΕΙΣ =====
const ADSGRAM_BLOCK_ID = '32221';
let AdController = null;

function initAdsgram() {
    if (typeof window.Adsgram !== 'undefined') {
        AdController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        console.log('✅ Adsgram SDK initialized');
    } else {
        console.warn('⏳ Adsgram SDK not loaded, retrying...');
        setTimeout(initAdsgram, 1000);
    }
}

window.addEventListener('load', initAdsgram);

function showRewardedAd() {
    if (!AdController) {
        alert('Οι διαφημίσεις δεν είναι ακόμα διαθέσιμες. Δοκίμασε ξανά σε λίγο.');
        return Promise.reject('not_ready');
    }
    return AdController.show()
        .then((result) => {
            console.log('✅ Ad finished:', result);
            return result;
        })
        .catch((result) => {
            console.warn('⚠️ Ad error or skipped:', result);
            throw result;
        });
}

// ===== CONSENT / GDPR =====
function checkConsent() {
    if (!localStorage.getItem('lifeline_consent')) {
        document.getElementById('consent-overlay').classList.remove('hidden');
    }
}

function acceptConsent() {
    localStorage.setItem('lifeline_consent', 'true');
    document.getElementById('consent-overlay').classList.add('hidden');
}

// ===== TERMS & PRIVACY ΔΟΜΗ (ΤΑ ΔΙΚΑ ΣΟΥ ΑΥΘΕΝΤΙΚΑ ΚΕΙΜΕΝΑ) =====
const TERMS_STRUCTURE = {
    terms: {
        title: 'Όροι Χρήσης & Προϋποθέσεις',
        content: `Καλώς ήρθατε στο LiFe LiNe! Χρησιμοποιώντας την εφαρμογή μας, αποδέχεστε πλήρως τους παρακάτω όρους:\n\n1. Η εφαρμογή παρέχει αναλύσεις χειρομαντείας και αστρολογίας με τη χρήση Τεχνητής Νοημοσύνης (AI) αποκλειστικά και μόνο για σκοπούς ψυχαγωγίας. Καμία πληροφορία ή πρόβλεψη δεν πρέπει να εκλαμβάνεται ως ιατρική, νομική, οικονομική ή επαγγελματική συμβουλή.\n\n2. Δεν φέρουμε καμία ευθύνη για τυχόν αποφάσεις ή πράξεις που βασίζονται στα αποτελέσματα των αναλύσεων της εφαρμογής.\n\n3. Η χρήση της εφαρμογής επιτρέπεται μόνο σε άτομα άνω των 18 ετών ή με τη συγκατάθεση κηδεμόνα.\n\n4. Διατηρούμε το δικαίωμα να τροποποιήσουμε τους όρους ή να διακόψουμε τη λειτουργία της εφαρμογής ανά πάσα στιγμή χωρίς προειδοποίηση.`
    },
    privacy: {
        title: 'Πολιτική Απορρήτου & Προστασία Δεδομένων',
        content: `Στο LiFe LiNe σεβόμαστε απόλυτα την ιδιωτικότητά σας:\n\n1. Χρήση Κάμερας & Εικόνων: Η εφαρμογή ζητά πρόσβαση στην κάμερά σας αποκλειστικά για τη λήψη φωτογραφίας της παλάμης σας. Η επεξεργασία της εικόνας γίνεται σε πραγματικό χρόνο. Η φωτογραφία αποστέλλεται με ασφάλεια στο API μας και ΔΕΝ αποθηκεύεται μόνιμα στους διακομιστές μας. Διαγράφεται αμέσως μετά την έκδοση της πρόβλεψης.\n\n2. Συλλογή Δεδομένων: Δεν συλλέγουμε προσωπικά στοιχεία όπως ονοματεπώνυμο ή email. Αποθηκεύουμε το Telegram User ID σας αποκλειστικά για τη διαχείριση και την ασφάλεια των πόντων VIP και των referrals.\n\n3. Cookies & Τοπική Αποθήκευση: Χρησιμοποιούμε το LocalStorage της συσκευής σας για να θυμόμαστε τις ρυθμίσεις σας και το υπόλοιπο των πόντων σας.\n\n4. Κοινοποίηση Δεδομένων: Δεν πουλάμε ούτε μοιραζόμαστε τα δεδομένα σας με τρίτες διαφημιστικές εταιρείες.`
    }
};

function showTerms(type) {
    const data = TERMS_STRUCTURE[type];
    if (!data) return;
    
    const overlay = document.getElementById('terms-modal-overlay');
    const container = document.getElementById('terms-modal');
    
    container.innerHTML = `
        <h2 style="margin-bottom:15px; color:var(--gold-glow);" data-translate="true">${data.title}</h2>
        <p style="margin-bottom:20px; white-space:pre-line; color:#ece5f5; text-align:left; font-size:13px;" data-translate="true">${data.content}</p>
        <button class="btn btn-purple" onclick="closeTerms()" data-translate="true">Κλείσιμο</button>
    `;
    
    if (typeof saveOriginalTexts === 'function') {
        saveOriginalTexts();
    }
    if (currentLang !== 'el' && typeof translatePage === 'function') {
        translatePage(currentLang);
    }
    
    overlay.style.display = 'flex';
}

function closeTerms() {
    document.getElementById('terms-modal-overlay').style.display = 'none';
}

// ===== TELEGRAM INTEGRATION & POINTS =====
function getCurrentUserId() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id;
    }
    return 999999;
}

function getUserPoints() {
    var uid = getCurrentUserId();
    var pts = localStorage.getItem('lifeline_pts_' + uid);
    if (pts === null) {
        localStorage.setItem('lifeline_pts_' + uid, '15'); // 15 δωρεάν αρχικοί πόντοι βάσει backend
        return 15;
    }
    return parseInt(pts, 10);
}

function updateUserPoints(amount) {
    var uid = getCurrentUserId();
    var current = getUserPoints();
    var updated = Math.max(0, current + amount);
    localStorage.setItem('lifeline_pts_' + uid, updated.toString());
    updatePointsUI();
    return updated;
}

function updatePointsUI() {
    var pts = getUserPoints();
    document.getElementById('user-points-display').innerText = pts;
    document.getElementById('vip-points').innerText = pts;
    
    var vipBtn = document.getElementById('analyze-vip-btn');
    if (pts >= 5) {
        vipBtn.disabled = false;
        vipBtn.style.boxShadow = '0 0 15px rgba(230, 126, 34, 0.4)';
    } else {
        vipBtn.disabled = true;
        vipBtn.style.boxShadow = 'none';
    }
}

// ===== CAMERA & LIVE PREVIEW MANAGEMENT =====
let localStream = null;
let currentFacingMode = 'user';
let uploadedImageBase64 = null;

async function initCamera() {
    uploadedImageBase64 = null;
    document.getElementById('start-camera-btn').style.display = 'none';
    document.getElementById('switch-camera-btn').style.display = 'block';
    
    var constraint = currentFacingMode === 'user' ? { facingMode: 'user' } : { facingMode: { exact: 'environment' } };
    
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: constraint,
            audio: false
        });
        
        var videoPreview = document.getElementById('camera-preview');
        if (videoPreview) {
            videoPreview.srcObject = localStream;
            videoPreview.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'none';
            videoPreview.style.background = 'none';
        }
        
        document.getElementById('scan-line').style.display = 'block';
        updateActionButtonsVisibility();
        console.log("✅ Κάμερα αρχικοποιήθηκε με Live Preview");
    } catch (e) {
        console.warn('⚠️ Δοκιμή γενικού constraint κάμερας λόγω facingMode σφάλματος...', e);
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            var videoPreview = document.getElementById('camera-preview');
            if (videoPreview) {
                videoPreview.srcObject = localStream;
                videoPreview.style.transform = 'scaleX(-1)';
                videoPreview.style.background = 'none';
            }
            document.getElementById('scan-line').style.display = 'block';
            updateActionButtonsVisibility();
        } catch (err) {
            alert('Δεν ήταν δυνατή η πρόσβαση στην κάμερα. Παρακαλώ δώστε δικαιώματα ή κάντε Upload φωτογραφίας.');
            console.error('❌ Καθολικό σφάλμα κάμερας:', err);
            document.getElementById('start-camera-btn').style.display = 'block';
            document.getElementById('switch-camera-btn').style.display = 'none';
        }
    }
}

function stopCamera() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    var videoPreview = document.getElementById('camera-preview');
    if (videoPreview) {
        videoPreview.srcObject = null;
    }
    document.getElementById('scan-line').style.display = 'none';
}

function switchCamera() {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    stopCamera();
    initCamera();
}

function updateActionButtonsVisibility() {
    var hasSource = (localStream !== null || uploadedImageBase64 !== null);
    var analyzeBtn = document.getElementById('analyze-btn');
    var vipBtn = document.getElementById('analyze-vip-btn');
    
    if (hasSource) {
        analyzeBtn.style.display = 'inline-flex';
        vipBtn.style.display = 'inline-flex';
    } else {
        analyzeBtn.style.display = 'none';
        vipBtn.style.display = 'none';
    }
}

function handleFileUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    
    stopCamera();
    document.getElementById('start-camera-btn').style.display = 'block';
    document.getElementById('switch-camera-btn').style.display = 'none';
    
    var reader = new FileReader();
    reader.onload = function(e) {
        uploadedImageBase64 = e.target.result;
        
        var videoPreview = document.getElementById('camera-preview');
        if (videoPreview) {
            videoPreview.srcObject = null;
            videoPreview.style.transform = 'none';
            videoPreview.style.background = `url('${uploadedImageBase64}') center center / cover no-repeat`;
        }
        
        updateActionButtonsVisibility();
        console.log("✅ Επιτυχές Upload φωτογραφίας");
    };
    reader.readAsDataURL(file);
}

function captureImage() {
    if (uploadedImageBase64) return uploadedImageBase64;
    
    var video = document.getElementById('camera-preview');
    var canvas = document.getElementById('camera-canvas');
    if (!video || !canvas || !localStream) return null;
    
    var ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    if (currentFacingMode === 'user') {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    
    return canvas.toDataURL('image/jpeg', 0.85);
}

// ===== ANALYSIS FLOW & FLOW LOGIC =====
async function startAnalysisFlow(isVip) {
    var image = captureImage();
    if (!image) {
        alert('Παρακαλώ ανοίξτε την κάμερα ή κάντε upload μια φωτογραφία της παλάμης σας πρώτα!');
        return;
    }
    
    if (isVip) {
        if (getUserPoints() < 5) {
            alert('Δεν έχετε αρκετούς πόντους για VIP ανάλυση!');
            return;
        }
        executeAnalysis(image, true);
    } else {
        document.getElementById('loading-box').style.display = 'flex';
        showRewardedAd()
            .then(() => {
                updateUserPoints(2); // Κέρδος 2 πόντων από τη διαφήμιση
                executeAnalysis(image, false);
            })
            .catch((err) => {
                document.getElementById('loading-box').style.display = 'none';
                if (err !== 'not_ready') {
                    alert('Πρέπει να παρακολουθήσετε τη διαφήμιση για να λάβετε τη δωρεάν ανάλυση.');
                }
            });
    }
}

async function executeAnalysis(imageBase64, isVip) {
    document.getElementById('loading-box').style.display = 'flex';
    
    var gender = document.getElementById('gender-select').value;
    var zodiac = document.getElementById('zodiac-select').value;
    var topic = document.getElementById('topic-select').value;
    var userId = getCurrentUserId();
    
    var payload = {
        image: imageBase64,
        user_id: userId,
        gender: gender,
        zodiac: zodiac,
        topic: topic,
        is_vip: isVip
    };
    
    try {
        var response = await fetch('https://franklymadear-lifeline.hf.space/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        var data = await response.json();
        document.getElementById('loading-box').style.display = 'none';
        
        if (data.success && data.reading) {
            if (isVip) {
                updateUserPoints(-5); // Αφαίρεση πόντων VIP μόνο μετά από επιτυχία
            }
            showResultPopup(data.reading);
            rewardReferrerIfFirstAnalysis();
        } else {
            alert('Σφάλμα κατά την ανάλυση: ' + (data.error || 'Άγνωστο σφάλμα'));
        }
    } catch (error) {
        document.getElementById('loading-box').style.display = 'none';
        console.error('Analysis API Error:', error);
        alert('Αποτυχία σύνδεσης με τον διακομιστή της Aziram. Δοκιμάστε ξανά.');
    }
}

function showResultPopup(markdownText) {
    var htmlContent = markdownText
        .replace(/## (.*?)(?:\n|$)/g, '<h2>$1</h2>')
        .replace(/### (.*?)(?:\n|$)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
        
    document.getElementById('result-popup-text').innerHTML = htmlContent;
    document.getElementById('result-popup-overlay').style.display = 'flex';
}

function closeResultPopup() {
    document.getElementById('result-popup-overlay').style.display = 'none';
    uploadedImageBase64 = null;
    var videoPreview = document.getElementById('camera-preview');
    if (videoPreview) videoPreview.style.background = 'none';
    stopCamera();
    document.getElementById('start-camera-btn').style.display = 'block';
    document.getElementById('switch-camera-btn').style.display = 'none';
    updateActionButtonsVisibility();
}

// ===== NAVIGATION =====
function navigateToScanPage() {
    document.getElementById('splash-page').classList.add('hidden');
    document.getElementById('scan-page').classList.remove('hidden');
}

// ===== MULTILANGUAGE TRANSLATION SYSTEM =====
let currentLang = 'el';
const originalTexts = new Map();

function saveOriginalTexts() {
    const elements = document.querySelectorAll('[data-translate="true"]');
    elements.forEach((el, index) => {
        if (!el.getAttribute('data-text-id')) {
            const id = 'text_' + index + '_' + el.innerText.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '');
            el.setAttribute('data-text-id', id);
            originalTexts.set(id, el.innerHTML);
        } else {
            originalTexts.set(el.getAttribute('data-text-id'), el.innerHTML);
        }
    });
}

function restoreOriginalTexts() {
    const elements = document.querySelectorAll('[data-translate="true"]');
    elements.forEach(el => {
        const id = el.getAttribute('data-text-id');
        if (originalTexts.has(id)) {
            el.innerHTML = originalTexts.get(id);
        }
    });
}

async function translatePage(targetLang) {
    if (targetLang === 'el') {
        restoreOriginalTexts();
        return;
    }
    
    const elements = Array.from(document.querySelectorAll('[data-translate="true"]'));
    if (elements.length === 0) return;
    
    const batchSize = 10;
    for (let i = 0; i < elements.length; i += batchSize) {
        const batch = elements.slice(i, i + batchSize);
        const promises = batch.map(async (el) => {
            const id = el.getAttribute('data-text-id');
            const sourceText = originalTexts.get(id) || el.innerHTML;
            
            if (!sourceText.trim() || sourceText.startsWith('<div class="loading')) return;
            
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=el&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
            
            try {
                const res = await fetch(url);
                const json = await res.json();
                if (json && json[0]) {
                    let translatedText = json[0].map(item => item[0]).join('');
                    el.innerHTML = translatedText;
                }
            } catch (err) {
                console.error('Translation error for element:', err);
            }
        });
        await Promise.all(promises);
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    translatePage(lang);
}

// ===== REFERRALS & SHARING =====
function getReferralLink() {
    var uid = getCurrentUserId();
    return 'https://t.me/lifeline2026_bot?start=ref_' + uid;
}

function shareViaTelegram() {
    var link = getReferralLink();
    var text = encodeURIComponent('🖐️ Χειρομαντεία με AI! Δες την παλάμη σου: ' + link);
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + text);
    } else {
        window.open('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + text, '_blank');
    }
}

function shareViaWhatsApp() {
    var link = getReferralLink();
    var text = encodeURIComponent('🖐️ Χειρομαντεία με AI! Δες την παλάμη σου: ' + link);
    window.open('https://wa.me/?text=' + text, '_blank');
}

async function rewardReferrerIfFirstAnalysis() {
    var userId = getCurrentUserId();
    try {
        await fetch('/api/referral/reward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
    } catch (e) {}
}

function addInviteButton() {
    var bar = document.getElementById('rewards-bar');
    if (!bar || document.getElementById('invite-friends-btn')) return;
    
    var btn = document.createElement('button');
    btn.id = 'invite-friends-btn';
    btn.className = 'btn btn-purple';
    btn.style.padding = '4px 8px';
    btn.style.fontSize = '11px';
    btn.style.width = 'auto';
    btn.style.borderRadius = '8px';
    btn.innerText = '➕ Πρόσκληση';
    btn.onclick = shareViaTelegram;
    bar.appendChild(btn);
}

// ===== INITIALIZATION ON LOAD =====
window.addEventListener('DOMContentLoaded', () => {
    checkConsent();
    saveOriginalTexts();
    updatePointsUI();
    addInviteButton();
});

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

// ===== MANDATORY STARTUP MODAL (CHECK CONSENT) =====
function checkConsent() {
    // Εμφανίζεται πάντα στην έναρξη αν δεν έχει πατηθεί η αποδοχή
    if (!localStorage.getItem('lifeline_consent_2026')) {
        document.getElementById('consent-overlay').style.display = 'flex';
    } else {
        document.getElementById('consent-overlay').style.display = 'none';
    }
}

function acceptConsent() {
    localStorage.setItem('lifeline_consent_2026', 'true');
    document.getElementById('consent-overlay').style.display = 'none';
}

// ===== TERMS & PRIVACY STRUCTURE =====
const TERMS_STRUCTURE = {
    terms: {
        title: '📜 Όροι Χρήσης LiFe LiNe',
        sections: [
            { heading: '1. Όριο Ηλικίας (Αυστηρά 18+)', body: 'Η χρήση της εφαρμογής <strong>LiFe LiNe</strong> επιτρέπεται αποκλειστικά και μόνο σε άτομα που έχουν συμπληρώσει το 18ο έτος της ηλικίας τους (ενήλικες). Οι διαχειριστές δεν φέρουν καμία ευθύνη για ψευδείς δηλώσεις ηλικίας.' },
            { heading: '2. Ψυχαγωγικός Χαρακτήρας', body: 'Το LiFe LiNe χρησιμοποιεί αλγόριθμους τεχνητής νοημοσύνης (AI) για να αναλύει τα χαρακτηριστικά της παλάμης. Η υπηρεσία παρέχεται αποκλειστικά για σκοπούς χιούμορ και ψυχαγωγίας. Τα αποτελέσματα <strong>δεν αποτελούν σε καμία περίπτωση</strong> πραγματικές, ιατρικές, ψυχολογικές ή επαγγελματικές συμβουλές.' },
            { heading: '3. Περιορισμός Ευθύνης', body: 'Ο χρήστης χρησιμοποιεί την εφαρμογή με δική του ευθύνη. Οι δημιουργοί δεν φέρουν καμία απολύτως αστική ή ποινική ευθύνη για οποιαδήποτε πράξη ή απόφαση βασιστεί στα αποτελέσματα της εφαρμογής.' }
        ],
        footer: '📧 info.franklydear@gmail.com'
    },
    privacy: {
        title: '🔒 Πολιτική Απορρήτου LiFe LiNe',
        sections: [
            { heading: '1. Διαχείριση Εικόνων Παλάμης', body: 'Οι φωτογραφίες μετατρέπονται σε κώδικα Base64 στη συσκευή σας και στέλνονται με ασφάλεια στο API μας. <strong>Καμία Μόνιμη Αποθήκευση:</strong> Οι εικόνες ΔΕΝ αποθηκεύονται σε βάσεις δεδομένων και διαγράφονται οριστικά αμέσως μόλις ολοκληρωθεί η ανάλυση.' },
            { heading: '2. Cookies & Τοπική Αποθήκευση', body: 'Χρησιμοποιούμε Local Storage στη συσκευή σας αποκλειστικά για να αποθηκεύουμε με ασφάλεια το υπόλοιπο των πόντων σας και τα δεδομένα των referrals.' }
        ],
        footer: '📧 info.franklydear@gmail.com'
    }
};

async function showTerms(type) {
    var modal = document.getElementById('terms-modal');
    var structure = TERMS_STRUCTURE[type];
    if (!structure) return;

    var html = `<h2>${structure.title}</h2>`;
    structure.sections.forEach(function(sec) {
        html += `<h3 style="margin-top:12px;color:var(--purple-gold);">${sec.heading}</h3>`;
        html += `<p style="margin-bottom:8px;text-align:left;">${sec.body}</p>`;
    });
    html += `<p style="text-align:center;margin-top:18px;">${structure.footer}</p>`;
    html += '<button class="btn btn-purple" onclick="closeTerms()" style="margin-top:15px;">✕ Κλείσιμο</button>';

    modal.innerHTML = html;
    document.getElementById('terms-modal-overlay').style.display = 'flex';
}

function closeTerms() {
    document.getElementById('terms-modal-overlay').style.display = 'none';
}

// ===== ΠΟΝΤΟΙ, REFERRALS & ΚΟΣΤΟΣ ΑΝΑΛΥΣΗΣ =====
const POINTS_KEY = 'lifeline_user_points_v2';
const REF_COUNT_KEY = 'lifeline_referrals_count';
const ANALYSIS_COST = 15; // Κάθε ανάλυση κοστίζει 15 πόντους

function getCurrentUserId() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    var testId = localStorage.getItem('lifeline_local_uid');
    if (!testId) {
        testId = 'usr_' + Math.floor(Math.random() * 1000000);
        localStorage.setItem('lifeline_local_uid', testId);
    }
    return testId;
}

// Κάθε νέος επισκέπτης παίρνει αυτόματα 15 πόντους αρχικά
function getUserPoints() { 
    var points = localStorage.getItem(POINTS_KEY);
    if (points === null) {
        localStorage.setItem(POINTS_KEY, '15');
        return 15;
    }
    return parseInt(points, 10);
}

function addPoints(amount) { 
    var updated = getUserPoints() + amount;
    localStorage.setItem(POINTS_KEY, updated.toString()); 
    updatePointsDisplay(); 
}

function updatePointsDisplay() {
    var pts = getUserPoints();
    var display = document.getElementById('user-points-display');
    if (display) display.textContent = pts;
    
    // Έλεγχος και κλείδωμα κουμπιού ανάλυσης βάσει των 15 πόντων
    var analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        if (pts >= ANALYSIS_COST) {
            analyzeBtn.disabled = false;
            analyzeBtn.style.opacity = '1';
        } else {
            analyzeBtn.disabled = true;
            analyzeBtn.style.opacity = '0.5';
        }
    }
    
    // Ενημέρωση referral UI
    var currentRefs = parseInt(localStorage.getItem(REF_COUNT_KEY) || '0', 10);
    var refText = document.getElementById('ref-count-text');
    if (refText) refText.textContent = currentRefs;
}

// 📺 Λειτουργία Κουμπιού Διαφήμισης: Κέρδος +10 πόντων
async function watchAdForPoints() {
    try {
        await showRewardedAd();
        addPoints(10);
        alert('🎉 Συγχαρητήρια! Παρακολουθήσατε τη διαφήμιση και κερδίσατε +10 πόντους!');
    } catch (err) {
        if (err !== 'not_ready') {
            alert('Πρέπει να ολοκληρώσετε τη διαφήμιση για να πιστωθούν οι 10 πόντοι.');
        }
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
        localStream = await navigator.mediaDevices.getUserMedia({ video: constraint, audio: false });
        var videoPreview = document.getElementById('camera-preview');
        if (videoPreview) {
            videoPreview.srcObject = localStream;
            videoPreview.style.transform = currentFacingMode === 'user' ? 'scaleX(-1)' : 'none';
            videoPreview.style.background = 'none';
        }
        document.getElementById('scan-line').style.display = 'block';
        updateActionButtonsVisibility();
    } catch (e) {
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
            alert('Παρακαλώ δώστε δικαιώματα κάμερας ή κάντε Upload φωτογραφίας.');
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
    if (videoPreview) videoPreview.srcObject = null;
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
    if (analyzeBtn) {
        analyzeBtn.style.display = hasSource ? 'inline-flex' : 'none';
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
        ctx.save(); ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
    }
    return canvas.toDataURL('image/jpeg', 0.85);
}

// ===== ΡΟΗ ΕΚΤΕΛΕΣΗΣ ΑΝΤΙΚΕΙΜΕΝΙΚΗΣ ΑΝΑΛΥΣΗΣ =====
async function startAnalysisFlow() {
    var image = captureImage();
    if (!image) {
        alert('Παρακαλώ ανοίξτε την κάμερα ή κάντε upload μια φωτογραφία της παλάμης σας πρώτα!');
        return;
    }
    
    if (getUserPoints() < ANALYSIS_COST) {
        alert('Δεν έχεις αρκετούς πόντους! Χρειάζεσαι 15 πόντους. Παρακολούθησε μια διαφήμιση για να μαζέψεις!');
        return;
    }
    
    // Αφαίρεση των 15 πόντων για τη χρέωση της ανάλυσης
    addPoints(-ANALYSIS_COST);
    executeAnalysis(image);
}

async function executeAnalysis(imageBase64) {
    document.getElementById('loading-box').style.display = 'flex';
    document.getElementById('analyze-btn').style.display = 'none';
    
    var gender = document.getElementById('gender-select').value;
    var zodiac = document.getElementById('zodiac-select').value;
    var topic = document.getElementById('topic-select').value;
    
    var payload = {
        image: imageBase64,
        user_id: getCurrentUserId(),
        gender: gender,
        zodiac: zodiac,
        topic: topic,
        is_vip: true // Στέλνεται true ώστε το backend να τρέξει την πλήρη αντικειμενική ανάλυση
    };
    
    try {
        var response = await fetch('https://franklymadear-lifeline.hf.space/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        var data = await response.json();
        document.getElementById('loading-box').style.display = 'none';
        
        // Έλεγχος για τα κλειδιά "reading" ή "analysis" όπως επιστρέφονται από το app.py
        var readingText = data.reading || data.analysis;
        
        if (readingText) {
            showResultPopup(readingText);
            rewardReferrerIfFirstAnalysis();
        } else {
            alert('Η Aziram δεν κατάφερε να διαβάσει καθαρά. Οι πόντοι σου επιστρέφονται.');
            addPoints(ANALYSIS_COST);
        }
    } catch (error) {
        document.getElementById('loading-box').style.display = 'none';
        alert('Σφάλμα σύνδεσης με το σύμπαν της Aziram. Οι πόντοι σου επιστρέφονται.');
        addPoints(ANALYSIS_COST);
    } {
        updateActionButtonsVisibility();
        updatePointsDisplay();
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
    updatePointsDisplay();
}

// ===== MULTILANGUAGE SYSTEM =====
let currentLang = 'el';
function changeLanguage(lang) { currentLang = lang; }

// ===== ΣΥΣΤΗΜΑ ΠΡΟΣΚΛΗΣΗΣ (REFERRALS) =====
function detectReferral() {
    var urlParams = new URLSearchParams(window.location.search);
    var ref = urlParams.get('start');
    if (ref && ref.startsWith('ref_')) {
        localStorage.setItem('lifeline_incoming_referrer', ref);
    }
}

function getReferralLink() {
    var uid = getCurrentUserId();
    return 'https://t.me/lifeline2026_bot?start=ref_' + uid;
}

function shareViaTelegram() {
    var link = getReferralLink();
    var text = encodeURIComponent('🖐️ Η Aziram διαβάζει την παλάμη σου με AI! Μπες από το σύνδεσμό μου και πάρε 15 δωρεάν πόντους: ' + link);
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + text);
    } else {
        window.open('https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + text, '_blank');
    }
}

// Επιβράβευση: +15 για κάθε φίλο & +100 στους 15 φίλους
async function rewardReferrerIfFirstAnalysis() {
    var incomingRef = localStorage.getItem('lifeline_incoming_referrer');
    if (incomingRef) {
        // Προσομοίωση/Καταγραφή τοπικά αν δεν υπάρχει πλήρες backend endpoint, ή κλήση API:
        var currentRefs = parseInt(localStorage.getItem(REF_COUNT_KEY) || '0', 10);
        currentRefs++;
        localStorage.setItem(REF_COUNT_KEY, currentRefs.toString());
        
        // Προσθήκη 15 πόντων για τον νέο φίλο
        addPoints(15);
        
        // Αν φτάσει ακριβώς τους 15 φίλους, δίνει το μεγάλο bonus των 100 πόντων
        if (currentRefs === 15) {
            addPoints(100);
            alert('🎁 Φανταστικά! Προσκαλέσατε 15 φίλους και ξεκλειδώσατε το Μεγάλο Bonus των 100 πόντων!');
        }
        
        localStorage.removeItem('lifeline_incoming_referrer'); // Εξαργυρώθηκε
    }
}

function addInviteButton() {
    var bar = document.getElementById('rewards-bar');
    if (!bar || document.getElementById('invite-friends-btn')) return;
    
    var btn = document.createElement('button');
    btn.id = 'invite-friends-btn';
    btn.className = 'btn btn-purple';
    btn.style.padding = '4px 10px';
    btn.style.fontSize = '11px';
    btn.style.width = 'auto';
    btn.style.borderRadius = '8px';
    btn.innerText = '➕ Πρόσκληση';
    btn.onclick = shareViaTelegram;
    bar.appendChild(btn);
}

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    detectReferral();
    checkConsent();
    updatePointsDisplay();
    addInviteButton();
});

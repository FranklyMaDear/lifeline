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
        title: '📜 Όροι Χρήσης LiFe LiNe',
        sections: [
            { heading: '1. Όριο Ηλικίας (Αυστηρά 18+)', body: 'Η χρήση της εφαρμογής <strong>LiFe LiNe</strong> επιτρέπεται αποκλειστικά και μόνο σε άτομα που έχουν συμπληρώσει το 18ο έτος της ηλικίας τους (ενήλικες). Με την αποδοχή των όρων και την επιλογή του σχετικού πλαισίου, ο χρήστης δηλώνει υπεύθυνα ότι είναι ενήλικος. Οι διαχειριστές του LiFe LiNe δεν φέρουν καμία ευθύνη για ψευδείς δηλώσεις ηλικίας από πλευράς των επισκεπτών.' },
            { heading: '2. Ψυχαγωγικός Χαρακτήρας', body: 'Το LiFe LiNe είναι μια ψηφιακή εφαρμογή που χρησιμοποιεί αλγόριθμους τεχνητής νοημοσύνης (AI) για να αναλύει τα χαρακτηριστικά του χεριού του χρήστη (γραμμές, σχήματα) μέσω σάρωσης και να παράγει κείμενα βασισμένα σε ένα παραδοσιακό λεξικό συμβόλων. Η υπηρεσία παρέχεται αποκλειστικά και μόνο για σκοπούς χιούμορ, διασκέδασης και ψυχαγωγίας. Τα αποτελέσματα της ανάλυσης <strong>δεν αποτελούν σε καμία περίπτωση</strong> πραγματικές, επιστημονικές, ιατρικές, ψυχολογικές, νομικές ή χρηματοοικονομικές προβλέψεις και συμβουλές.' },
            { heading: '3. Περιορισμός Ευθύνης', body: 'Ο χρήστης συμφωνεί ότι χρησιμοποιεί την εφαρμογή με δική του αποκλειστική ευθύνη. Οι δημιουργοί, οι ιδιοκτήτες και οι συνεργάτες του LiFe LiNe δεν φέρουν καμία απολύτως αστική ή ποινική ευθύνη για οποιαδήποτε πράξη, απόφαση, απώλεια, ζημία (άμεση ή έμμεση) ή ψυχική αναστάτωση προκύψει από την ανάγνωση, την παρερμηνεία ή την εφαρμογή των χιουμοριστικών αποτελεσμάτων της χειρομαντείας στην πραγματική ζωή.' },
            { heading: '4. Πνευματική Ιδιοκτησία', body: 'Όλο το περιεχόμενο του ιστοτόπου (συμπεριλαμβανομένων των κειμένων, του λογότυπου, των γραφικών, των κωδίκων της εφαρμογής και του λεξικού συμβόλων) αποτελεί πνευματική ιδιοκτησία του LiFe LiNe και προστατεύεται από τις σχετικές διατάξεις του ελληνικού και ευρωπαϊκού δικαίου.' }
        ],
        footer: '📧 <strong>info.franklydear@gmail.com</strong>'
    },
    privacy: {
        title: '🔒 Πολιτική Απορρήτου LiFe LiNe',
        sections: [
            { heading: '1. Πώς Διαχειριζόμαστε τα Δεδομένα της Σάρωσης του Χεριού σας', body: '<strong>Δεν Αποθηκεύουμε τις Σαρώσεις:</strong> Όταν σκανάρετε το χέρι σας, η εικόνα μετατρέπεται σε προσωρινή μορφή κώδικα (Base64) στη συσκευή σας και στέλνεται στον server μας αποκλειστικά και μόνο για να μεταφερθεί στο Gemini API της Google για την οπτική ανάλυση. <strong>Καμία Μόνιμη Αποθήκευση:</strong> Οι σαρώσεις του χεριού σας ΔΕΝ αποθηκεύονται σε καμία βάση δεδομένων, ΔΕΝ κρατούνται στον server μας και διαγράφονται οριστικά από τη μνήμη αμέσως μόλις ολοκληρωθεί η ανάλυση.' },
            { heading: '2. Δεδομένα που Συλλέγουμε Αυτόματα (Cookies & Διαφημίσεις)', body: '• <strong>Cookies:</strong> Χρησιμοποιούμε cookies για να θυμόμαστε τις προτιμήσεις σας και για να αναλύουμε την επισκεψιμότητα (μέσω Google Analytics). • <strong>Διαφημίσεις Τρίτων (AdSense / Monetag):</strong> Οι διαφημιστές ενδέχεται να χρησιμοποιούν cookies για να προβάλλουν διαφημίσεις που σχετίζονται με τα ενδιαφέροντά σας. • <strong>Τοπική Αποθήκευση (Local Storage):</strong> Η εφαρμογή χρησιμοποιεί τοπική μνήμη στη συσκευή σας για να μετράει τις ημερήσιες προσπάθειές σας.' },
            { heading: '3. Δικαιώματα των Χρηστών (GDPR)', body: 'Σύμφωνα με τον ευρωπαϊκό νόμο, έχετε τα εξής δικαιώματα: • Το δικαίωμα να γνωρίζετε ποια δεδομένα σας επεξεργαζόμαστε. • Το δικαίωμα να διαγράψετε τα cookies και το ιστορικό του LiFe LiNe από τον browser σας ανά πάσα στιγμή.' },
            { heading: '4. Αλλαγές στους Όρους και την Πολιτική Απορρήτου', body: 'Το LiFe LiNe διατηρεί το δικαίωμα να αλλάξει ή να επικαιροποιήσει αυτούς τους όρους και την πολιτική απορρήτου οποιαδήποτε στιγμή, προκειμένου να συμμορφώνεται με νέους νόμους ή τεχνικές αναβαθμίσεις. Οι αλλαγές θα εμφανίζονται σε αυτή τη σελίδα.' }
        ],
        footer: '📧 <strong>info.franklydear@gmail.com</strong>'
    }
};

async function showTerms(type) {
    var modal = document.getElementById('terms-modal');
    var structure = TERMS_STRUCTURE[type];
    if (!structure) return;

    var html = `<h2 data-translate="true">${structure.title}</h2>`;
    structure.sections.forEach(function(sec) {
        html += `<h3 data-translate="true" style="margin-top:12px;color:var(--purple-gold);">${sec.heading}</h3>`;
        html += `<p data-translate="true" style="margin-bottom:8px;text-align:left;">${sec.body}</p>`;
    });
    html += `<p data-translate="true" style="text-align:center;margin-top:18px;">${structure.footer}</p>`;
    html += '<button id="close-terms-btn" class="btn btn-purple" onclick="closeTerms()" data-translate="true" style="margin-top:15px;">✕ Κλείσιμο</button>';

    modal.innerHTML = html;
    document.getElementById('terms-modal-overlay').style.display = 'flex';

    if (currentLang !== 'el' && typeof translatePage === 'function') {
        translatePage(currentLang);
    }
}

function closeTerms() {
    document.getElementById('terms-modal-overlay').style.display = 'none';
}

// ===== TELEGRAM INTEGRATION & POINTS =====
const POINTS_KEY = 'lifeline_user_points';
const VIP_COST = 5;

function getCurrentUserId() {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    var testId = localStorage.getItem('lifeline_test_user_id');
    if (!testId) {
        testId = 'test_' + Date.now();
        localStorage.setItem('lifeline_test_user_id', testId);
    }
    return testId;
}

function getUserPoints() { 
    return parseInt(localStorage.getItem(POINTS_KEY) || '15', 10); // 15 δωρεάν αρχικοί πόντοι
}

function addPoints(amount) { 
    localStorage.setItem(POINTS_KEY, (getUserPoints() + amount).toString()); 
    updatePointsDisplay(); 
}

function spendPoints(amount) { 
    var c = getUserPoints(); 
    if (c >= amount) { 
        localStorage.setItem(POINTS_KEY, (c - amount).toString()); 
        updatePointsDisplay(); 
        return true; 
    } 
    return false; 
}

function updatePointsDisplay() {
    var pts = getUserPoints();
    var display = document.getElementById('user-points-display');
    if (display) display.textContent = pts;
    
    var vipBtn = document.getElementById('analyze-vip-btn');
    if (vipBtn) {
        var vipCostEl = document.getElementById('vip-cost');
        var vipPointsEl = document.getElementById('vip-points');
        if (vipCostEl) vipCostEl.textContent = VIP_COST;
        if (vipPointsEl) vipPointsEl.textContent = pts;
        
        if (pts >= VIP_COST) {
            vipBtn.disabled = false;
            vipBtn.style.opacity = '1';
            vipBtn.style.boxShadow = '0 0 15px rgba(230, 126, 34, 0.4)';
        } else {
            vipBtn.disabled = true;
            vipBtn.style.opacity = '0.5';
            vipBtn.style.boxShadow = 'none';
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
        if (getUserPoints() < VIP_COST) {
            alert('Δεν έχεις αρκετούς πόντους. Χρειάζεσαι ' + VIP_COST + '.');
            return;
        }
        executeAnalysis(image, true);
    } else {
        document.getElementById('loading-box').style.display = 'flex';
        showRewardedAd()
            .then((result) => {
                addPoints(2); // Κέρδος 2 πόντων από τη διαφήμιση
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
    document.getElementById('analyze-btn').style.display = 'none';
    document.getElementById('analyze-vip-btn').style.display = 'none';
    
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
                spendPoints(VIP_COST); // Αφαίρεση πόντων VIP μόνο μετά από επιτυχία
            }
            showResultPopup(data.reading);
            rewardReferrerIfFirstAnalysis();
        } else {
            alert('Η Aziram συνάντησε εμπόδιο. Δοκίμασε ξανά.');
        }
    } catch (error) {
        document.getElementById('loading-box').style.display = 'none';
        console.error('Analysis API Error:', error);
        alert('Σφάλμα σύνδεσης. Δοκιμάστε ξανά.');
    } {
        document.getElementById('analyze-btn').style.display = 'inline-flex';
        document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
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
    addStarsToPopup();
}

function addStarsToPopup() {
    var popup = document.getElementById('result-popup');
    popup.querySelectorAll('.popup-star').forEach(function(s) { s.remove(); });
    var emojis = ['✨', '⭐', '💫', '🌟', '🔮', '💖', '🌙'];
    for (var i = 0; i < 15; i++) {
        var star = document.createElement('span');
        star.className = 'popup-star';
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.position = 'absolute';
        star.style.left = Math.random() * 85 + '%';
        star.style.top = Math.random() * 85 + '%';
        star.style.pointerEvents = 'none';
        popup.appendChild(star);
    }
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
                console.error('Translation error:', err);
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
const OFFICIAL_BOT_USERNAME = 'lifeline2026_bot';

function detectReferral() {
    var urlParams = new URLSearchParams(window.location.search);
    var startParam = urlParams.get('start');
    if (startParam) {
        localStorage.setItem('lifeline_referrer', startParam);
    }
}

function getReferralLink() {
    return 'https://t.me/' + OFFICIAL_BOT_USERNAME + '?start=' + getCurrentUserId();
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
    updatePointsDisplay();
    addInviteButton();
    detectReferral();
});

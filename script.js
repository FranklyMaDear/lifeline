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

// ===== CONSENT =====
function checkConsent() {
    var consent = localStorage.getItem('lifeline_consent');
    if (consent === 'true') {
        document.getElementById('consent-overlay').classList.add('hidden');
    } else {
        document.getElementById('consent-overlay').classList.remove('hidden');
    }
}

function acceptConsent() {
    localStorage.setItem('lifeline_consent', 'true');
    document.getElementById('consent-overlay').classList.add('hidden');
}

checkConsent();

// ===== ΜΕΤΑΦΡΑΣΗ =====
var originalTexts = {};
var currentLang = 'el';

function saveOriginalTexts() {
    document.querySelectorAll('[data-translate="true"]').forEach(function(element) {
        originalTexts[element.id || Math.random()] = element.innerText;
    });
}

function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    const supportedLangs = ['el', 'en', 'de', 'fr', 'es', 'it', 'ar', 'zh', 'ja', 'ru', 'tr', 'nl', 'pt', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'ro', 'bg', 'uk', 'ko', 'hi', 'vi', 'th', 'id', 'iw'];
    
    if (supportedLangs.includes(langCode) && langCode !== 'el') {
        document.getElementById('language-select').value = langCode;
        currentLang = langCode;
        startTranslation();
    }
}

function startTranslation() {
    const selectElement = document.getElementById('language-select');
    const selectedLang = selectElement.value;
    const translateBtn = document.getElementById('translate-btn');
    const resetBtn = document.getElementById('reset-lang-btn');
    
    if (selectedLang === 'el') {
        resetToGreek();
        return;
    }
    
    translateBtn.classList.add('translating');
    translateBtn.disabled = true;
    
    const elementsToTranslate = document.querySelectorAll('[data-translate="true"]');
    const textsToTranslate = Array.from(elementsToTranslate).map(el => el.innerText).filter(text => text.trim() !== '');
    
    if (textsToTranslate.length === 0) {
        console.warn('No texts to translate');
        translateBtn.classList.remove('translating');
        translateBtn.disabled = false;
        return;
    }
    
    const requestBody = {
        q: textsToTranslate.join('\n|||SPLIT|||\n'),
        source_language: 'el',
        target_language: selectedLang
    };
    
    fetch('https://api.mymemory.translated.net/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        const translatedTexts = data.responseData.translatedText.split('\n|||SPLIT|||\n');
        let index = 0;
        
        elementsToTranslate.forEach(element => {
            if (element.innerText.trim() !== '') {
                if (index < translatedTexts.length) {
                    element.innerText = translatedTexts[index];
                    index++;
                }
            }
        });
        
        currentLang = selectedLang;
        resetBtn.style.display = 'flex';
        translateBtn.classList.remove('translating');
        translateBtn.disabled = false;
        updatePointsDisplay();
        console.log('✅ Translation completed for:', selectedLang);
    })
    .catch(error => {
        console.error('❌ Translation error:', error);
        translateBtn.classList.remove('translating');
        translateBtn.disabled = false;
        alert('Σφάλμα κατά τη μετάφραση. Δοκίμασε ξανά.');
    });
}

function resetToGreek() {
    document.getElementById('language-select').value = 'el';
    document.querySelectorAll('[data-translate="true"]').forEach(function(element) {
        const key = element.id || Array.from(document.querySelectorAll('[data-translate="true"]')).indexOf(element);
        if (originalTexts[key]) {
            element.innerText = originalTexts[key];
        }
    });
    currentLang = 'el';
    document.getElementById('reset-lang-btn').style.display = 'none';
    updatePointsDisplay();
    console.log('✅ Reset to Greek');
}

saveOriginalTexts();
detectLanguage();

// ===== NAVIGATION =====
function goToScan() {
    document.getElementById('splash-page').classList.remove('active');
    document.getElementById('scan-page').classList.add('active');
}

function goToSplash() {
    document.getElementById('scan-page').classList.remove('active');
    document.getElementById('splash-page').classList.add('active');
}

// ===== SELECTORS & PREFERENCES =====
var userPreferences = {
    gender: 'male',
    birthdate: '',
    topic: 'Έρωτας & Σχέσεις'
};

function setGender(gender) {
    userPreferences.gender = gender;
    document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
    if (gender === 'male') {
        document.getElementById('maleBtn').classList.add('active');
    } else {
        document.getElementById('femaleBtn').classList.add('active');
    }
}

function setBirthdate(date) {
    userPreferences.birthdate = date;
}

function selectTopic(topic) {
    userPreferences.topic = topic;
}

// ===== POINTS & REWARDS SYSTEM =====
var userPoints = parseInt(localStorage.getItem('lifeline_points')) || 0;

function updatePointsDisplay() {
    const pointsBadge = document.getElementById('points-display');
    if (pointsBadge) {
        pointsBadge.innerText = userPoints;
    }
    
    const vipBtn = document.getElementById('analyze-vip-btn');
    if (vipBtn) {
        if (userPoints >= 5) {
            vipBtn.disabled = false;
        } else {
            vipBtn.disabled = true;
        }
    }
    
    updateVipButtonText();
}

function updateVipButtonText() {
    const vipBtn = document.getElementById('analyze-vip-btn');
    if (vipBtn) {
        const span = vipBtn.querySelector('span');
        if (span) {
            if (currentLang === 'el') {
                span.innerText = '⚡ VIP';
            } else {
                // Μετάφραση για άλλες γλώσσες (θα γίνει αυτόματα με τη μεταφορά)
            }
        }
    }
}

function earnPoints() {
    showRewardedAd()
        .then(() => {
            userPoints += 1;
            localStorage.setItem('lifeline_points', userPoints);
            updatePointsDisplay();
            alert('🎉 Κέρδισες 1 Πόντο!');
        })
        .catch(() => {
            console.log('Ad not shown or skipped');
        });
}

updatePointsDisplay();

// ===== CAMERA & IMAGE UPLOAD =====
var currentStream = null;
var cameraActive = false;
var currentFacingMode = 'user';

async function startCamera() {
    const webcamElement = document.getElementById('webcam');
    const cameraBtn = document.getElementById('camera-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const analyzeVipBtn = document.getElementById('analyze-vip-btn');
    
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode }
        });
        webcamElement.srcObject = currentStream;
        cameraActive = true;
        
        cameraBtn.innerText = '📷 Σώσε Φωτογραφία';
        analyzeBtn.style.display = 'inline-flex';
        analyzeVipBtn.style.display = 'inline-flex';
        
        const buttons = document.querySelectorAll('.camera-toggle-btn');
        buttons.forEach(btn => btn.style.display = 'inline-flex');
        
        updateCameraToggleButtons();
    } catch (error) {
        console.error('Camera error:', error);
        alert('Δεν μπορώ να ενεργοποιήσω την κάμερα. Δοκίμασε με Upload αντί αυτού.');
    }
}

function switchCamera(facingMode) {
    currentFacingMode = facingMode;
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    startCamera();
}

function updateCameraToggleButtons() {
    const selfieBtn = document.getElementById('selfie-btn');
    const backBtn = document.getElementById('back-btn');
    
    if (currentFacingMode === 'user') {
        selfieBtn.classList.add('active');
        backBtn.classList.remove('active');
    } else {
        selfieBtn.classList.remove('active');
        backBtn.classList.add('active');
    }
}

function savePhoto() {
    const canvas = document.getElementById('overlay-canvas');
    const webcam = document.getElementById('webcam');
    
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(webcam, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    localStorage.setItem('lifeline_photo', imageData);
    
    document.getElementById('upload-preview-img').src = imageData;
    document.getElementById('upload-preview-area').style.display = 'block';
    
    stopCamera();
}

function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        cameraActive = false;
    }
    
    const cameraBtn = document.getElementById('camera-btn');
    cameraBtn.innerText = '📷 Έναρξη';
    
    const buttons = document.querySelectorAll('.camera-toggle-btn');
    buttons.forEach(btn => btn.style.display = 'none');
}

document.getElementById('camera-btn').addEventListener('click', function() {
    if (cameraActive) {
        savePhoto();
    } else {
        startCamera();
    }
});

function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        localStorage.setItem('lifeline_photo', imageData);
        
        document.getElementById('upload-preview-img').src = imageData;
        document.getElementById('upload-preview-area').style.display = 'block';
        
        document.getElementById('analyze-btn').style.display = 'inline-flex';
        document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
        
        stopCamera();
    };
    reader.readAsDataURL(file);
}

// ===== ANALYSIS & AI GENERATION =====
function startAnalysisFlow(isVIP) {
    const photo = localStorage.getItem('lifeline_photo');
    if (!photo) {
        alert('Παρακαλώ πάρε μια φωτογραφία ή κάνε upload πρώτα.');
        return;
    }
    
    if (isVIP && userPoints < 5) {
        alert('Δεν έχεις αρκετούς πόντους για VIP ανάλυση. Κέρδησε περισσότερους πόντους!');
        return;
    }
    
    document.getElementById('loading-box').style.display = 'block';
    
    if (isVIP) {
        userPoints -= 5;
        localStorage.setItem('lifeline_points', userPoints);
        updatePointsDisplay();
    }
    
    setTimeout(() => {
        generateAnalysis(photo, isVIP);
    }, 2000);
}

function generateAnalysis(photoData, isVIP) {
    const analysisType = userPreferences.topic;
    const gender = userPreferences.gender === 'male' ? 'άντρας' : 'γυναίκα';
    const vipLabel = isVIP ? ' (VIP Ανάλυση)' : '';
    
    const analysis = `
☽ ΠΡΩΤΗ ΑΝΆΓΝΩΣΗ ΓΡΑΜΜΩΝ${vipLabel}

📊 Ανάλυση Θέματος: ${analysisType}
👤 Φύλο: ${gender}
🎯 Βάθος Ανάλυσης: ${isVIP ? 'Εξειδικευμένη' : 'Βασική'}

═══════════════════════════════════════

🔮 ΔΙΑΚΡΊΣΙΜΑ ΣΗΜΆΔΙΑ:

1️⃣ Γραμμή Ζωής (Life Line)
   • Μήκος: Εξαιρετικό
   • Σαφήνεια: Πολύ σαφής
   • Ερμηνεία: Δύναμη, ζωτικότητα και μακρά περίοδος ενεργού ζωής
   • ${isVIP ? 'Σχόλιο VIP: Ο χειριστής δείχνει εξαιρετική ικανότητα ανάνηψης μετά από δύσκολες περιόδους.' : ''}

2️⃣ Γραμμή Καρδιάς (Heart Line)
   • Σχήμα: Ημικυκλικό, ευαίσθητο
   • Χρώμα: Ροδόχρουν
   • Ερμηνεία: Συναισθηματική ζυμωτή και αναζήτηση πραγματικής σύνδεσης
   • ${isVIP ? 'Σχόλιο VIP: Ιδιαίτερη ευαισθησία απέναντι στις ανάγκες του περιβάλλοντος χώρου.' : ''}

3️⃣ Γραμμή Νου (Head Line)
   • Μήκος: Μακρά και σταθερή
   • Καμπύλη: Εξισορροπημένη
   • Ερμηνεία: Δυνατή λογική, δημιουργικότητα και εξισορρόπηση συναισθήματος
   • ${isVIP ? 'Σχόλιο VIP: Ειδική ικανότητα για δημιουργικές λύσεις σε προκλητικές καταστάσεις.' : ''}

4️⃣ Γραμμή Μοίρας (Fate Line)
   • Παρουσία: Εμφανής και δυνατή
   • Κατεύθυνση: Προς τα πάνω
   • Ερμηνεία: Σημαντικές προσωπικές αποφάσεις και σύνδεση με ψυχικό σκοπό
   • ${isVIP ? 'Σχόλιο VIP: Διακρίνεται μια περίοδος μεγάλων αλλαγών και εξέλιξης που πλησιάζει.' : ''}

═══════════════════════════════════════

🎯 ΕΡΜΗΝΕΊΑ ΘΈΜΑΤΟΣ: ${analysisType}

${interpretTopicAnalysis(analysisType, isVIP)}

═══════════════════════════════════════

💫 ΠΡΟΒΛΈΨΕΙΣ & ΚΟΣΜΙΚΆ ΣΗΜΆΔΙΑ:

✨ Κύκλος Ενέργειας: Δυναμικός και ανοδικός
🌙 Φάση Φεγγαριού: Ευνοϊκή για νέες αρχές
⭐ Αστρικές Επιδράσεις: Ευθετικές αλλαγές στη ζωή σας

═══════════════════════════════════════

${isVIP ? '🔐 VIP ΑΠΟΚΆΛΥΨΗ: Χειρολογικά μεσαλωτικά στοιχεία\n\nΣε βαθύτερο επίπεδο, παρατηρούμε ακόμα:\n• Κρυμμένα δυναμικά που ενεργοποιούνται κάτω από πίεση\n• Ευκαιρίες που θα εμφανιστούν τις επόμενες 3-6 μήνες\n• Σύμβουλες από τα κοσμικά δυναμικά για βέλτιστες ενέργειες' : ''}

═══════════════════════════════════════

🙏 Η Aziram ευχαριστεί για την εμπιστοσύνη σας.
Ο μύστης του χεριού σας έχει ομιληθεί.

✦ ΣΚΑΝΆΡΙΣΕ ΞΑΝΆ ΓΙΑ ΝΕΑ ΑΠΟΚΆΛΥΨΗ ✦
    `;
    
    localStorage.setItem('lifeline_analysis', analysis);
    showResultPopup(analysis);
}

function interpretTopicAnalysis(topic, isVIP) {
    const interpretations = {
        'Έρωτας & Σχέσεις': `
❤️ Έρωτας & Σχέσεις

Οι γραμμές του χεριού σας δείχνουν ότι είστε κάποιος με βαθειά συναισθηματική ικανότητα.
• Στο άμεσο μέλλον: Βολικές ευκαιρίες για μια σημαντική σύνδεση
• Δεύτερη φάση: Σταθερή ανάπτυξη σχέσης με ωριμότητα
${isVIP ? '• Κρυμμένη αλήθεια: Ο πραγματικός σας δίδυμος ψυχής ήδη κοντά - κοιτάξτε προσεκτικά' : ''}
• Συμβουλή: Ακούστε τη σκέπιν της καρδιάς σας, αλλά κρατήστε τη λογική
        `,
        'Καριέρα & Οικονομικά': `
💼 Καριέρα & Οικονομικά

Οι χειρολογικές γραμμές σας υποδηλώνουν έναν επιχειρηματικό χαρακτήρα με δυνατή προσδιοριστή θέληση.
• Εργασία: Σημαντικές προοπτικές εξέλιξης στα επόμενα 12 μήνες
• Χρήματα: Ευνοϊκή περίοδος για επενδύσεις και νέα έργα
${isVIP ? '• Κρυμμένη ευκαιρία: Μια συνεργασία που θα σας αλλάξει τη ζωή πλησιάζει' : ''}
• Συμβουλή: Δεν είναι στιγμή υπομονής - δράστε τώρα
        `,
        'Υγεία & Ζωτικότητα': `
🌱 Υγεία & Ζωτικότητα

Οι χειρολογικές σας γραμμές δείχνουν ένα δυνατό ενεργειακό πεδίο και ένα σώμα που ζητάει κίνηση.
• Ενέργεια: Υψηλή και σταθερή σε όλες τις περιόδους
• Ζωτικότητα: Βαθιές εσωτερικές πηγές δύναμης
${isVIP ? '• Κρυμμένη αναγκαιότητα: Σωματική καθαρότητα και απαγκιστρώνιση από κόπωση θα σας ανανεώσει' : ''}
• Συμβουλή: Προσέξτε τη διατροφή και τον ύπνο - είναι κλειδιά για εσάς
        `,
        'Κρυφά Ταλέντα & Προσωπικότητα': `
🧠 Κρυφά Ταλέντα & Προσωπικότητα

Οι γραμμές του χεριού σας αποκαλύπτουν ένα κρυμμένο ταλέντο που ήδη σας περιμένει.
• Ταλέντο: Δημιουργικότητα και έξυπνη παρατηρητικότητα
• Ικανότητα: Ικανότητα να δείτε τα πράγματα που άλλοι δεν βλέπουν
${isVIP ? '• Κρυμμένο Δώρο: Η ικανότητά σας να κατανοήσετε τα ανθρώπινα συναισθήματα είναι σχεδόν υπερφυσική' : ''}
• Συμβουλή: Σημειώστε τα όνειρά σας - περιέχουν μηνύματα
        `,
        'Κάρμα & Μελλοντικές Προκλήσεις': `
🌀 Κάρμα & Μελλοντικές Προκλήσεις

Οι γραμμές του χεριού σας φανερώνουν μια περίοδο δοκιμασίας και μετασχηματισμού που πλησιάζει.
• Κάρμα: Θετικό - τα πλήρη σας αποδίδονται
• Πρόκληση: Μια μεγάλη αλλαγή που θα δοκιμάσει τη θέληση σας
${isVIP ? '• Κρυμμένη Σοφία: Η πρόκληση που έρχεται είναι ουσιαστικά ένα δώρο που θα σας ενδυναμώσει' : ''}
• Συμβουλή: Μην φοβηθείτε τη σκιά - σε εκείνη βρίσκεται ο σκοπός
        `
    };
    
    return interpretations[topic] || 'Ανάλυση θέματος δεν διαθέσιμη';
}

function showResultPopup(analysisText) {
    document.getElementById('loading-box').style.display = 'none';
    document.getElementById('result-popup-text').innerText = analysisText;
    document.getElementById('result-popup-overlay').classList.add('active');
    
    addFloatingStars();
}

function addFloatingStars() {
    const popup = document.getElementById('result-popup');
    for (let i = 0; i < 8; i++) {
        const star = document.createElement('div');
        star.className = 'popup-star';
        star.innerText = '✨';
        star.style.left = Math.random() * 80 + 10 + '%';
        star.style.top = Math.random() * 60 + 10 + '%';
        star.style.animationDelay = Math.random() * 1 + 's';
        popup.appendChild(star);
    }
}

function closeResultPopup() {
    document.getElementById('result-popup-overlay').classList.remove('active');
    document.querySelectorAll('.popup-star').forEach(star => star.remove());
    document.getElementById('upload-preview-area').style.display = 'none';
    localStorage.removeItem('lifeline_photo');
}

// ===== STARFIELD ANIMATION =====
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            opacity: Math.random() * 0.5 + 0.3,
            speed: Math.random() * 0.5 + 0.1
        });
    }
    
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFD700';
        
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            
            star.opacity += (Math.random() - 0.5) * 0.02;
            if (star.opacity < 0.3) star.opacity = 0.3;
            if (star.opacity > 0.8) star.opacity = 0.8;
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawStars);
    }
    
    drawStars();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

initStarfield();

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    updatePointsDisplay();
    updateVipButtonText();
});
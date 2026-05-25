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

// ===== CONSENT - ΕΜΦΑΝΙΖΕΤΑΙ ΚΑΘΕ ΦΟΡΑ =====
function checkConsent() {
    // Το consent εμφανίζεται ΠΑΝΤΑ κατά την είσοδο
    document.getElementById('consent-overlay').classList.remove('hidden');
}

function acceptConsent() {
    localStorage.setItem('lifeline_consent', 'true');
    document.getElementById('consent-overlay').classList.add('hidden');
}

// Εμφάνιση του consent αμέσως μόλις φορτώσει η σελίδα
checkConsent();

// ===== TERMS & PRIVACY - ΠΛΗΡΕΙΣ ΟΡΟΙ =====
const TERMS_TEXT = {
    terms: `<h2>📜 Όροι Χρήσης LiFe LiNe</h2>

<h3>1. Όριο Ηλικίας (Αυστηρά 18+)</h3>
<p>Η χρήση της εφαρμογής <strong>LiFe LiNe</strong> επιτρέπεται αποκλειστικά και μόνο σε άτομα που έχουν συμπληρώσει το 18ο έτος της ηλικίας τους (ενήλικες).</p>
<p>Με την αποδοχή των όρων και την επιλογή του σχετικού πλαισίου, ο χρήστης δηλώνει υπεύθυνα ότι είναι ενήλικος.</p>
<p>Οι διαχειριστές του LiFe LiNe δεν φέρουν καμία ευθύνη για ψευδείς δηλώσεις ηλικίας από πλευράς των επισκεπτών.</p>

<h3>2. Ψυχαγωγικός, Μη Κατευθυντικός και Χιουμοριστικός Χαρακτήρας</h3>
<p>Το LiFe LiNe είναι μια ψηφιακή εφαρμογή που χρησιμοποιεί αλγόριθμους τεχνητής νοημοσύνης (AI) για να αναλύει τα χαρακτηριστικά του χεριού του χρήστη (γραμμές, σχήματα) μέσω σάρωσης και να παράγει κείμενα βασισμένα σε ένα παραδοσιακό λεξικό συμβόλων.</p>
<p>Η υπηρεσία παρέχεται αποκλειστικά και μόνο για σκοπούς χιούμορ, διασκέδασης και ψυχαγωγίας.</p>
<p>Τα αποτελέσματα της ανάλυσης <strong>δεν αποτελούν σε καμία περίπτωση</strong> πραγματικές, επιστημονικές, ιατρικές, ψυχολογικές, νομικές ή χρηματοοικονομικές προβλέψεις και συμβουλές.</p>
<p>Οι παραγόμενες απαντήσεις δεν έχουν σκοπό, πρόθεση ή ικανότητα να καθοδηγήσουν, να επηρεάσουν ή να κατευθύνουν τις αποφάσεις, τις πράξεις, την προσωπική ή την επαγγελματική ζωή των χρηστών.</p>

<h3>3. Περιορισμός Ευθύνης (Disclaimer)</h3>
<p>Ο χρήστης συμφωνεί ότι χρησιμοποιεί την εφαρμογή με δική του αποκλειστική ευθύνη.</p>
<p>Οι δημιουργοί, οι ιδιοκτήτες και οι συνεργάτες του LiFe LiNe δεν φέρουν καμία απολύτως αστική ή ποινική ευθύνη για οποιαδήποτε πράξη, απόφαση, απώλεια, ζημία (άμεση ή έμμεση) ή ψυχική αναστάτωση προκύψει από την ανάγνωση, την παρερμηνεία ή την εφαρμογή των χιουμοριστικών αποτελεσμάτων της χειρομαντείας στην πραγματική ζωή.</p>

<h3>4. Πνευματική Ιδιοκτησία</h3>
<p>Όλο το περιεχόμενο του ιστοτόπου (συμπεριλαμβανομένων των κειμένων, του λογότυπου, των γραφικών, των κωδίκων της εφαρμογής και του λεξικού συμβόλων) αποτελεί πνευματική ιδιοκτησία του LiFe LiNe και προστατεύεται από τις σχετικές διατάξεις του ελληνικού και ευρωπαϊκού δικαίου.</p>
<p>Απαγορεύεται αυστηρά η αντιγραφή, αναπαραγωγή, αναδημοσίευση ή εμπορική εκμετάλλευση μέρους ή του συνόλου του κώδικα και των κειμένων χωρίς την έγγραφη άδεια των ιδιοκτητών.</p>

<p style="text-align:center;margin-top:18px;">📧 <strong>info.franklydear@gmail.com</strong></p>
<p style="text-align:center;font-size:0.75rem;color:#c9a0dc;">Τελευταία ενημέρωση: Μάιος 2026</p>`,

    privacy: `<h2>🔒 Πολιτική Απορρήτου LiFe LiNe</h2>
<p>Στο <strong>LiFe LiNe</strong>, η ιδιωτικότητα και η ασφάλεια των δεδομένων σας είναι η απόλυτη προτεραιότητά μας. Η παρούσα πολιτική εξηγεί πώς διαχειριζόμαστε τις πληροφορίες σας σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων της ΕΕ (<strong>GDPR</strong>).</p>

<h3>1. Πώς Διαχειριζόμαστε τα Δεδομένα της Σάρωσης του Χεριού σας</h3>
<p><strong>Δεν Αποθηκεύουμε τις Σαρώσεις:</strong> Όταν σκανάρετε το χέρι σας, η εικόνα μετατρέπεται σε προσωρινή μορφή κώδικα (Base64) στη συσκευή σας και στέλνεται στον server μας αποκλειστικά και μόνο για να μεταφερθεί στο Gemini API της Google για την οπτική ανάλυση.</p>
<p><strong>Καμία Μόνιμη Αποθήκευση:</strong> Οι σαρώσεις του χεριού σας ΔΕΝ αποθηκεύονται σε καμία βάση δεδομένων, ΔΕΝ κρατούνται στον server μας και διαγράφονται οριστικά από τη μνήμη αμέσως μόλις ολοκληρωθεί η ανάλυση (συνήθως μέσα σε ελάχιστα δευτερόλεπτα).</p>
<p>Δεν χρησιμοποιούμε τις σαρώσεις για διαφημιστικούς σκοπούς, ούτε τις μοιραζόμαστε με τρίτους, εκτός από την ασφαλή, αυτοματοποιημένη αποστολή στο API της Google για την παραγωγή της περιγραφής.</p>

<h3>2. Δεδομένα που Συλλέγουμε Αυτόματα (Cookies & Διαφημίσεις)</h3>
<p>Για τη σωστή λειτουργία της ιστοσελίδας και τη χρηματοδότησή της, συνεργαζόμαστε με τρίτες διαφημιστικές εταιρείες (όπως η Google AdSense και η Monetag). Αυτές οι εταιρείες ενδέχεται να συλλέγουν ανώνυμα τεχνικά δεδομένα:</p>
<p>• <strong>Cookies:</strong> Χρησιμοποιούμε cookies για να θυμόμαστε τις προτιμήσεις σας (π.χ. αν έχετε πατήσει το checkbox ηλικίας) και για να αναλύουμε την επισκεψιμότητα (μέσω Google Analytics).</p>
<p>• <strong>Διαφημίσεις Τρίτων (AdSense / Monetag):</strong> Οι διαφημιστές ενδέχεται να χρησιμοποιούν cookies για να προβάλλουν διαφημίσεις που σχετίζονται με τα ενδιαφέροντά σας. Μπορείτε να απενεργοποιήσετε τα εξατομικευμένα cookies μέσα από τις ρυθμίσεις του προγράμματος περιήγησής σας (browser).</p>
<p>• <strong>Τοπική Αποθήκευση (Local Storage):</strong> Η εφαρμογή χρησιμοποιεί τοπική μνήμη στη συσκευή σας για να μετράει τις ημερήσιες προσπάθειές σας, ώστε να τηρούνται τα όρια χρήσης χωρίς να χρειάζεται να κάνετε εγγραφή (login).</p>

<h3>3. Δικαιώματα των Χρηστών (GDPR)</h3>
<p>Σύμφωνα με τον ευρωπαϊκό νόμο, έχετε τα εξής δικαιώματα:</p>
<p>• Το δικαίωμα να γνωρίζετε ποια δεδομένα σας επεξεργαζόμαστε (όπως εξηγείται στην παρούσα πολιτική, δεν κρατάμε προσωπικά σας στοιχεία ή σαρώσεις χεριών).</p>
<p>• Το δικαίωμα να διαγράψετε τα cookies και το ιστορικό του LiFe LiNe από τον browser σας ανά πάσα στιγμή.</p>

<h3>4. Αλλαγές στους Όρους και την Πολιτική Απορρήτου</h3>
<p>Το LiFe LiNe διατηρεί το δικαίωμα να αλλάξει ή να επικαιροποιήσει αυτούς τους όρους και την πολιτική απορρήτου οποιαδήποτε στιγμή, προκειμένου να συμμορφώνεται με νέους νόμους ή τεχνικές αναβαθμίσεις. Οι αλλαγές θα εμφανίζονται σε αυτή τη σελίδα.</p>

<p style="text-align:center;margin-top:18px;">📧 <strong>info.franklydear@gmail.com</strong></p>
<p style="text-align:center;font-size:0.75rem;color:#c9a0dc;">Τελευταία ενημέρωση: Μάιος 2026</p>`
};

function showTerms(type) {
    var modal = document.getElementById('terms-modal');
    modal.innerHTML = (type === 'terms' ? TERMS_TEXT.terms : TERMS_TEXT.privacy)
        + '<button id="close-terms-btn" onclick="closeTerms()" data-translate="true">✕ Κλείσιμο</button>';
    document.getElementById('terms-modal-overlay').classList.add('active');
}

function closeTerms() {
    document.getElementById('terms-modal-overlay').classList.remove('active');
}

document.getElementById('terms-modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeTerms();
});

// ===== ΜΕΤΑΦΡΑΣΗ =====
var originalTexts = {};
var currentLang = 'el';
var translationsCache = {};

function saveOriginalTexts() {
    document.querySelectorAll('[data-translate="true"]').forEach(function(el) {
        var key = el.outerHTML;
        if (!originalTexts[key]) {
            originalTexts[key] = el.textContent.trim();
        }
    });
}
saveOriginalTexts();

function updateLangLabel() {
    var labelMap = {
        'el': '🌐 Γλώσσα', 'en': '🌐 Language', 'de': '🌐 Sprache', 'fr': '🌐 Langue',
        'es': '🌐 Idioma', 'it': '🌐 Lingua', 'ar': '🌐 اللغة', 'zh-CN': '🌐 语言',
        'ja': '🌐 言語', 'ru': '🌐 Язык', 'tr': '🌐 Dil', 'nl': '🌐 Taal',
        'pt': '🌐 Idioma', 'sv': '🌐 Språk', 'no': '🌐 Språk', 'da': '🌐 Sprog',
        'fi': '🌐 Kieli', 'pl': '🌐 Język', 'cs': '🌐 Jazyk', 'ro': '🌐 Limbă',
        'bg': '🌐 Език', 'uk': '🌐 Мова', 'ko': '🌐 언어', 'hi': '🌐 भाषा',
        'vi': '🌐 Ngôn ngữ', 'th': '🌐 ภาษา', 'id': '🌐 Bahasa', 'iw': '🌐 שפה'
    };
    var label = document.getElementById('lang-label');
    if (label) label.textContent = labelMap[currentLang] || '🌐 Language';
}

function startTranslation() {
    var lang = document.getElementById('language-select').value;
    if (lang === 'el') {
        restoreOriginalTexts();
        currentLang = 'el';
        document.getElementById('reset-lang-btn').style.display = 'none';
        updateLangLabel();
        updatePointsDisplay();
        return;
    }
    var btn = document.getElementById('translate-btn');
    btn.classList.add('translating');
    btn.textContent = '⟳';
    btn.disabled = true;
    translatePage(lang);
}

async function translatePage(targetLang) {
    var elements = document.querySelectorAll('[data-translate="true"]');
    var textsToTranslate = [];
    var elementsToUpdate = [];
    elements.forEach(function(el) {
        var text = el.textContent.trim();
        if (text.length > 0 && text.length < 500) {
            textsToTranslate.push(text);
            elementsToUpdate.push(el);
        }
    });
    if (textsToTranslate.length === 0) {
        finishTranslation();
        return;
    }
    var batchSize = 10;
    for (var i = 0; i < textsToTranslate.length; i += batchSize) {
        var batch = textsToTranslate.slice(i, i + batchSize);
        var batchElements = elementsToUpdate.slice(i, i + batchSize);
        try {
            var translatedTexts = await translateBatch(batch, targetLang);
            for (var j = 0; j < batchElements.length; j++) {
                if (translatedTexts[j]) batchElements[j].textContent = translatedTexts[j];
            }
        } catch (e) { console.log('Translation error:', e); }
    }
    currentLang = targetLang;
    finishTranslation();
    updateLangLabel();
    updatePointsDisplay();
}

function finishTranslation() {
    var btn = document.getElementById('translate-btn');
    btn.classList.remove('translating');
    btn.textContent = '▶';
    btn.disabled = false;
    document.getElementById('reset-lang-btn').style.display = 'flex';
}

async function translateBatch(texts, targetLang) {
    var cacheKey = targetLang + '|||' + texts.join('|||');
    if (translationsCache[cacheKey]) return translationsCache[cacheKey].split('|||');
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=el&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(texts.join('|||'));
    var response = await fetch(url);
    var data = await response.json();
    var translatedText = '';
    if (data && data[0]) {
        for (var i = 0; i < data[0].length; i++) { if (data[0][i][0]) translatedText += data[0][i][0]; }
    }
    var translations = translatedText.split('|||');
    translationsCache[cacheKey] = translations.join('|||');
    return translations;
}

function restoreOriginalTexts() {
    document.querySelectorAll('[data-translate="true"]').forEach(function(el) {
        var key = el.outerHTML;
        if (originalTexts[key]) el.textContent = originalTexts[key];
    });
}

function resetToGreek() {
    restoreOriginalTexts();
    currentLang = 'el';
    document.getElementById('language-select').value = 'el';
    document.getElementById('reset-lang-btn').style.display = 'none';
    updateLangLabel();
    updatePointsDisplay();
}

function detectLanguage() {
    var userLang = (navigator.language || navigator.userLanguage).split('-')[0];
    var langMap = {
        'el':'el','en':'en','de':'de','fr':'fr','es':'es','it':'it','ar':'ar','zh':'zh-CN',
        'ja':'ja','ru':'ru','tr':'tr','nl':'nl','pt':'pt','sv':'sv','no':'no','da':'da',
        'fi':'fi','pl':'pl','cs':'cs','ro':'ro','bg':'bg','uk':'uk','ko':'ko','hi':'hi',
        'vi':'vi','th':'th','id':'id','he':'iw','iw':'iw'
    };
    var mapped = langMap[userLang] || 'el';
    document.getElementById('language-select').value = mapped;
    currentLang = mapped;
    updateLangLabel();
    if (mapped !== 'el') { setTimeout(function() { startTranslation(); }, 1000); }
}
detectLanguage();

// ===== STARFIELD =====
var starCanvas = document.getElementById('starfield');
var starCtx = starCanvas.getContext('2d');
var stars = [];
function resizeStarfield() { starCanvas.width = window.innerWidth; starCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeStarfield);
resizeStarfield();
function createStars(count) {
    count = count || 150;
    stars = [];
    for (var i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * starCanvas.width, y: Math.random() * starCanvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.8 + 0.2,
            color: Math.random() > 0.7 ? '#FFD700' : '#c9a0dc'
        });
    }
}
createStars();
function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(function(s) {
        s.x += s.dx; s.y += s.dy;
        if (s.x < 0 || s.x > starCanvas.width) s.dx *= -1;
        if (s.y < 0 || s.y > starCanvas.height) s.dy *= -1;
        starCtx.beginPath();
        starCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        var rgb = s.color === '#FFD700' ? '255,215,0' : '201,160,220';
        starCtx.fillStyle = 'rgba(' + rgb + ', ' + (s.alpha * 0.6) + ')';
        starCtx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// ===== NAVIGATION =====
function goToScan() {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('scan-page').classList.add('active');
    updatePointsDisplay();
    if (capturedImage || currentStream) {
        document.getElementById('analyze-btn').style.display = 'inline-flex';
        document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
    }
}

function goToSplash() {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('splash-page').classList.add('active');
    stopCamera();
    resetScan();
}

// ===== USER PREFERENCES =====
var userGender = 'male';
var userZodiac = 'Κριός';
var userBirthdate = '';
var userTopic = 'Έρωτας & Σχέσεις';

function setGender(gender) {
    userGender = gender;
    document.getElementById('maleBtn').classList.toggle('active', gender === 'male');
    document.getElementById('femaleBtn').classList.toggle('active', gender === 'female');
}

function setBirthdate(date) {
    userBirthdate = date;
    if (date) {
        var dt = new Date(date);
        var day = dt.getDate();
        var m = dt.getMonth() + 1;
        if ((m===3&&day>=21)||(m===4&&day<=19)) userZodiac='Κριός';
        else if ((m===4&&day>=20)||(m===5&&day<=20)) userZodiac='Ταύρος';
        else if ((m===5&&day>=21)||(m===6&&day<=20)) userZodiac='Δίδυμοι';
        else if ((m===6&&day>=21)||(m===7&&day<=22)) userZodiac='Καρκίνος';
        else if ((m===7&&day>=23)||(m===8&&day<=22)) userZodiac='Λέων';
        else if ((m===8&&day>=23)||(m===9&&day<=22)) userZodiac='Παρθένος';
        else if ((m===9&&day>=23)||(m===10&&day<=22)) userZodiac='Ζυγός';
        else if ((m===10&&day>=23)||(m===11&&day<=21)) userZodiac='Σκορπιός';
        else if ((m===11&&day>=22)||(m===12&&day<=21)) userZodiac='Τοξότης';
        else if ((m===12&&day>=22)||(m===1&&day<=19)) userZodiac='Αιγόκερως';
        else if ((m===1&&day>=20)||(m===2&&day<=18)) userZodiac='Υδροχόος';
        else userZodiac='Ιχθείς';
    }
}

function selectTopic(topic) { userTopic = topic; }

// ===== CAMERA =====
var video = document.getElementById('webcam');
var currentStream = null;
var capturedImage = null;
var isAnalyzing = false;
var cameraActive = false;
var currentFacingMode = 'user';

async function startCamera() {
    try {
        if (currentStream) { currentStream.getTracks().forEach(function(t) { t.stop(); }); }
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode, width: { ideal: 640 }, height: { ideal: 480 } }
        });
        video.srcObject = currentStream;
        cameraActive = true;
        document.getElementById('analyze-btn').style.display = 'inline-flex';
        document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
        document.getElementById('selfie-btn').style.display = 'inline-flex';
        document.getElementById('back-btn').style.display = 'inline-flex';
        document.getElementById('camera-btn').innerText = '📸 Φωτογραφία';
        updateCameraToggleButtons();
    } catch (err) {
        alert('Δεν μπόρεσα να ανοίξω την κάμερα. Δοκίμασε το Upload.');
    }
}

function toggleCamera() {
    if (cameraActive) {
        capturePhotoFromCamera();
        stopCamera();
        document.getElementById('camera-btn').innerText = '📷 Έναρξη';
    } else {
        startCamera();
    }
}

async function switchCamera(facingMode) {
    if (currentFacingMode === facingMode) return;
    currentFacingMode = facingMode;
    if (currentStream) { currentStream.getTracks().forEach(function(t) { t.stop(); }); currentStream = null; }
    cameraActive = false;
    startCamera();
}

function updateCameraToggleButtons() {
    document.getElementById('selfie-btn').classList.toggle('active', currentFacingMode === 'user');
    document.getElementById('back-btn').classList.toggle('active', currentFacingMode === 'environment');
}

function stopCamera() {
    if (currentStream) { currentStream.getTracks().forEach(function(t) { t.stop(); }); currentStream = null; }
    cameraActive = false;
    document.getElementById('selfie-btn').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('camera-btn').innerText = '📷 Έναρξη';
}

function capturePhotoFromCamera() {
    if (!currentStream) return;
    var canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    var ctx = canvas.getContext('2d');
    if (currentFacingMode === 'user') {
        ctx.save(); ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
    } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    capturedImage = canvas.toDataURL('image/jpeg', 0.8);
    document.getElementById('upload-preview-img').src = capturedImage;
    document.getElementById('upload-preview-area').style.display = 'block';
}

function handleUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        capturedImage = e.target.result;
        document.getElementById('upload-preview-img').src = capturedImage;
        document.getElementById('upload-preview-area').style.display = 'block';
        document.getElementById('analyze-btn').style.display = 'inline-flex';
        document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
    };
    reader.readAsDataURL(file);
}

// ===== API & ANALYSIS =====
var API_URL = 'https://franklymadear-lifeline.hf.space/analyze';

async function performAnalysis() {
    if (isAnalyzing) return;
    if (!capturedImage) { alert('Παρακαλώ τράβηξε ή ανέβασε φωτογραφία.'); return; }
    isAnalyzing = true;
    document.getElementById('loading-box').style.display = 'block';
    document.getElementById('analyze-btn').style.display = 'none';
    document.getElementById('analyze-vip-btn').style.display = 'none';
    try {
        var response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: capturedImage,
                gender: userGender,
                zodiac: userZodiac,
                birthdate: userBirthdate,
                topic: userTopic
            })
        });
        var data = await response.json();
        if (data.success && data.reading) {
            document.getElementById('result-popup-text').innerHTML = data.reading
                .replace(/## (.*?)\n/g, '<h2>$1</h2>')
                .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            document.getElementById('result-popup-overlay').classList.add('active');
            addStarsToPopup();
        } else {
            alert('Η Aziram συνάντησε εμπόδιο. Δοκίμασε ξανά.');
        }
    } catch (error) {
        alert('Σφάλμα σύνδεσης.');
    } finally {
        document.getElementById('loading-box').style.display = 'none';
        document.getElementById('analyze-btn').style.display = 'inline-flex';
        document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
        updatePointsDisplay();
        isAnalyzing = false;
    }
}

function addStarsToPopup() {
    var popup = document.getElementById('result-popup');
    popup.querySelectorAll('.popup-star').forEach(function(s) { s.remove(); });
    var emojis = ['✨', '⭐', '💫', '🌟', '🔮', '💖', '🌙'];
    for (var i = 0; i < 15; i++) {
        var star = document.createElement('span');
        star.className = 'popup-star';
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = Math.random() * 85 + '%';
        star.style.top = Math.random() * 85 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        popup.appendChild(star);
    }
}

function closeResultPopup() {
    document.getElementById('result-popup-overlay').classList.remove('active');
    document.querySelectorAll('.popup-star').forEach(function(s) { s.remove(); });
    resetScan();
}

function resetScan() {
    document.getElementById('loading-box').style.display = 'none';
    document.getElementById('analyze-btn').style.display = 'none';
    document.getElementById('analyze-vip-btn').style.display = 'none';
    document.getElementById('upload-preview-area').style.display = 'none';
    document.getElementById('camera-btn').innerText = '📷 Έναρξη';
    capturedImage = null;
    isAnalyzing = false;
}

// ===== POINTS SYSTEM =====
const POINTS_KEY = 'lifeline_user_points';
const VIP_COST = 5;

function getUserPoints() { return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10); }
function addPoints(amount) { localStorage.setItem(POINTS_KEY, (getUserPoints() + amount).toString()); updatePointsDisplay(); }
function spendPoints(amount) { var c = getUserPoints(); if (c >= amount) { localStorage.setItem(POINTS_KEY, (c - amount).toString()); updatePointsDisplay(); return true; } return false; }

function updatePointsDisplay() {
    var display = document.getElementById('points-display');
    var pts = getUserPoints();
    if (display) display.textContent = pts;
    var vipBtn = document.getElementById('analyze-vip-btn');
    if (vipBtn) {
        var vipCostEl = document.getElementById('vip-cost');
        var vipPointsEl = document.getElementById('vip-points');
        if (vipCostEl) vipCostEl.textContent = VIP_COST;
        if (vipPointsEl) vipPointsEl.textContent = pts;
        vipBtn.disabled = pts < VIP_COST;
        vipBtn.style.opacity = pts < VIP_COST ? '0.5' : '1';
    }
}

function earnPoints() {
    showRewardedAd()
        .then(function(result) {
            if (result.done) { addPoints(10); alert('🎉 Κέρδισες 10 πόντους!'); }
        })
        .catch(function(err) { alert('Δεν ήταν δυνατή η προβολή διαφήμισης.'); });
}

function startAnalysisFlow(isVip) {
    if (isVip) {
        if (spendPoints(VIP_COST)) { performAnalysis(); }
        else { alert('Δεν έχεις αρκετούς πόντους. Χρειάζεσαι ' + VIP_COST + '.'); }
        return;
    }
    if (!capturedImage) { alert('Παρακαλώ τράβηξε ή ανέβασε φωτογραφία.'); return; }
    showRewardedAd()
        .then(function(result) { if (result.done) addPoints(2); performAnalysis(); })
        .catch(function(err) { performAnalysis(); });
}

// ===== INITIALIZE =====
updatePointsDisplay();

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
    document.getElementById('consent-overlay').classList.remove('hidden');
}

function acceptConsent() {
    localStorage.setItem('lifeline_consent', 'true');
    document.getElementById('consent-overlay').classList.add('hidden');
}

checkConsent();

// ===== WELCOME BONUS (15 πόντοι για νέους χρήστες) =====
function grantWelcomeBonus() {
    if (!localStorage.getItem('lifeline_welcome_bonus_given')) {
        addPoints(15);
        localStorage.setItem('lifeline_welcome_bonus_given', 'true');
        console.log('🎁 Welcome bonus 15 points granted');
    }
}

// ===== CUSTOM MODAL ΓΙΑ ΣΦΑΛΜΑ ΠΟΝΤΩΝ (μεταφράζεται) =====
function showPointsErrorModal(customMessageKey) {
    var existing = document.getElementById('points-error-modal');
    if (existing) existing.remove();

    var defaultTitle = 'Ανεπαρκή Διαμάντια!';
    var defaultBody = 'Χρειάζεσαι 15 διαμάντια για μία VIP ανάλυση. Πάτα "Κέρδισε Πόντους" για να δεις μία διαφήμιση (+10).';
    var title = defaultTitle;
    var body = defaultBody;

    // Επιλέγουμε το σωστό μήνυμα ανάλογα με το κλειδί (upload ή default)
    if (customMessageKey === 'upload') {
        body = 'Δεν έχεις αρκετά διαμάντια! Μάζεψε 15 διαμάντια από τις διαφημίσεις πριν ανεβάσεις φωτογραφία.';
    }

    var modalHTML = `
        <div id="points-error-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:10002;display:flex;align-items:center;justify-content:center;padding:20px;">
            <div style="background:linear-gradient(145deg,#1a0e2a,#2a1a3a);border:3px solid #FFD700;border-radius:25px;padding:25px 20px;max-width:420px;width:100%;text-align:center;box-shadow:0 0 60px rgba(255,215,0,0.4);animation:modalFadeIn 0.5s ease;">
                <div style="font-size:3rem;margin-bottom:10px;">💎</div>
                <h2 style="color:#FFD700;font-size:1.2rem;margin-bottom:12px;" data-translate="true">${title}</h2>
                <p style="color:#d5c8e8;font-size:0.85rem;line-height:1.6;margin-bottom:20px;" data-translate="true">${body}</p>
                <button onclick="closePointsErrorModal()" style="background:linear-gradient(145deg,#FFD700,#B8860B);color:#1a0033;padding:12px 25px;border:none;border-radius:30px;font-size:0.9rem;font-weight:700;cursor:pointer;box-shadow:0 0 20px rgba(255,215,0,0.3);letter-spacing:1px;width:100%;" data-translate="true">Κατάλαβα, πάω για διαφημίσεις!</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Άμεση μετάφραση αν η γλώσσα δεν είναι Ελληνικά
    if (currentLang !== 'el') {
        var modalEl = document.getElementById('points-error-modal');
        var translatable = modalEl.querySelectorAll('[data-translate="true"]');
        translateElements(translatable, currentLang);
    }
}

function closePointsErrorModal() {
    var modal = document.getElementById('points-error-modal');
    if (modal) modal.remove();
}

// ===== ΔΗΜΙΟΥΡΓΙΑ OVERLAY ΓΙΑ ΤΗΝ ΠΑΛΑΜΗ / COUNTDOWN =====
function createPalmGuideOverlay() {
    if (document.getElementById('palm-guide-overlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'palm-guide-overlay';
    overlay.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        pointer-events: none; z-index: 20;
        background: rgba(0,0,0,0.4); border-radius: 24px;
        transition: opacity 0.4s;
    `;
    var p = document.createElement('p');
    p.style.cssText = 'color:#FFD700;font-size:1.3rem;font-weight:bold;text-shadow:0 0 20px black;text-align:center;padding:10px;';
    p.textContent = 'Τοποθέτησε την παλάμη σου εδώ';
    overlay.appendChild(p);
    var wrapper = document.getElementById('camera-wrapper');
    if (wrapper) wrapper.appendChild(overlay);
    return overlay;
}

// Ενημέρωση εμφάνισης / απόκρυψης του οδηγού παλάμης
function showPalmGuideOverlay(show, customText) {
    var overlay = document.getElementById('palm-guide-overlay');
    if (!overlay) overlay = createPalmGuideOverlay();
    if (show) {
        overlay.style.display = 'flex';
        var textElement = overlay.querySelector('p');
        if (textElement && customText) {
            textElement.textContent = customText;
        } else if (textElement) {
            textElement.textContent = 'Τοποθέτησε την παλάμη σου εδώ';
        }
    } else {
        overlay.style.display = 'none';
    }
}

// ===== ΜΕΤΑΦΡΑΣΗ ΤΟΥ COUNTDOWN PREFIX =====
var countdownPrefix = 'Σκανάρισμα σε:';
async function updateCountdownPrefix() {
    if (currentLang === 'el') {
        countdownPrefix = 'Σκανάρισμα σε:';
        return;
    }
    // Μεταφράζουμε μόνο το prefix
    var dummy = document.createElement('span');
    dummy.textContent = 'Σκανάρισμα σε:';
    await translateElements([dummy], currentLang);
    countdownPrefix = dummy.textContent.trim() + ' ';
}

// ===== TERMS & PRIVACY ΔΟΜΗ =====
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
        html += `<h3 data-translate="true">${sec.heading}</h3>`;
        html += `<p data-translate="true">${sec.body}</p>`;
    });
    html += `<p data-translate="true" style="text-align:center;margin-top:18px;">${structure.footer}</p>`;
    html += '<button id="close-terms-btn" onclick="closeTerms()" data-translate="true">✕ Κλείσιμο</button>';

    modal.innerHTML = html;
    document.getElementById('terms-modal-overlay').classList.add('active');

    if (currentLang !== 'el') {
        var elements = modal.querySelectorAll('[data-translate="true"]');
        await translateElements(elements, currentLang);
    }
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

// Για το popup αποτελέσματος
var originalResultText = '';
var resultTranslationLang = '';

function saveOriginalTexts() {
    document.querySelectorAll('[data-translate="true"]').forEach(function(el) {
        var key = el.outerHTML;
        if (!originalTexts[key]) originalTexts[key] = el.textContent.trim();
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

async function translateElements(elements, targetLang) {
    var textsToTranslate = [];
    var elementsToUpdate = [];
    elements.forEach(function(el) {
        var text = el.textContent.trim();
        if (text.length > 0 && text.length < 1500) {
            textsToTranslate.push(text);
            elementsToUpdate.push(el);
        }
    });
    if (textsToTranslate.length === 0) return;
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
    await translateElements(elements, targetLang);
    currentLang = targetLang;
    finishTranslation();
    updateLangLabel();
    updatePointsDisplay();
    // Ενημέρωση και του countdown prefix
    await updateCountdownPrefix();
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

// ===== ΑΥΤΟΜΑΤΗ ΑΝΙΧΝΕΥΣΗ ΓΛΩΣΣΑΣ ΣΥΣΚΕΥΗΣ =====
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
    if (mapped !== 'el') {
        setTimeout(function() { startTranslation(); }, 1000);
    }
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
    if (capturedImage || cameraActive) {
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

// ===== CAMERA ΜΕ ΑΥΤΟΜΑΤΗ ΑΝΤΙΣΤΡΟΦΗ ΜΕΤΡΗΣΗ 8 ΔΕΥΤΕΡΟΛΕΠΤΩΝ =====
var video = document.getElementById('webcam');
var currentStream = null;
var capturedImage = null;
var isAnalyzing = false;
var cameraActive = false;
var currentFacingMode = 'user';
var countdownInterval = null;
var countdownTimeout = null;
var countdownSeconds = 8;

async function startCamera() {
    if (getUserPoints() < VIP_COST) {
        showPointsErrorModal();
        return;
    }

    try {
        if (currentStream) { currentStream.getTracks().forEach(function(t) { t.stop(); }); }
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentFacingMode, width: { ideal: 640 }, height: { ideal: 480 } }
        });
        video.srcObject = currentStream;
        cameraActive = true;

        createPalmGuideOverlay(); // εξασφαλίζει ότι υπάρχει
        showPalmGuideOverlay(true);
        startCountdown();

        document.getElementById('camera-btn').innerText = '📷 Κλείσιμο Κάμερας';
        document.getElementById('camera-btn').style.background = 'linear-gradient(145deg, #e74c3c, #c0392b)';
        document.getElementById('selfie-btn').style.display = 'inline-flex';
        document.getElementById('back-btn').style.display = 'inline-flex';
        updateCameraToggleButtons();
    } catch (err) {
        alert('Δεν μπόρεσα να ανοίξω την κάμερα. Δοκίμασε το Upload.');
    }
}

function startCountdown() {
    clearCountdown();

    // Βεβαιωνόμαστε ότι το prefix είναι μεταφρασμένο
    updateCountdownPrefix().then(() => {
        countdownSeconds = 8;
        updateCountdownDisplay();

        countdownInterval = setInterval(function() {
            countdownSeconds--;
            updateCountdownDisplay();
            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                autoCaptureAndAnalyze();
            }
        }, 1000);

        countdownTimeout = setTimeout(function() {
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            autoCaptureAndAnalyze();
        }, 8000);
    });
}

function updateCountdownDisplay() {
    var text = countdownPrefix + countdownSeconds + '...';
    showPalmGuideOverlay(true, text);
}

function clearCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    if (countdownTimeout) {
        clearTimeout(countdownTimeout);
        countdownTimeout = null;
    }
}

function autoCaptureAndAnalyze() {
    if (!cameraActive) return;
    capturePhotoFromCamera();
    stopCamera();
    performAnalysis();
}

function toggleCamera() {
    if (cameraActive) {
        stopCamera();
    } else {
        startCamera();
    }
}

function stopCamera() {
    clearCountdown();
    if (currentStream) { currentStream.getTracks().forEach(function(t) { t.stop(); }); currentStream = null; }
    cameraActive = false;
    showPalmGuideOverlay(false);
    document.getElementById('selfie-btn').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    document.getElementById('camera-btn').innerText = '📷 Άνοιγμα Κάμερας';
    document.getElementById('camera-btn').style.background = 'linear-gradient(145deg, #FFD700, #B8860B)';
}

async function switchCamera(facingMode) {
    if (currentFacingMode === facingMode) return;
    currentFacingMode = facingMode;
    if (currentStream) { currentStream.getTracks().forEach(function(t) { t.stop(); }); currentStream = null; }
    cameraActive = false;
    clearCountdown();
    await startCamera();
}

function updateCameraToggleButtons() {
    document.getElementById('selfie-btn').classList.toggle('active', currentFacingMode === 'user');
    document.getElementById('back-btn').classList.toggle('active', currentFacingMode === 'environment');
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
    showPhotoPreview(capturedImage);
}

// ===== UPLOAD ΜΕ ΕΛΕΓΧΟ ΠΟΝΤΩΝ (μπλοκάρει πριν το σκανάρισμα) =====
function handleUpload(event) {
    if (getUserPoints() < VIP_COST) {
        event.target.value = '';
        showPointsErrorModal('upload'); // custom μήνυμα για upload
        return;
    }

    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        capturedImage = e.target.result;
        showPhotoPreview(capturedImage);
    };
    reader.readAsDataURL(file);
}

function showPhotoPreview(imageSrc) {
    document.getElementById('upload-preview-img').src = imageSrc;
    document.getElementById('upload-preview-area').style.display = 'block';
    document.getElementById('analyze-vip-btn').style.display = 'inline-flex';
    updatePointsDisplay();
}

// ===== API & ANALYSIS =====
var API_URL = 'https://franklymadear-lifeline.hf.space/analyze';

async function performAnalysis() {
    if (isAnalyzing) return;
    if (!capturedImage) { alert('Παρακαλώ τράβηξε ή ανέβασε φωτογραφία.'); return; }
    isAnalyzing = true;
    document.getElementById('loading-box').style.display = 'block';
    document.getElementById('analyze-vip-btn').style.display = 'none';
    document.getElementById('upload-preview-area').style.display = 'none';
    try {
        var response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: capturedImage,
                gender: userGender,
                zodiac: userZodiac,
                birthdate: userBirthdate,
                topic: userTopic,
                language: currentLang,
                user_id: getCurrentUserId()
            })
        });
        var data = await response.json();
        if (data.success && data.reading) {
            spendPoints(VIP_COST);

            var resultDiv = document.getElementById('result-popup-text');
            originalResultText = data.reading;
            resultTranslationLang = '';

            resultDiv.innerHTML = originalResultText
                .replace(/## (.*?)\n/g, '<h2>$1</h2>')
                .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            var resultLangSelect = document.getElementById('result-lang-select');
            if (resultLangSelect) resultLangSelect.value = currentLang;

            if (currentLang !== 'el') {
                await translateResultTo(currentLang);
            }

            document.getElementById('result-popup-overlay').classList.add('active');
            addStarsToPopup();
            rewardReferrerIfFirstAnalysis();
        } else {
            alert('Η Aziram συνάντησε εμπόδιο. Δοκίμασε ξανά.');
        }
    } catch (error) {
        alert('Σφάλμα σύνδεσης.');
    } finally {
        document.getElementById('loading-box').style.display = 'none';
        updatePointsDisplay();
        isAnalyzing = false;
        resetScan();
    }
}

// ===== ΣΥΝΑΡΤΗΣΕΙΣ ΜΕΤΑΦΡΑΣΗΣ ΑΠΟΤΕΛΕΣΜΑΤΟΣ =====
async function translateResultTo(targetLang) {
    if (!originalResultText) return;
    var resultDiv = document.getElementById('result-popup-text');
    
    var tempSpan = document.createElement('span');
    tempSpan.textContent = resultDiv.innerText;
    resultDiv.innerHTML = '';
    resultDiv.appendChild(tempSpan);
    
    if (resultTranslationLang !== targetLang) {
        await translateElements([tempSpan], targetLang);
        resultTranslationLang = targetLang;
    }
    
    resultDiv.innerHTML = resultDiv.innerText.replace(/\n/g, '<br>');
    
    var selectEl = document.getElementById('result-lang-select');
    if (selectEl) selectEl.value = targetLang;
}

function translateResultFromPopup() {
    var lang = document.getElementById('result-lang-select').value;
    translateResultTo(lang);
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
    document.getElementById('analyze-vip-btn').style.display = 'none';
    document.getElementById('upload-preview-area').style.display = 'none';
    document.getElementById('camera-btn').innerText = '📷 Άνοιγμα Κάμερας';
    document.getElementById('camera-btn').style.background = 'linear-gradient(145deg, #FFD700, #B8860B)';
    capturedImage = null;
    isAnalyzing = false;
}

// ===== POINTS SYSTEM =====
const POINTS_KEY = 'lifeline_user_points';
const VIP_COST = 15;

function getUserPoints() { return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10); }
function addPoints(amount) { localStorage.setItem(POINTS_KEY, (getUserPoints() + amount).toString()); updatePointsDisplay(); }
function spendPoints(amount) {
    var c = getUserPoints();
    if (c >= amount) {
        localStorage.setItem(POINTS_KEY, (c - amount).toString());
        updatePointsDisplay();
        return true;
    }
    return false;
}

// ===== ΔΥΝΑΜΙΚΗ ΔΙΑΜΟΡΦΩΣΗ BADGE ΠΟΝΤΩΝ (💎 + data-translate) =====
function setupPointsBadge() {
    var badge = document.querySelector('.points-badge');
    if (!badge) return;
    // Αντικατάσταση περιεχομένου ώστε να έχει 💎, span για αριθμό, και span για λέξη με data-translate
    var pointsSpan = badge.querySelector('#points-display');
    if (pointsSpan) {
        var points = pointsSpan.textContent;
        badge.innerHTML = '💎 <span id="points-display">' + points + '</span> <span data-translate="true">Πόντοι</span>';
    } else {
        // Αν δεν υπάρχει το span, δημιουργούμε από την αρχή
        var pts = getUserPoints();
        badge.innerHTML = '💎 <span id="points-display">' + pts + '</span> <span data-translate="true">Πόντοι</span>';
    }
}

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
    // Αν δεν έχει γίνει ακόμα setup του badge (πρώτη φορά), το κάνουμε
    if (!document.querySelector('.points-badge span[data-translate="true"]')) {
        setupPointsBadge();
    }
}

function earnPoints() {
    showRewardedAd()
        .then(function(result) { if (result.done) { addPoints(10); alert('🎉 Κέρδισες 10 πόντους!'); } })
        .catch(function(err) { alert('Δεν ήταν δυνατή η προβολή διαφήμισης.'); });
}

function startAnalysisFlow() {
    if (!capturedImage) {
        alert('Παρακαλώ τράβηξε ή ανέβασε φωτογραφία.');
        return;
    }
    if (getUserPoints() >= VIP_COST) {
        document.getElementById('analyze-vip-btn').disabled = true;
        document.getElementById('analyze-vip-btn').style.opacity = '0.5';
        performAnalysis();
    } else {
        showPointsErrorModal();
    }
}

// ===== REFERRAL SYSTEM =====
const OFFICIAL_BOT_USERNAME = 'lifeline2026_bot';
const REFERRAL_REWARD = 20;
const MAX_INVITES = 10;

function detectReferral() {
    var urlParams = new URLSearchParams(window.location.search);
    var startParam = urlParams.get('start');
    if (startParam) {
        localStorage.setItem('lifeline_referrer', startParam);
    }
}

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

function getReferralLink() {
    return 'https://t.me/' + OFFICIAL_BOT_USERNAME + '?start=' + getCurrentUserId();
}

async function createInviteModal() {
    var existing = document.getElementById('invite-modal');
    if (existing) existing.remove();

    var referralLink = getReferralLink();
    var invites = parseInt(localStorage.getItem('lifeline_invites_count') || '0');
    var maxInvites = MAX_INVITES;

    var modalHTML = `
        <div id="invite-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;display:flex;align-items:center;justify-content:center;">
            <div style="background:linear-gradient(145deg,#1a0e2a,#2a1a3a);border:2px solid #FFD700;border-radius:20px;padding:25px;max-width:450px;width:90%;text-align:center;">
                <button onclick="closeInviteModal()" style="float:right;background:rgba(255,215,0,0.2);border:none;color:#FFD700;font-size:1.2rem;cursor:pointer;border-radius:50%;width:30px;height:30px;">✕</button>
                <div style="font-size:3rem;margin-bottom:10px;" data-translate="true">🎁</div>
                <h2 style="color:#FFD700;" data-translate="true">Κάλεσε Φίλους & Κέρδισε!</h2>
                <p style="color:#d5c8e8;margin:15px 0;" data-translate="true">Κέρδισε <strong style="color:#FFD700;">20 πόντους</strong> για κάθε φίλο που κάνει την πρώτη του ανάλυση χειρομαντείας!</p>
                <p style="background:rgba(255,215,0,0.2);padding:8px 15px;border-radius:20px;display:inline-block;" data-translate="true">👥 ${invites}/${maxInvites} επιτυχημένες προσκλήσεις</p>
                <div style="background:rgba(0,0,0,0.3);padding:15px;border-radius:15px;margin:15px 0;word-break:break-all;">
                    <p style="color:#FFD700;font-size:0.85rem;" data-translate="true">Το link σου:</p>
                    <code style="color:#b9a6d4;font-size:0.8rem;">${referralLink}</code>
                    <button onclick="copyReferralLink()" style="margin-top:10px;width:100%;padding:10px;background:linear-gradient(145deg,#FFD700,#B8860B);border:none;border-radius:30px;font-weight:bold;cursor:pointer;" data-translate="true">📋 Αντιγραφή Link</button>
                </div>
                <button onclick="shareViaTelegram()" style="width:100%;margin-top:10px;padding:12px;background:linear-gradient(145deg,#9b59b6,#6a0dad);border:none;border-radius:30px;color:#fff;font-weight:bold;cursor:pointer;" data-translate="true">📤 Μοιράσου στο Telegram</button>
                <button onclick="shareViaWhatsApp()" style="width:100%;margin-top:10px;padding:12px;background:linear-gradient(145deg,#FFD700,#B8860B);border:none;border-radius:30px;font-weight:bold;cursor:pointer;" data-translate="true">💬 Μοιράσου στο WhatsApp</button>
                <p style="color:#b9a6d4;font-size:0.8rem;margin-top:15px;" data-translate="true">ℹ️ Οι πόντοι αποδίδονται μετά την πρώτη ανάλυση του φίλου σου.</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    if (currentLang !== 'el') {
        var modalEl = document.getElementById('invite-modal');
        var translatable = modalEl.querySelectorAll('[data-translate="true"]');
        await translateElements(translatable, currentLang);
    }
}

function showInviteModal() { createInviteModal(); }
function closeInviteModal() { var m = document.getElementById('invite-modal'); if (m) m.remove(); }

function copyReferralLink() {
    var link = getReferralLink();
    navigator.clipboard.writeText(link).then(function() { alert('✅ Αντιγράφηκε!'); });
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
    btn.className = 'btn btn-purple btn-uniform';
    btn.style.marginLeft = '8px';
    btn.setAttribute('data-translate', 'true');
    btn.textContent = '👥 Κάλεσε Φίλους';
    btn.onclick = showInviteModal;
    bar.appendChild(btn);

    if (currentLang !== 'el') {
        translateElements([btn], currentLang);
    }
}

// ===== INITIALIZE =====
function initApp() {
    createPalmGuideOverlay(); // δημιουργία overlay παλάμης
    setupPointsBadge();       // διαμόρφωση badge με 💎 και data-translate
    grantWelcomeBonus();
    updatePointsDisplay();
    addInviteButton();
    detectReferral();
    updateCountdownPrefix();  // προετοιμασία translated prefix
}

window.addEventListener('DOMContentLoaded', initApp);

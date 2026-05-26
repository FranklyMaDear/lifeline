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
    document.getElementById('consent-overlay').classList.remove('hidden');
}

function acceptConsent() {
    localStorage.setItem('lifeline_consent', 'true');
    document.getElementById('consent-overlay').classList.add('hidden');
}

checkConsent();

// ===== TERMS & PRIVACY =====
const TERMS_TEXT = {
    terms: `<h2>📜 Όροι Χρήσης LiFe LiNe</h2>

<h3>1. Όριο Ηλικίας (Αυστηρά 18+)</h3>
<p>Η χρήση της εφαρμογής <strong>LiFe LiNe</strong> επιτρέπεται αποκλειστικά και μόνο σε άτομα που έχουν συμπληρώσει το 18ο έτος της ηλικίας τους (ενήλικες).</p>
<p>Με την αποδοχή των όρων και την επιλογή του σχετικού πλαισίου, ο χρήστης δηλώνει υπεύθυνα ότι είναι ενήλικος.</p>
<p>Οι διαχειριστές του LiFe LiNe δεν φέρουν καμία ευθύνη για ψευδείς δηλώσεις ηλικίας από πλευράς των επισκεπτών.</p>

<h3>2. Ψυχαγωγικός Χαρακτήρας</h3>
<p>... (πλήρες κείμενο όπως πριν) ...</p>`,

    privacy: `<h2>🔒 Πολιτική Απορρήτου LiFe LiNe</h2>
<p>... (πλήρες κείμενο όπως πριν) ...</p>`
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
// ... (όλη η υπάρχουσα λογική μετάφρασης – την παραλείπω για συντομία, αλλά παραμένει ΙΔΙΑ όπως στο αρχικό script.js) ...

// ===== STARFIELD =====
// ... (ίδιο) ...

// ===== NAVIGATION =====
function goToScan() { /* ... */ }
function goToSplash() { /* ... */ }

// ===== USER PREFERENCES =====
var userGender = 'male';
var userZodiac = 'Κριός';
var userBirthdate = '';
var userTopic = 'Έρωτας & Σχέσεις';

function setGender(gender) { /* ... */ }
function setBirthdate(date) { /* ... */ }
function selectTopic(topic) { /* ... */ }

// ===== CAMERA =====
// ... (ίδια λογική κάμερας) ...

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
        .then(function(result) { if (result.done) { addPoints(10); alert('🎉 Κέρδισες 10 πόντους!'); } })
        .catch(function(err) { alert('Δεν ήταν δυνατή η προβολή διαφήμισης.'); });
}

// ===== REFERRAL SYSTEM =====
const OFFICIAL_BOT_USERNAME = 'lifeline2026_bot';
const REFERRAL_REWARD = 20;
const MAX_INVITES = 10;
let currentReferrerId = null;

function detectReferral() {
    const urlParams = new URLSearchParams(window.location.search);
    const startParam = urlParams.get('start');
    if (startParam) {
        currentReferrerId = startParam;
        localStorage.setItem('lifeline_referrer', currentReferrerId);
    }
}

function getCurrentUserId() {
    // Προσπάθησε να πάρεις το Telegram user ID, αλλιώς ένα test ID
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        return window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    let testId = localStorage.getItem('lifeline_test_user_id');
    if (!testId) {
        testId = 'test_' + Date.now();
        localStorage.setItem('lifeline_test_user_id', testId);
    }
    return testId;
}

function getReferralLink() {
    return `https://t.me/${OFFICIAL_BOT_USERNAME}?start=${getCurrentUserId()}`;
}

function createInviteModal() {
    const existingModal = document.getElementById('invite-modal');
    if (existingModal) existingModal.remove();

    const referralLink = getReferralLink();
    const invites = parseInt(localStorage.getItem('lifeline_invites_count') || '0');
    const maxInvites = MAX_INVITES;

    const modalHTML = `
        <div id="invite-modal" class="legal-overlay" style="display:flex;">
            <div class="legal-modal" style="text-align: center; max-width: 450px;">
                <button class="legal-close-btn" onclick="closeInviteModal()">✕</button>
                <div style="font-size: 3rem; margin-bottom: 10px;">🎁</div>
                <h2 style="color: #FFD700;">Κάλεσε Φίλους & Κέρδισε!</h2>
                <p style="color: #d5c8e8; margin: 15px 0; line-height: 1.6;">
                    Κέρδισε <strong style="color: #FFD700;">20 πόντους</strong> για κάθε φίλο που 
                    κάνει την πρώτη του ανάλυση χειρομαντείας!
                    <br><br>
                    <span style="background: rgba(255,215,0,0.2); padding: 8px 15px; border-radius: 20px; display: inline-block;">
                        👥 ${invites}/${maxInvites} επιτυχημένες προσκλήσεις
                    </span>
                </p>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 15px; margin: 15px 0; word-break: break-all;">
                    <p style="color: #FFD700; font-size: 0.85rem; margin-bottom: 10px;">Το link σου:</p>
                    <code style="color: #b9a6d4; font-size: 0.8rem;">${referralLink}</code>
                    <button class="btn btn-gold" onclick="copyReferralLink()" style="margin-top: 10px; width: 100%; padding: 10px;">
                        📋 Αντιγραφή Link
                    </button>
                </div>
                <button class="btn btn-purple" onclick="shareViaTelegram()" style="width: 100%; margin-top: 10px; padding: 12px;">
                    📤 Μοιράσου το στο Telegram
                </button>
                <button class="btn btn-gold" onclick="shareViaWhatsApp()" style="width: 100%; margin-top: 10px; padding: 12px;">
                    💬 Μοιράσου στο WhatsApp
                </button>
                <p style="color: #b9a6d4; font-size: 0.8rem; margin-top: 15px;">
                    ℹ️ Οι πόντοι αποδίδονται μόλις ο φίλος σου κάνει την πρώτη του ανάλυση
                </p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showInviteModal() {
    createInviteModal();
    document.getElementById('invite-modal').style.display = 'flex';
}

function closeInviteModal() {
    const modal = document.getElementById('invite-modal');
    if (modal) modal.style.display = 'none';
}

function copyReferralLink() {
    const link = getReferralLink();
    navigator.clipboard.writeText(link).then(() => alert('✅ Το link αντιγράφηκε!'));
}

function shareViaTelegram() {
    const link = getReferralLink();
    const text = encodeURIComponent('🖐️ Ανακάλυψε τα μυστικά της παλάμης σου με Χειρομαντεία AI!\nΜπες στο LiFe LiNe!\n' + link);
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`);
    } else {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
    }
}

function shareViaWhatsApp() {
    const link = getReferralLink();
    const text = encodeURIComponent('🖐️ Χειρομαντεία με AI! Μπες εδώ: ' + link);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Κλήση backend για επιβράβευση referrer μετά την πρώτη ανάλυση
async function rewardReferrerIfFirstAnalysis() {
    const userId = getCurrentUserId();
    try {
        const response = await fetch('/api/referral/reward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        const data = await response.json();
        if (data.success) {
            console.log('✅ Referrer rewarded');
        }
    } catch (e) {
        console.error('Reward referral failed', e);
    }
}

// Τροποποιημένη ανάλυση που καλεί και το referral reward
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
                topic: userTopic,
                user_id: getCurrentUserId()
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

            // 🔥 Επιβράβευση referrer αν είναι η πρώτη ανάλυση
            rewardReferrerIfFirstAnalysis();
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

// Προσθήκη κουμπιού "Κάλεσε Φίλους"
function addInviteButton() {
    const rewardsBar = document.getElementById('rewards-bar');
    if (!rewardsBar || document.getElementById('invite-friends-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'invite-friends-btn';
    btn.className = 'btn btn-purple btn-uniform';
    btn.textContent = '👥 Κάλεσε Φίλους';
    btn.onclick = showInviteModal;
    rewardsBar.appendChild(btn);
}

// ===== INITIALIZE =====
updatePointsDisplay();
addInviteButton();
detectReferral();

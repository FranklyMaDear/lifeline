import os
import sqlite3
from datetime import datetime, date
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ===== CONFIG =====
OFFICIAL_BOT_USERNAME = "lifeline2026_bot"
DATABASE = "lifeline_users.db"
REFERRAL_REWARD = 20
MAX_INVITES = 10

# ===== DATABASE SETUP =====
def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT,
            first_name TEXT,
            points INTEGER DEFAULT 0,
            successful_invites INTEGER DEFAULT 0,
            referrer_id TEXT,
            joined_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS referrals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            referrer_id TEXT NOT NULL,
            referred_user_id TEXT NOT NULL UNIQUE,
            reward_granted INTEGER DEFAULT 0,
            referred_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (referrer_id) REFERENCES users(user_id),
            FOREIGN KEY (referred_user_id) REFERENCES users(user_id)
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS analysis_count (
            user_id TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0,
            last_analysis_date TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# ===== HELPER =====
def get_or_create_user(user_id, username=None, first_name=None, referrer_id=None):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
    if not user:
        db.execute(
            "INSERT INTO users (user_id, username, first_name, referrer_id) VALUES (?, ?, ?, ?)",
            (user_id, username, first_name, referrer_id)
        )
        db.commit()
        # Αν υπάρχει referrer, πρόσθεσε την παραπομπή
        if referrer_id and referrer_id != user_id:
            try:
                db.execute(
                    "INSERT OR IGNORE INTO referrals (referrer_id, referred_user_id) VALUES (?, ?)",
                    (referrer_id, user_id)
                )
                db.commit()
            except:
                pass
        user = db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchone()
    db.close()
    return dict(user) if user else None

def is_first_analysis(user_id):
    db = get_db()
    row = db.execute("SELECT count FROM analysis_count WHERE user_id = ?", (user_id,)).fetchone()
    db.close()
    return (row is None or row['count'] == 0)

def increment_analysis(user_id):
    db = get_db()
    today = date.today().isoformat()
    db.execute(
        "INSERT INTO analysis_count (user_id, count, last_analysis_date) VALUES (?, 1, ?) "
        "ON CONFLICT(user_id) DO UPDATE SET count = count + 1, last_analysis_date = ?",
        (user_id, today, today)
    )
    db.commit()
    db.close()

def grant_referral_reward(referred_user_id):
    db = get_db()
    referral = db.execute(
        "SELECT * FROM referrals WHERE referred_user_id = ? AND reward_granted = 0",
        (referred_user_id,)
    ).fetchone()
    if not referral:
        db.close()
        return False

    referrer = db.execute("SELECT * FROM users WHERE user_id = ?", (referral['referrer_id'],)).fetchone()
    if not referrer or referrer['successful_invites'] >= MAX_INVITES:
        db.close()
        return False

    db.execute(
        "UPDATE users SET points = points + ?, successful_invites = successful_invites + 1 WHERE user_id = ?",
        (REFERRAL_REWARD, referrer['user_id'])
    )
    db.execute(
        "UPDATE referrals SET reward_granted = 1 WHERE id = ?",
        (referral['id'],)
    )
    db.commit()
    db.close()
    return True

# ===== API ROUTES =====

@app.route('/api/user/<user_id>', methods=['GET'])
def user_info(user_id):
    user = get_or_create_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    referral_link = f"https://t.me/{OFFICIAL_BOT_USERNAME}?start={user_id}"
    return jsonify({
        "user_id": user['user_id'],
        "username": user.get('username'),
        "points": user['points'],
        "successful_invites": user['successful_invites'],
        "referral_link": referral_link,
        "max_invites": MAX_INVITES
    })

@app.route('/api/referral/reward', methods=['POST'])
def reward_referrer():
    data = request.json
    referred_user_id = data.get('user_id')
    if not referred_user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # Επιβράβευση μόνο αν είναι η πρώτη ανάλυση
    if not is_first_analysis(referred_user_id):
        return jsonify({"success": False, "message": "Not first analysis"}), 200

    success = grant_referral_reward(referred_user_id)
    if success:
        return jsonify({"success": True, "message": "Referrer rewarded"})
    else:
        return jsonify({"success": False, "message": "No eligible referral"})

@app.route('/api/analyze', methods=['POST'])
def analyze():
    # Placeholder για την ανάλυση – αντικατέστησε με το πραγματικό AI
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    # Εδώ θα καλούσες το AI...
    result_text = "🔮 Η ανάλυσή σου από την Aziram..."

    # Σημείωση: η ανάλυση έχει ολοκληρωθεί, ενημερώνουμε τον μετρητή
    increment_analysis(user_id)

    return jsonify({
        "success": True,
        "reading": result_text
    })

# ===== MAIN =====
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

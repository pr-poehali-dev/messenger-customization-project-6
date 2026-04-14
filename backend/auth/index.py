"""
Основной обработчик авторизации Volta Messenger.
Поддерживает: регистрацию, вход, выход, верификацию OTP, восстановление пароля.
"""
import json
import os
import re
import secrets
import hashlib
import hmac
import time
from datetime import datetime, timezone, timedelta

import psycopg2
import psycopg2.extras

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p78097975_messenger_customizat")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Auth-Token, X-User-Id",
    "Access-Control-Max-Age": "86400",
}
SESSION_TTL_DAYS = 30
OTP_TTL_MINUTES = 10
MAX_LOGIN_ATTEMPTS = 5
LOCK_MINUTES = 15


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, default=str)}


def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg})}


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000)
    return f"{salt}:{h.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, h = stored.split(":", 1)
        new_h = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 260000)
        return hmac.compare_digest(h, new_h.hex())
    except Exception:
        return False


def generate_token() -> str:
    return secrets.token_urlsafe(48)


def generate_otp() -> str:
    return str(secrets.randbelow(900000) + 100000)


def check_rate_limit(conn, identifier: str, action: str, max_attempts: int = 10, window_minutes: int = 15) -> bool:
    """True = можно продолжать, False = заблокировано"""
    now = datetime.now(timezone.utc)
    window_start = now - timedelta(minutes=window_minutes)
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(
            f"SELECT * FROM {SCHEMA}.rate_limits WHERE identifier=%s AND action=%s ORDER BY id DESC LIMIT 1",
            (identifier, action)
        )
        row = cur.fetchone()
        if row:
            if row["blocked_until"] and row["blocked_until"] > now:
                return False
            if row["window_start"] > window_start:
                if row["attempts"] >= max_attempts:
                    blocked = now + timedelta(minutes=LOCK_MINUTES)
                    cur.execute(
                        f"UPDATE {SCHEMA}.rate_limits SET blocked_until=%s WHERE id=%s",
                        (blocked, row["id"])
                    )
                    conn.commit()
                    return False
                cur.execute(
                    f"UPDATE {SCHEMA}.rate_limits SET attempts=attempts+1 WHERE id=%s",
                    (row["id"],)
                )
            else:
                cur.execute(
                    f"UPDATE {SCHEMA}.rate_limits SET attempts=1, window_start=%s, blocked_until=NULL WHERE id=%s",
                    (now, row["id"])
                )
        else:
            cur.execute(
                f"INSERT INTO {SCHEMA}.rate_limits (identifier, action, attempts, window_start) VALUES (%s, %s, 1, %s)",
                (identifier, action, now)
            )
        conn.commit()
    return True


def validate_email(email: str) -> bool:
    return bool(re.match(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$", email))


def validate_phone(phone: str) -> bool:
    digits = re.sub(r"\D", "", phone)
    return 10 <= len(digits) <= 15


def validate_password(password: str) -> str | None:
    if len(password) < 8:
        return "Пароль должен содержать минимум 8 символов"
    if not re.search(r"[A-Z]", password):
        return "Пароль должен содержать хотя бы одну заглавную букву"
    if not re.search(r"[0-9]", password):
        return "Пароль должен содержать хотя бы одну цифру"
    return None


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    path = event.get("path", "/").rstrip("/") or "/"
    method = event.get("httpMethod", "GET")
    ip = event.get("requestContext", {}).get("identity", {}).get("sourceIp", "unknown")

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        body = {}

    # ── POST /register ──────────────────────────────────────────────
    if path.endswith("/register") and method == "POST":
        identifier = (body.get("email") or body.get("phone") or "").strip()
        password = body.get("password", "")
        display_name = body.get("display_name", "").strip()
        captcha_token = body.get("captcha_token", "")

        if not identifier:
            return err("Укажите email или номер телефона")
        if not display_name:
            return err("Укажите имя пользователя")
        if not captcha_token:
            return err("Пройдите проверку капчи")

        pw_err = validate_password(password)
        if pw_err:
            return err(pw_err)

        is_email = "@" in identifier
        if is_email and not validate_email(identifier):
            return err("Некорректный email-адрес")
        if not is_email and not validate_phone(identifier):
            return err("Некорректный номер телефона")

        conn = get_db()
        try:
            if not check_rate_limit(conn, ip, "register", max_attempts=5):
                return err("Слишком много попыток. Попробуйте через 15 минут", 429)

            username = re.sub(r"[^a-z0-9_]", "", (identifier.split("@")[0] if is_email else identifier).lower())[:32]
            username = username or "user"

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if is_email:
                    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email=%s", (identifier,))
                else:
                    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE phone=%s", (identifier,))
                if cur.fetchone():
                    return err("Этот аккаунт уже зарегистрован")

                # ensure unique username
                base = username
                suffix = 1
                while True:
                    cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username=%s", (username,))
                    if not cur.fetchone():
                        break
                    username = f"{base}{suffix}"
                    suffix += 1

                ph = hash_password(password)
                email_val = identifier if is_email else None
                phone_val = identifier if not is_email else None

                cur.execute(
                    f"""INSERT INTO {SCHEMA}.users (email, phone, password_hash, username, display_name)
                        VALUES (%s, %s, %s, %s, %s) RETURNING id""",
                    (email_val, phone_val, ph, username, display_name)
                )
                user_id = cur.fetchone()["id"]

                # create preferences
                cur.execute(
                    f"INSERT INTO {SCHEMA}.user_preferences (user_id) VALUES (%s)",
                    (user_id,)
                )

                # generate OTP for verification
                otp = generate_otp()
                expires = datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES)
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.otp_codes (identifier, code, purpose, expires_at)
                        VALUES (%s, %s, 'register', %s)""",
                    (identifier, otp, expires)
                )
                conn.commit()

            return ok({
                "success": True,
                "user_id": user_id,
                "identifier": identifier,
                "otp_sent": True,
                "otp_demo": otp,  # В продакшене удалить и отправить через SMS/email
                "message": f"Код подтверждения отправлен на {identifier}"
            }, 201)
        finally:
            conn.close()

    # ── POST /verify-otp ─────────────────────────────────────────────
    if path.endswith("/verify-otp") and method == "POST":
        identifier = body.get("identifier", "").strip()
        code = body.get("code", "").strip()
        purpose = body.get("purpose", "register")

        if not identifier or not code:
            return err("Укажите идентификатор и код")

        conn = get_db()
        try:
            if not check_rate_limit(conn, identifier, f"otp_{purpose}", max_attempts=5):
                return err("Слишком много попыток ввода кода", 429)

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    f"""SELECT * FROM {SCHEMA}.otp_codes
                        WHERE identifier=%s AND purpose=%s AND used=FALSE
                        ORDER BY id DESC LIMIT 1""",
                    (identifier, purpose)
                )
                otp_row = cur.fetchone()
                if not otp_row:
                    return err("Код не найден или уже использован")

                now = datetime.now(timezone.utc)
                if otp_row["expires_at"] < now:
                    return err("Код истёк. Запросите новый")

                cur.execute(
                    f"UPDATE {SCHEMA}.otp_codes SET attempts=attempts+1 WHERE id=%s",
                    (otp_row["id"],)
                )
                if otp_row["attempts"] >= otp_row["max_attempts"]:
                    return err("Превышено количество попыток. Запросите новый код")

                if otp_row["code"] != code:
                    conn.commit()
                    return err(f"Неверный код. Попыток осталось: {otp_row['max_attempts'] - otp_row['attempts'] - 1}")

                cur.execute(
                    f"UPDATE {SCHEMA}.otp_codes SET used=TRUE WHERE id=%s",
                    (otp_row["id"],)
                )

                if purpose == "register":
                    is_email = "@" in identifier
                    if is_email:
                        cur.execute(
                            f"UPDATE {SCHEMA}.users SET is_verified=TRUE WHERE email=%s RETURNING id, username, display_name",
                            (identifier,)
                        )
                    else:
                        cur.execute(
                            f"UPDATE {SCHEMA}.users SET is_verified=TRUE WHERE phone=%s RETURNING id, username, display_name",
                            (identifier,)
                        )
                    user = cur.fetchone()
                    if not user:
                        return err("Пользователь не найден")

                    token = generate_token()
                    expires = now + timedelta(days=SESSION_TTL_DAYS)
                    cur.execute(
                        f"""INSERT INTO {SCHEMA}.sessions (user_id, token, ip_address, expires_at)
                            VALUES (%s, %s, %s, %s)""",
                        (user["id"], token, ip, expires)
                    )
                    conn.commit()
                    return ok({"success": True, "token": token, "user": dict(user)})

                conn.commit()
                return ok({"success": True, "verified": True})
        finally:
            conn.close()

    # ── POST /login ───────────────────────────────────────────────────
    if path.endswith("/login") and method == "POST":
        identifier = (body.get("email") or body.get("phone") or "").strip()
        password = body.get("password", "")
        captcha_token = body.get("captcha_token", "")

        if not identifier or not password:
            return err("Укажите логин и пароль")
        if not captcha_token:
            return err("Пройдите проверку капчи")

        conn = get_db()
        try:
            if not check_rate_limit(conn, ip, "login", max_attempts=10):
                return err("Слишком много попыток входа. Попробуйте через 15 минут", 429)

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                is_email = "@" in identifier
                if is_email:
                    cur.execute(f"SELECT * FROM {SCHEMA}.users WHERE email=%s", (identifier,))
                else:
                    cur.execute(f"SELECT * FROM {SCHEMA}.users WHERE phone=%s", (identifier,))
                user = cur.fetchone()

                if not user:
                    return err("Неверный логин или пароль")

                now = datetime.now(timezone.utc)

                if user["locked_until"] and user["locked_until"] > now:
                    remaining = int((user["locked_until"] - now).total_seconds() // 60)
                    return err(f"Аккаунт временно заблокирован. Попробуйте через {remaining} мин.", 403)

                if not verify_password(password, user["password_hash"]):
                    attempts = user["failed_login_attempts"] + 1
                    locked = None
                    if attempts >= MAX_LOGIN_ATTEMPTS:
                        locked = now + timedelta(minutes=LOCK_MINUTES)
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET failed_login_attempts=%s, locked_until=%s WHERE id=%s",
                        (attempts, locked, user["id"])
                    )
                    conn.commit()
                    left = MAX_LOGIN_ATTEMPTS - attempts
                    msg = f"Неверный пароль. Осталось попыток: {max(0, left)}"
                    if attempts >= MAX_LOGIN_ATTEMPTS:
                        msg = f"Аккаунт заблокирован на {LOCK_MINUTES} минут из-за множества неверных попыток"
                    return err(msg, 401)

                if not user["is_active"]:
                    return err("Аккаунт деактивирован", 403)

                cur.execute(
                    f"UPDATE {SCHEMA}.users SET failed_login_attempts=0, locked_until=NULL WHERE id=%s",
                    (user["id"],)
                )

                token = generate_token()
                expires = now + timedelta(days=SESSION_TTL_DAYS)
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.sessions (user_id, token, ip_address, expires_at)
                        VALUES (%s, %s, %s, %s)""",
                    (user["id"], token, ip, expires)
                )
                conn.commit()

            return ok({
                "success": True,
                "token": token,
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "display_name": user["display_name"],
                    "email": user["email"],
                    "phone": user["phone"],
                    "avatar_color": user["avatar_color"],
                    "is_verified": user["is_verified"],
                }
            })
        finally:
            conn.close()

    # ── POST /send-otp ────────────────────────────────────────────────
    if path.endswith("/send-otp") and method == "POST":
        identifier = body.get("identifier", "").strip()
        purpose = body.get("purpose", "reset_password")

        if not identifier:
            return err("Укажите email или телефон")

        conn = get_db()
        try:
            if not check_rate_limit(conn, identifier, f"send_otp_{purpose}", max_attempts=3, window_minutes=60):
                return err("Слишком много запросов кода. Подождите час", 429)

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if purpose == "reset_password":
                    is_email = "@" in identifier
                    if is_email:
                        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email=%s AND is_active=TRUE", (identifier,))
                    else:
                        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE phone=%s AND is_active=TRUE", (identifier,))
                    if not cur.fetchone():
                        # Не раскрываем существование аккаунта
                        return ok({"success": True, "message": "Если аккаунт существует, код будет отправлен"})

                otp = generate_otp()
                expires = datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES)
                cur.execute(
                    f"""INSERT INTO {SCHEMA}.otp_codes (identifier, code, purpose, expires_at)
                        VALUES (%s, %s, %s, %s)""",
                    (identifier, otp, purpose, expires)
                )
                conn.commit()

            return ok({
                "success": True,
                "otp_demo": otp,  # В продакшене — удалить, отправлять через провайдер
                "message": f"Код отправлен на {identifier}"
            })
        finally:
            conn.close()

    # ── POST /reset-password ──────────────────────────────────────────
    if path.endswith("/reset-password") and method == "POST":
        identifier = body.get("identifier", "").strip()
        code = body.get("code", "").strip()
        new_password = body.get("new_password", "")
        captcha_token = body.get("captcha_token", "")

        if not all([identifier, code, new_password]):
            return err("Заполните все поля")
        if not captcha_token:
            return err("Пройдите проверку капчи")

        pw_err = validate_password(new_password)
        if pw_err:
            return err(pw_err)

        conn = get_db()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    f"""SELECT * FROM {SCHEMA}.otp_codes
                        WHERE identifier=%s AND purpose='reset_password' AND used=FALSE
                        ORDER BY id DESC LIMIT 1""",
                    (identifier,)
                )
                otp_row = cur.fetchone()
                if not otp_row or otp_row["expires_at"] < datetime.now(timezone.utc):
                    return err("Код недействителен или истёк")
                if otp_row["code"] != code:
                    return err("Неверный код")

                cur.execute(
                    f"UPDATE {SCHEMA}.otp_codes SET used=TRUE WHERE id=%s",
                    (otp_row["id"],)
                )
                ph = hash_password(new_password)
                is_email = "@" in identifier
                if is_email:
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET password_hash=%s, failed_login_attempts=0, locked_until=NULL WHERE email=%s",
                        (ph, identifier)
                    )
                else:
                    cur.execute(
                        f"UPDATE {SCHEMA}.users SET password_hash=%s, failed_login_attempts=0, locked_until=NULL WHERE phone=%s",
                        (ph, identifier)
                    )
                conn.commit()

            return ok({"success": True, "message": "Пароль успешно изменён"})
        finally:
            conn.close()

    # ── GET /me ───────────────────────────────────────────────────────
    if path.endswith("/me") and method == "GET":
        token = event.get("headers", {}).get("X-Auth-Token", "")
        if not token:
            return err("Не авторизован", 401)

        conn = get_db()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                now = datetime.now(timezone.utc)
                cur.execute(
                    f"""SELECT u.*, p.accent_color, p.font_size, p.bubble_style, p.app_icon,
                               p.compact_mode, p.animations_enabled, p.theme
                        FROM {SCHEMA}.sessions s
                        JOIN {SCHEMA}.users u ON u.id = s.user_id
                        LEFT JOIN {SCHEMA}.user_preferences p ON p.user_id = u.id
                        WHERE s.token=%s AND s.expires_at > %s AND u.is_active=TRUE""",
                    (token, now)
                )
                user = cur.fetchone()
                if not user:
                    return err("Сессия истекла или недействительна", 401)

            return ok({
                "id": user["id"],
                "username": user["username"],
                "display_name": user["display_name"],
                "email": user["email"],
                "phone": user["phone"],
                "avatar_color": user["avatar_color"],
                "bio": user["bio"],
                "is_verified": user["is_verified"],
                "preferences": {
                    "accent_color": user["accent_color"],
                    "font_size": user["font_size"],
                    "bubble_style": user["bubble_style"],
                    "app_icon": user["app_icon"],
                    "compact_mode": user["compact_mode"],
                    "animations_enabled": user["animations_enabled"],
                    "theme": user["theme"],
                }
            })
        finally:
            conn.close()

    # ── POST /logout ──────────────────────────────────────────────────
    if path.endswith("/logout") and method == "POST":
        token = event.get("headers", {}).get("X-Auth-Token", "")
        if not token:
            return ok({"success": True})
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at=NOW() WHERE token=%s", (token,))
                conn.commit()
        finally:
            conn.close()
        return ok({"success": True})

    # ── PUT /preferences ──────────────────────────────────────────────
    if path.endswith("/preferences") and method == "PUT":
        token = event.get("headers", {}).get("X-Auth-Token", "")
        if not token:
            return err("Не авторизован", 401)

        conn = get_db()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    f"SELECT user_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at>NOW()",
                    (token,)
                )
                sess = cur.fetchone()
                if not sess:
                    return err("Не авторизован", 401)
                uid = sess["user_id"]

                allowed = ["accent_color", "font_size", "bubble_style", "app_icon", "compact_mode", "animations_enabled", "theme"]
                updates = {k: v for k, v in body.items() if k in allowed}
                if not updates:
                    return err("Нет данных для обновления")

                set_parts = ", ".join(f"{k}=%s" for k in updates)
                values = list(updates.values()) + [uid]
                cur.execute(
                    f"UPDATE {SCHEMA}.user_preferences SET {set_parts}, updated_at=NOW() WHERE user_id=%s",
                    values
                )
                conn.commit()

            return ok({"success": True, "updated": updates})
        finally:
            conn.close()

    return err("Маршрут не найден", 404)

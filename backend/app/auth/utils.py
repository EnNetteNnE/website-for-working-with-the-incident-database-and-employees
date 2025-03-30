from werkzeug.security import check_password_hash, generate_password_hash

def validate_login(login: str, password: str) -> str:
    if not login or not password:
        return "Login and password are required"
    if len(login) < 3:
        return "Login must be at least 3 characters long"
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    return ""

def validate_password_change(old_password: str, new_password: str) -> str:
    if not old_password or not new_password:
        return "Both old and new passwords are required"
    if len(new_password) < 8:
        return "New password must be at least 8 characters long"
    if old_password == new_password:
        return "New password must be different from the old one"
    return ""
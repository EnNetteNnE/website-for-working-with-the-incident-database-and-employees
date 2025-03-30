def validate_employee_data(data: dict) -> str:
    required_fields = ['firstName', 'lastName', 'accessRightId', 'login', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"{field} is required"
    
    if not isinstance(data['accessRightId'], int) or data['accessRightId'] < 1 or data['accessRightId'] > 4:
        return "Invalid access right ID (must be 1-4)"
    
    if len(data['login']) < 3:
        return "Login must be at least 3 characters long"
    
    if len(data['password']) < 8:
        return "Password must be at least 8 characters long"
    
    return ""

def validate_access_change(employee_id: int, new_access_right_id: int) -> str:
    if not isinstance(employee_id, int) or employee_id < 1:
        return "Invalid employee ID"
    
    if not isinstance(new_access_right_id, int) or new_access_right_id < 1 or new_access_right_id > 4:
        return "Invalid access right ID (must be 1-4)"
    
    return ""
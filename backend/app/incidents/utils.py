def validate_incident_data(data: dict) -> str:
    required_fields = ['title', 'description', 'securityLevel']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"{field} is required"
    
    if not isinstance(data['securityLevel'], int) or data['securityLevel'] < 1 or data['securityLevel'] > 3:
        return "Invalid security level (must be 1-3)"
    
    return ""

def validate_comment_data(data: dict) -> str:
    if 'text' not in data or not data['text']:
        return "Comment text is required"
    
    if len(data['text']) > 1000:
        return "Comment is too long (max 1000 characters)"
    
    return ""
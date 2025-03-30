from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import timedelta
from ..models.employee import Employee, AuthInfo
from ..models.token import Token
from ..models.db import db
from .utils import validate_login, validate_password_change
import secrets

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'login' not in data or 'password' not in data:
            return jsonify({'message': 'Login and password are required'}), 400
        
        login = data['login']
        password = data['password']
        
        validation_error = validate_login(login, password)
        if validation_error:
            return jsonify({'message': validation_error}), 400
        
        auth_info = AuthInfo.query.filter_by(login=login).first()
        if not auth_info:
            return jsonify({'message': 'Invalid login or password'}), 401
        
        if not check_password_hash(auth_info.password_hash, password):
            return jsonify({'message': 'Invalid login or password'}), 401

        
        employee = Employee.query.get(auth_info.employee_id)
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        
        access_token = create_access_token(
            identity=str(employee.id),  
            additional_claims={
                'permission_level': employee.access_right.permission_level,
                'first_name': employee.first_name,
                'last_name': employee.last_name
            },
            expires_delta=timedelta(hours=1)
        )
        
        token_entry = Token(token=access_token, employee_id=employee.id)
        db.session.add(token_entry)
        db.session.commit()


        response_data = {
            'message': 'Login successful',
            'employeeId': employee.id,
            'permissionLevel': employee.access_right.permission_level,
            'firstName': employee.first_name,
            'lastName': employee.last_name,
            'token': access_token
        }
        
        response = make_response(jsonify(response_data))
        set_access_cookies(response, access_token)
        
        return response, 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        token = request.cookies.get('access_token_cookie') or request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'message': 'No token provided'}), 401
        
        token_entry = Token.query.filter_by(token=token).first()
        if token_entry:
            db.session.delete(token_entry)
            db.session.commit()
        
        response = jsonify({'message': 'Logout successful'})
        unset_jwt_cookies(response)
        
        return response, 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:

        current_user = get_jwt_identity()
        data = request.get_json()

        
        if not data or 'oldPassword' not in data or 'newPassword' not in data:
            return jsonify({'message': 'Old and new passwords are required'}), 400
        
        old_password = data['oldPassword']
        new_password = data['newPassword']

        validation_error = validate_password_change(old_password, new_password)
        if validation_error:
            return jsonify({'message': validation_error}), 400



        employee_id = get_jwt_identity()  
        employee_id_int = int(employee_id)       
        auth_info = AuthInfo.query.filter_by(employee_id=employee_id_int).first()

        
        if not auth_info:
            return jsonify({'message': 'User not found'}), 404

        if not check_password_hash(auth_info.password_hash, old_password):
            return jsonify({'message': 'Invalid old password'}), 401

        auth_info.password_hash = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
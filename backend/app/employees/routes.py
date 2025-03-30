from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from datetime import datetime
from ..models.employee import Employee, AuthInfo, AccessRight
from ..models.db import db
from .utils import validate_employee_data, validate_access_change

employees_bp = Blueprint('employees', __name__)

@employees_bp.route('/add', methods=['PUT'])
@jwt_required()
def add_employee():
    try:
        employee_id = get_jwt_identity()  
   
        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level != 4:
            return jsonify({'message': 'Admin access required'}), 403
        

        data = request.get_json()
 
        validation_error = validate_employee_data(data)
        if validation_error:
            return jsonify({'message': validation_error}), 400

        new_employee = Employee(
            first_name=data['firstName'],
            last_name=data['lastName'],
            access_right_id=data['accessRightId']
        )
        db.session.add(new_employee)
        db.session.flush()  

        new_auth_info = AuthInfo(
            login=data['login'],
            password_hash=generate_password_hash(data['password']),
            employee_id=new_employee.id
        )
        db.session.add(new_auth_info)

        db.session.commit()

        return jsonify({
            'message': 'Employee added successfully',
            'employeeId': new_employee.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/change-access', methods=['POST'])
@jwt_required()
def change_employee_access():
    try:
        employee_id = get_jwt_identity()  

        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level != 4:
            return jsonify({'message': 'Admin access required'}), 403
        
        
        data = request.get_json()
        
        if not data or 'employeeId' not in data or 'newAccessRightId' not in data:
            return jsonify({'message': 'Employee ID and new access right ID are required'}), 400
        
        employee_id = data['employeeId']
        new_access_right_id = data['newAccessRightId']
        
        validation_error = validate_access_change(employee_id, new_access_right_id)
        if validation_error:
            return jsonify({'message': validation_error}), 400
        
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        employee.access_right_id = new_access_right_id
        db.session.commit()
        
        return jsonify({'message': 'Employee access updated successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_employee_password():
    try:
        employee_id = get_jwt_identity()  

        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level != 4:
            return jsonify({'message': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not data or 'employeeLogin' not in data or 'newPassword' not in data:
            return jsonify({'message': 'Employee login and new password are required'}), 400
        
        login = data['employeeLogin']
        new_password = data['newPassword']
        

        if len(new_password) < 8:
            return jsonify({'message': 'Password must be at least 8 characters long'}), 400
        

        auth_info = AuthInfo.query.filter_by(login=login).first()
        if not auth_info:
            return jsonify({'message': 'Employee not found'}), 404
        

        auth_info.password_hash = generate_password_hash(new_password)
        db.session.commit()
        
        return jsonify({'message': 'Employee password updated successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@employees_bp.route('/list', methods=['GET'])
@jwt_required()
def list_employees():
    try:
        employee_id = get_jwt_identity()  

        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level != 4:
            return jsonify({'message': 'Admin access required'}), 403
        
        employees = Employee.query.join(AccessRight).filter(
            AccessRight.permission_level.between(1, 3)
        ).all()
        
        employees_data = [{
            'id': emp.id,
            'firstName': emp.first_name,
            'lastName': emp.last_name,
            'accessRightId': emp.access_right_id,
            'permissionLevel': emp.access_right.permission_level
        } for emp in employees]
        
        return jsonify(employees_data), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
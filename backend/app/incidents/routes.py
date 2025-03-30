from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from ..models.incident import Incident, Comment
from ..models.employee import Employee
from ..models.db import db
from .utils import validate_incident_data, validate_comment_data

incidents_bp = Blueprint('incidents', __name__)

@incidents_bp.route('/add', methods=['PUT'])
@jwt_required()
def add_incident():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()


        validation_error = validate_incident_data(data)
        if validation_error:
            return jsonify({'message': validation_error}), 400

        employee_id = get_jwt_identity()  

        new_incident = Incident(
            title=data['title'],
            description=data['description'],
            status='open',
            created_by=employee_id,
            security_level=data['securityLevel']
        )

        db.session.add(new_incident)
        db.session.commit()
        
        return jsonify({
            'message': 'Incident added successfully',
            'incidentId': new_incident.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@incidents_bp.route('/list', methods=['GET'])
@jwt_required()
def list_incidents():
    try:
        employee_id = get_jwt_identity()  

        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        incidents = Incident.query.filter(
            Incident.security_level <= employee.access_right.permission_level
        ).order_by(Incident.created_at.desc()).all()
        
        incidents_data = []
        for incident in incidents:
            creator = Employee.query.get(incident.created_by)
            closer = Employee.query.get(incident.closed_by) if incident.closed_by else None
            
            incidents_data.append({
                'id': incident.id,
                'title': incident.title,
                'status': incident.status,
                'securityLevel': incident.security_level,
                'createdAt': incident.created_at.isoformat(),
                'createdBy': f"{creator.first_name} {creator.last_name}",
                'closedAt': incident.closed_at.isoformat() if incident.closed_at else None,
                'closedBy': f"{closer.first_name} {closer.last_name}" if closer else None
            })
        
        return jsonify(incidents_data), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@incidents_bp.route('/<int:incident_id>', methods=['GET'])
@jwt_required()
def get_incident(incident_id):
    try:
        employee_id = get_jwt_identity()  
        
        incident = Incident.query.get(incident_id)
        if not incident:
            return jsonify({'message': 'Incident not found'}), 404
        
        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level < incident.security_level:
            return jsonify({'message': 'Unauthorized'}), 403
        
        creator = Employee.query.get(incident.created_by)
        closer = Employee.query.get(incident.closed_by) if incident.closed_by else None
        
        comments = Comment.query.filter_by(incident_id=incident_id).order_by(Comment.created_at.asc()).all()
        comments_data = []
        for comment in comments:
            comment_author = Employee.query.get(comment.employee_id)
            comments_data.append({
                'id': comment.id,
                'text': comment.comment_text,
                'createdAt': comment.created_at.isoformat(),
                'author': f"{comment_author.first_name} {comment_author.last_name}"
            })
        
        return jsonify({
            'id': incident.id,
            'title': incident.title,
            'description': incident.description,
            'status': incident.status,
            'securityLevel': incident.security_level,
            'createdAt': incident.created_at.isoformat(),
            'createdBy': f"{creator.first_name} {creator.last_name}",
            'closedAt': incident.closed_at.isoformat() if incident.closed_at else None,
            'closedBy': f"{closer.first_name} {closer.last_name}" if closer else None,
            'comments': comments_data
        }), 200
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@incidents_bp.route('/<int:incident_id>/comment', methods=['PUT'])
@jwt_required()
def add_comment(incident_id):
    try:
        employee_id = get_jwt_identity() 
        data = request.get_json()
        
        validation_error = validate_comment_data(data)
        if validation_error:
            return jsonify({'message': validation_error}), 400
        
        incident = Incident.query.get(incident_id)
        if not incident:
            return jsonify({'message': 'Incident not found'}), 404
        if incident.status != 'open':
            return jsonify({'message': 'Cannot add comment to closed incident'}), 400
        
        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level < incident.security_level:
            return jsonify({'message': 'Unauthorized'}), 403
        
        new_comment = Comment(
            comment_text=data['text'],
            incident_id=incident_id,
            employee_id=employee_id
        )
        db.session.add(new_comment)
        db.session.commit()
        
        return jsonify({'message': 'Comment added successfully'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@incidents_bp.route('/<int:incident_id>/close', methods=['POST'])
@jwt_required()
def close_incident(incident_id):
    try:
        employee_id = get_jwt_identity()  
        
        incident = Incident.query.get(incident_id)
        if not incident:
            return jsonify({'message': 'Incident not found'}), 404
        
        if incident.status == 'closed':
            return jsonify({'message': 'Incident is already closed'}), 400
        
        employee = Employee.query.get(employee_id)
        if not employee or employee.access_right.permission_level < incident.security_level:
            return jsonify({'message': 'Unauthorized'}), 403
        
        incident.status = 'closed'
        incident.closed_at = datetime.utcnow()
        incident.closed_by = employee_id
        db.session.commit()
        
        return jsonify({'message': 'Incident closed successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@incidents_bp.route('/<int:incident_id>', methods=['DELETE'])
@jwt_required()
def delete_incident(incident_id):
    try:
        employee_id = get_jwt_identity()
        
        incident = Incident.query.get(incident_id)
        if not incident:
            return jsonify({'message': 'Incident not found'}), 404
        
        employee = Employee.query.get(employee_id)
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        db.session.delete(incident)
        db.session.commit()
        
        return jsonify({'message': 'Incident deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500
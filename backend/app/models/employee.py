from .. import db

class AccessRight(db.Model):
    __tablename__ = 'access_rights'
    
    id = db.Column(db.Integer, primary_key=True)
    permission_level = db.Column(db.Integer, unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    
    employees = db.relationship('Employee', backref='access_right', lazy=True)

class Employee(db.Model):
    __tablename__ = 'employees'
    
    id = db.Column(db.Integer, primary_key=True)
    last_name = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    access_right_id = db.Column(db.Integer, db.ForeignKey('access_rights.id'), nullable=False)
    
    auth_info = db.relationship('AuthInfo', backref='employee', uselist=False, lazy=True)
    created_incidents = db.relationship('Incident', foreign_keys='Incident.created_by', backref='creator', lazy=True)
    closed_incidents = db.relationship('Incident', foreign_keys='Incident.closed_by', backref='closer', lazy=True)
    comments = db.relationship('Comment', backref='author', lazy=True)

class AuthInfo(db.Model):
    __tablename__ = 'auth_info'
    
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), unique=True, nullable=False)
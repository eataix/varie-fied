from flask import url_for
from . import db
from datetime import datetime
from sqlalchemy.orm import backref
from app.exceptions import ValidationError
import arrow


class Project(db.Model):
    __tablename__ = 'projects'
    pid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    active = db.Column(db.Boolean, default=True)
    variations = db.relationship('Variation', backref=backref('project', order_by='Variation.timestamp'),
                                 cascade="all, delete-orphan")

    timestamp = db.Column(db.DateTime, default=datetime.utcnow())

    def __repr__(self):
        return u'<Project Name: {0}, Active: {1}>'.format(self.name, self.active)

    def to_json(self):
        json_project = {
            'url': url_for('api.get_project', project_id=self.pid, _external=True),
            'name': self.name,
            'active': self.active,
            'variations': url_for('api.get_project_variations', project_id=self.pid, _external=True),
        }
        return json_project

    @staticmethod
    def from_json(json_project):
        name = json_project.get('name')
        if name is None or name == '':
            raise ValidationError('project does not have a name')
        return Project(name=name)


class Variation(db.Model):
    __tablename__ = 'variations'
    vid = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow())
    subcontractor = db.Column(db.String(64), default="")
    invoice_no = db.Column(db.String(64), nullable=True)
    description = db.Column(db.Text, nullable=True)
    amount = db.Column(db.Float, default=0.0)
    pending = db.Column(db.Boolean, default=True)
    approved = db.Column(db.Boolean, default=False)
    declined = db.Column(db.Boolean, default=False)
    completed = db.Column(db.Boolean, default=False)
    note = db.Column(db.Text, nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.pid'))

    timestamp = db.Column(db.DateTime, default=datetime.utcnow())

    def to_json(self):
        json_variation = {
            'vid': self.vid,
            'url': url_for('api.get_variation', variation_id=self.vid, _external=True),
            'date': self.date,
            'subcontractor': self.subcontractor,
            'invoice_no': self.invoice_no,
            'description': self.description,
            'amount': self.amount,
            'pending': self.pending,
            'approved': self.approved,
            'declined': self.declined,
            'completed': self.completed,
            'note': self.note,
            'project_id': url_for('api.get_project', project_id=self.project_id, _external=True),
        }
        return json_variation

    @staticmethod
    def from_json(json_variation):
        date = arrow.get(json_variation.get('date')).datetime
        subcontractor = json_variation.get('subcontractor')
        invoice_no = json_variation.get('invoice_no')
        description = json_variation.get('description')
        amount = json_variation.get('amount')
        pending = json_variation.get('pending', True)
        approved = json_variation.get('approved', False)
        declined = json_variation.get('declined', False)
        completed = json_variation.get('completed', False)
        note = json_variation.get('note', "")
        project = Project.query.get_or_404(int(json_variation.get('project_id')))

        return Variation(date=date, subcontractor=subcontractor, invoice_no=invoice_no, description=description,
                         amount=amount, pending=pending, approved=approved, declined=declined, completed=completed,
                         note=note, project=project)

from flask.ext.wtf import Form
from wtforms import StringField, SubmitField, TextAreaField, SelectField, DateTimeField, FloatField
from wtforms.validators import DataRequired


class NameForm(Form):
    name = StringField('What is your name?', validators=[DataRequired()])
    text = TextAreaField('Text')
    submit = SubmitField('Submit')


class ProjectForm(Form):
    name = StringField('Project name', validators=[DataRequired()])
    submit = SubmitField('Submit')


class VariationForm(Form):
    project = SelectField('Project', coerce=int, choices=[])
    date = DateTimeField('Time')
    subcontractor = StringField('Subcontractor')
    invoiceNo = StringField('invoice number')
    description = StringField('description')
    amount = FloatField('description')
    submit = SubmitField('Submit')

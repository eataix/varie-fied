from flask import url_for
from . import db
from datetime import datetime
from app.exceptions import ValidationError
import arrow


class Project(db.Model):
    __tablename__ = 'projects'
    pid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    margin = db.Column(db.Float, nullable=False)
    active = db.Column(db.Boolean, default=True)
    admin_fee = db.Column(db.Float, nullable=True)
    variations = db.relationship('Variation', backref='project', cascade="all, delete-orphan")

    def __repr__(self):
        return u'<Project Name: {}, Active: {}, Margin: {}>'.format(self.name, self.active, self.margin)

    def to_json(self):
        json_project = {
            'name': self.name,
            'active': self.active,
            'margin': self.margin,
            'admin_fee': self.admin_fee,
            'variations': url_for('api.get_project_variations', project_id=self.pid, _external=True),
            'url': url_for('api.get_project', project_id=self.pid, _external=True),
        }
        return json_project

    @staticmethod
    def from_json(json_project):
        name = json_project.get('name')
        margin = json_project.get('margin')
        admin_fee = json_project.get('admin_fee')
        if name is None or name == '':
            raise ValidationError('project does not have a name')
        return Project(name=name, margin=margin, admin_fee=admin_fee)

    def export(self):
        from openpyxl import Workbook
        from openpyxl.styles import Alignment, Border, Font, Side
        wb = Workbook()
        ws = wb.active

        ws['A1'] = 'NO.'
        ws['A1'].font = Font(bold=True)
        ws['A1'].alignment = Alignment(horizontal='center')

        ws['B1'] = 'ITEM'
        ws['B1'].font = Font(bold=True)
        ws['B1'].alignment = Alignment(horizontal='center')

        ws['C1'] = 'PENDING'
        ws['C1'].font = Font(bold=True)
        ws['C1'].alignment = Alignment(horizontal='center')

        ws['D1'] = 'APPROVED'
        ws['D1'].font = Font(bold=True)
        ws['D1'].alignment = Alignment(horizontal='center')

        ws['E1'] = 'COMPLETED'
        ws['E1'].font = Font(bold=True)
        ws['E1'].alignment = Alignment(horizontal='center')

        self.variations.sort(key=lambda v: v.vid)

        idx = 2
        for variation in self.variations:
            column = None
            if variation.pending:
                column = 'C'
            elif variation.approved:
                column = 'D'
            elif variation.declined:
                column = 'C'
            cell = ws[column + str(idx)]
            cell.value = variation.amount
            cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

            if variation.completed:
                column = 'E'
                cell = ws[column + str(idx)]
                cell.value = variation.amount
                cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

            cell = ws['A' + str(idx)]
            cell.value = idx - 2
            cell.font = Font(bold=True)
            cell.alignment = Alignment(horizontal='center')
            cell = ws['B' + str(idx)]
            cell.value = variation.description

            idx += 1

        ws.merge_cells('A{}:B{}'.format(idx, idx))

        ws['A{}'.format(idx)].value = 'TOTALS'
        ws['A{}'.format(idx)].font = Font(bold=True)
        ws['A{}'.format(idx)].alignment = Alignment(horizontal='center')

        ws['C{}'.format(idx)].value = '=SUM(C2:C{})'.format(idx - 1)
        ws['C{}'.format(idx)].font = Font(bold=True)
        ws['C{}'.format(idx)].number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        ws['D{}'.format(idx)].value = '=SUM(D2:D{})'.format(idx - 1)
        ws['D{}'.format(idx)].font = Font(bold=True)
        ws['D{}'.format(idx)].number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        ws['E{}'.format(idx)].value = '=SUM(E2:E{})'.format(idx - 1)
        ws['E{}'.format(idx)].font = Font(bold=True)
        ws['E{}'.format(idx)].number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        for idx, variation in enumerate(self.variations):
            ws = wb.create_sheet()
            ws.title = 'V' + str(idx + 1)
            ws.merge_cells('B1:G1')
            ws['B1'].value = variation.description
            ws['B1'].font = Font(bold=True)

            row_index = 2
            for item in variation.items:
                ws.merge_cells('B{}:G{}'.format(row_index, row_index))
                ws['B' + str(row_index)].value = item.description
                ws['H' + str(row_index)].value = item.amount
                row_index += 1

            for column in 'BCDEFGH':
                ws[column + str(row_index)].border = Border(bottom=Side(border_style='medium', color='FF000000'))
            row_index += 1

            ws.merge_cells('B{}:C{}'.format(row_index, row_index))
            ws['B' + str(row_index)].value = 'Value of work'
            ws['H' + str(row_index)].value = '=SUM(H1:H{})'.format(row_index - 1)
            row_index += 1

            ws.merge_cells('B{}:C{}'.format(row_index, row_index))
            ws['B' + str(row_index)] = 'Add OH/Profit ' + str(self.margin * 100) + r'%'
            ws['H' + str(row_index)] = '=H{} * {}'.format(row_index - 1, self.margin)
            row_index += 1

            if self.admin_fee is not None:
                ws.merge_cells('B{}:C{}'.format(row_index, row_index))
                ws['B' + str(row_index)] = 'Fixed administration fee'
                ws['H' + str(row_index)] = self.admin_fee
                row_index += 1

            ws.merge_cells('B{}:C{}'.format(row_index, row_index))
            ws['B' + str(row_index)] = 'Subtotal'
            if self.admin_fee is None:
                ws['H' + str(row_index)] = '=H{} + H{}'.format(row_index - 2, row_index - 1)
            else:
                ws['H' + str(row_index)] = '=H{} + H{} + H{}'.format(row_index - 3, row_index - 2, row_index - 1)
            ws['H' + str(row_index)].font = Font(bold=True)
            row_index += 1

            ws.merge_cells('B{}:C{}'.format(row_index, row_index))
            ws['B' + str(row_index)] = 'Add GST'
            ws['H' + str(row_index)].value = '=H{} * 0.1'.format(row_index - 1)
            ws['H' + str(row_index)].font = Font(underline='singleAccounting')
            for column in 'BCDEFGH':
                ws[column + str(row_index)].border = Border(bottom=Side(border_style='medium', color='FF000000'))
            row_index += 1

            ws.merge_cells('B{}:C{}'.format(row_index, row_index))
            ws['B' + str(row_index)] = 'TOTAL'
            ws['H' + str(row_index)].value = '=H{} + H{}'.format(row_index - 1, row_index - 2)
            ws['H' + str(row_index)].font = Font(bold=True)
            row_index += 1

            for iidex in range(2, row_index):
                cell = ws['H' + str(iidex)]
                cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        fn = self.name + '.xlsx'
        wb.save('generated/' + fn)
        return fn


class Variation(db.Model):
    __tablename__ = 'variations'
    vid = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, default=datetime.utcnow())
    subcontractor = db.Column(db.String(64), default="")
    invoice_no = db.Column(db.String(64), nullable=True)
    description = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Float, default=0.0)
    pending = db.Column(db.Boolean, default=True)
    approved = db.Column(db.Boolean, default=False)
    declined = db.Column(db.Boolean, default=False)
    completed = db.Column(db.Boolean, default=False)
    note = db.Column(db.Text, nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.pid'))

    items = db.relationship('Item', backref='variation', cascade="all, delete-orphan")

    def __repr__(self):
        return u'<Variation Id: {}, Project id: {}, Description: {}, Amount: {}, Subcontractor: {}>'.format(self.vid,
                                                                                                            self.project_id,
                                                                                                            self.description,
                                                                                                            self.amount,
                                                                                                            self.subcontractor)

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
            'items': url_for('api.get_variation_items', variation_id=self.vid, _external=True),
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


class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)

    variation_id = db.Column(db.Integer, db.ForeignKey('variations.vid'))

    def __repr__(self):
        return u'<Item Id: {}, Variation: {}, Amount: {}, Description: {}>'.format(self.id, self.variation_id,
                                                                                   self.amount, self.description)

    def to_json(self):
        return {
            "id": self.id,
            "variation_id": self.variation_id,
            "amount": self.amount,
            "description": self.description,
            'url': url_for('api.get_item', item_id=self.id, _external=True)
        }

    @staticmethod
    def from_json(json):
        variation = Variation.query.get_or_404(int(json.get('variation_id')))
        amount = json.get('amount')
        description = json.get('description')
        return Item(variation=variation, amount=amount, description=description)

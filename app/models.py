from flask import url_for
from . import db
from datetime import datetime
from app.exceptions import ValidationError
import arrow


class Project(db.Model):
    __tablename__ = 'projects'
    pid = db.Column(db.Integer, primary_key=True)
    reference_number = db.Column(db.String, nullable=False)
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
            'reference_number': self.reference_number,
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
        reference_number = json_project.get('reference_number')
        margin = json_project.get('margin')
        admin_fee = json_project.get('admin_fee')
        if name is None or name == '':
            raise ValidationError('project does not have a name')
        return Project(name=name, margin=margin, admin_fee=admin_fee, reference_number=reference_number)

    def export(self):
        def cm_to_inch(cm: float):
            return cm * 0.393701

        def prepare(worksheet):
            """
            :type worksheet : openpyxl.worksheet.Worksheet
            """
            worksheet.header_footer.setHeader(
                '&L&"Calibri,Regular"&K000000&G&C&"Lao UI,Bold"&8Total Project Construction Pty. Ltd.&"Lao UI,Regular"&K000000_x000D_ACN 117 578 560  ABN 84 117 578 560_x000D_PO Box 313 HALL ACT_x000D_P: 02-6230 2455   F:02-6230 2488_x000D_E: troy@totalproject.com.au')
            worksheet.header_footer.setFooter(
                '&L&"Arial,Italic"&9&K000000App. A - Contract Variations&R&"Arial,Italic"&9&K000000{}'.format(
                    self.name))
            worksheet.page_margins.top = cm_to_inch(3.4)
            worksheet.page_margins.bottom = cm_to_inch(2)
            worksheet.page_margins.left = cm_to_inch(1.2)
            worksheet.page_margins.right = cm_to_inch(1.1)

        from openpyxl import Workbook
        from openpyxl.styles import Alignment, Border, Color, Font, Side, PatternFill

        wb = Workbook()
        fill = PatternFill(patternType='solid', fgColor=Color('D8E4BC'))

        ws = wb.active
        """:type : openpyxl.worksheet.Worksheet"""
        ws.title = 'Appendix A'
        prepare(ws)

        ws.merge_cells('A1:D1')
        ws['A1'].style.alignment.wrap_text = True
        ws['A1'].value = '{}\nJOB #: {}'.format(self.name, self.reference_number)
        ws['A1'].fill = fill
        ws['A1'].font = Font(name='Lao UI', size=11, bold=True)

        ws.merge_cells('A3:B3')
        ws['A3'].value = "Appendix 'A' - Contract variations"
        ws['A3'].font = Font(name='Lao UI', size=10, bold=True)
        ws['E3'].value = '=TODAY()'
        ws['E3'].font = Font(name='Lao UI', size=9)

        ws['A5'].value = 'NO.'
        ws['B5'].value = 'ITEM'
        ws['C5'].value = 'PENDING'
        ws['D5'].value = 'APPROVED'
        ws['E5'].value = 'COMPLETED'
        for cell in ['A5', 'B5', 'C5', 'D5', 'E5']:
            ws[cell].font = Font(name='Lao UI', size=10, bold=True)
            ws[cell].alignment = Alignment(horizontal='center')
            ws[cell].fill = fill
            ws[cell].border = Border(
                top=Side(border_style='medium', color='FF000000'),
                bottom=Side(border_style='medium', color='FF000000'),
                left=Side(border_style='medium', color='FF000000'),
                right=Side(border_style='medium', color='FF000000')
            )

        row = 6
        self.variations.sort(key=lambda v: v.vid)
        for variation in self.variations:
            ws['A' + str(row)].value = row - 5
            ws['B' + str(row)].value = variation.description

            column = None
            if variation.pending:
                column = 'C'
            elif variation.approved:
                column = 'D'
            elif variation.declined:
                column = 'C'
            assert column is not None
            ws[column + str(row)].value = variation.amount

            if variation.completed:
                ws[column + str(row)].value = variation.amount

            row += 1

        while row < 34:
            for column in ['A', 'B', 'C', 'D', 'E']:
                cell = ws[column + str(row)]
                cell.border = Border(left=Side(border_style='thin', color='FF000000'),
                                     right=Side(border_style='thin', color='FF000000'))
            row += 1

        for index in range(6, row):
            for column in ['A', 'B', 'C', 'D', 'E']:
                cell = ws['{}{}'.format(column, index)]

                cell.border = Border(left=Side(border_style='thin', color='FF000000'),
                                     right=Side(border_style='thin', color='FF000000'))

                if column == 'A':
                    cell.font = Font(name='Lao UI', size=10, bold=True)
                    cell.alignment = Alignment(vertical='center', horizontal='center')
                else:
                    cell.font = Font(name='Lao UI', size=9)
                    if column == 'B':
                        cell.alignment = Alignment(vertical='center', horizontal='left')
                    else:
                        cell.alignment = Alignment(vertical='center')
                        cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        ws.merge_cells('A{}:B{}'.format(row, row))
        ws['A{}'.format(row)].value = 'TOTALS'
        ws['C{}'.format(row)].value = '=SUM(C6:C{})'.format(row - 1)
        ws['D{}'.format(row)].value = '=SUM(D6:D{})'.format(row - 1)
        ws['E{}'.format(row)].value = '=SUM(E6:E{})'.format(row - 1)

        for column in 'ABCDE':
            cell = ws['{}{}'.format(column, row)]
            cell.alignment = Alignment(vertical='center', horizontal='center')
            cell.fill = fill
            cell.border = Border(
                left=Side(border_style='medium', color='FF000000'),
                right=Side(border_style='medium', color='FF000000'),
                top=Side(border_style='medium', color='FF000000'),
                bottom=Side(border_style='medium', color='FF000000')
            )
            if column != 'A':
                cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        ws.row_dimensions[1].height = 30
        for row in range(len(self.variations)):
            ws.row_dimensions[6 + row].height = 30
        ws.column_dimensions['A'].width = 5
        ws.column_dimensions['B'].width = 40
        ws.column_dimensions['C'].width = 13
        ws.column_dimensions['D'].width = 13
        ws.column_dimensions['E'].width = 13

        for index, variation in enumerate(self.variations):
            new_ws = wb.create_sheet()
            """:type openpyxl.worksheet.Worksheet"""
            prepare(new_ws)
            new_ws.title = 'V{}'.format(index + 1)

            new_ws.merge_cells('A1:H1')
            new_ws['A1'].value = 'CONTRACT VARIATION'
            new_ws['A1'].fill = fill
            new_ws['A1'].font = Font(name='Lao UI', size=16, bold=True)
            new_ws['A1'].alignment = Alignment(vertical='center', horizontal='center')

            for column in 'ABCDEFGH':
                new_ws[column + '1'].border = Border(top=Side(border_style='medium', color='FF000000'),
                                                     bottom=Side(border_style='medium', color='FF000000'),
                                                     left=Side(border_style='medium', color='FF000000'),
                                                     right=Side(border_style='medium', color='FF000000'))

            new_ws.merge_cells('B3:H3')
            new_ws['B3'].value = 'PROJECT: {}'.format(self.name)
            new_ws['B3'].fill = fill
            new_ws['B3'].font = Font(name='Lao UI', size=12, bold=True)
            for column in 'BCDEFGH':
                new_ws['{}3'.format(column)].border = Border(top=Side(border_style='thin', color='FF000000'),
                                                             bottom=Side(border_style='thin', color='FF000000'))

            new_ws['B5'].value = 'VARIATION NO:'
            new_ws['B5'].fill = fill
            new_ws['C5'].fill = fill
            new_ws['B5'].font = Font(name='Lao UI', size=12, bold=True)
            new_ws.merge_cells('D5:E5')
            new_ws['D5'].value = index + 1
            new_ws['D5'].fill = fill
            new_ws['D5'].font = Font(name='Lao UI', size=14, bold=True)
            new_ws.merge_cells('G5:H5')
            new_ws['G5'].value = 'TPC REF: {}'.format(self.reference_number)
            new_ws['G5'].font = Font(name='Lao UI', size=14, bold=True)
            new_ws['G5'].alignment = Alignment(vertical='center', horizontal='left')
            for column in 'BCDE':
                cell = new_ws[column + str(5)]
                cell.border = Border(top=Side(border_style='thin', color='FF000000'),
                                     bottom=Side(border_style='thin', color='FF000000'))

            for column in 'BCDEFGH':
                cell = new_ws[column + str(6)]
                cell.border = Border(bottom=Side(border_style='medium', color='FF000000'))

            row = 7
            for item in variation.items:
                new_ws.merge_cells('B{}:G{}'.format(row, row))
                new_ws['B{}'.format(row)].value = item.description
                new_ws['B{}'.format(row)].font = Font(name='Lao UI', size=11, bold=True)
                new_ws['B{}'.format(row)].alignment = Alignment(vertical='center')

                new_ws['H{}'.format(row)].value = item.amount
                new_ws['H{}'.format(row)].font = Font(name='Lao UI', size=11, bold=True)
                new_ws['H{}'.format(row)].alignment = Alignment(vertical='center')
                new_ws['H{}'.format(row)].number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

                new_ws.row_dimensions[row].height = 40

                row += 1

            while row < 13:
                new_ws['B{}'.format(row)].font = Font(name='Lao UI', size=11)
                new_ws['H{}'.format(row)].font = Font(name='Lao UI', size=11)
                row += 1

            for column in 'BCDEFGH':
                cell = new_ws[column + str(row - 1)]
                cell.border = Border(bottom=Side(border_style='thin', color='FF000000'))

            new_ws['B' + str(row)].value = 'Value of work'
            new_ws['H' + str(row)].value = '=SUM(H7:H{})'.format(row - 1)
            new_ws['B' + str(row)].font = Font(name='Lao UI', size=11)
            new_ws['H' + str(row)].font = Font(name='Lao UI', size=11)
            row += 1

            new_ws['B' + str(row)].value = 'Add OH/Profit {}%'.format(self.margin * 100)
            new_ws['H' + str(row)].value = '=H{} * {}%'.format(row - 1, self.margin * 100)
            new_ws['B' + str(row)].font = Font(name='Lao UI', size=11)
            new_ws['H' + str(row)].font = Font(name='Lao UI', size=11)

            if self.admin_fee is not None:
                row += 1
                new_ws['B' + str(row)].value = 'Fixed administration fee'
                new_ws['H' + str(row)].value = self.admin_fee
                new_ws['B' + str(row)].font = Font(name='Lao UI', size=11)
                new_ws['H' + str(row)].font = Font(name='Lao UI', size=11)

            for column in 'BCDEFGH':
                new_ws[column + str(row)].border = Border(bottom=Side(border_style='thin', color='FF000000'))
            row += 1

            new_ws['B' + str(row)].value = 'Subtotal'
            if self.admin_fee is None:
                new_ws['H' + str(row)] = '=H{} + H{}'.format(row - 2, row - 1)
            else:
                new_ws['H' + str(row)] = '=H{} + H{} + H{}'.format(row - 3, row - 2, row - 1)
            new_ws['H' + str(row)].font = Font(name='Lao UI', size=11, bold=True)
            row += 1

            new_ws['B' + str(row)] = 'Add GST'
            new_ws['H' + str(row)].value = '=H{} * 0.1'.format(row - 1)
            new_ws['H' + str(row)].font = Font(name='Lao UI', size=11, underline='singleAccounting')
            for column in 'BCDEFGH':
                new_ws[column + str(row)].border = Border(bottom=Side(border_style='medium', color='FF000000'))
            row += 1

            new_ws.merge_cells('B{}:C{}'.format(row, row))
            for column in 'BCDEFGH':
                new_ws['{}{}'.format(column, row)].fill = fill
            new_ws['B' + str(row)] = 'TOTAL'
            new_ws['H' + str(row)].value = '=H{} + H{}'.format(row - 1, row - 2)
            new_ws['H' + str(row)].font = Font(name='Lao UI', size=11, bold=True)

            for idx in range(7, row):
                new_ws['H' + str(idx)].number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

            row += 4
            new_ws['B{}'.format(row)].value = 'Variation Prepared By:'
            new_ws['G{}'.format(row)].value = 'Variation Prepared By:'
            new_ws['B{}'.format(row)].font = Font(name='Lao UI', size=11)
            new_ws['G{}'.format(row)].font = Font(name='Lao UI', size=11)

            row += 5
            new_ws['B{}'.format(row)].value = 'FOR'
            new_ws['B{}'.format(row + 1)].value = 'Total Project Construction Pty Ltd'
            new_ws['G{}'.format(row)].value = 'FOR'
            new_ws['B{}'.format(row)].font = Font(name='Lao UI', size=11)
            new_ws['B{}'.format(row + 1)].font = Font(name='Lao UI', size=11)
            new_ws['G{}'.format(row)].font = Font(name='Lao UI', size=11)

            row += 3
            new_ws['B{}'.format(row)].value = 'Date:'
            new_ws['C{}'.format(row)].value = '=TODAY()'
            new_ws['G{}'.format(row)].value = 'Date:'
            new_ws['B{}'.format(row)].font = Font(name='Lao UI', size=11)
            new_ws['C{}'.format(row)].font = Font(name='Lao UI', size=11)
            new_ws['G{}'.format(row)].font = Font(name='Lao UI', size=11)

            new_ws.row_dimensions[1].height = 60
            new_ws.row_dimensions[3].height = 40

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

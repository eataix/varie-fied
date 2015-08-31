from flask import url_for
from . import db
from datetime import datetime
from openpyxl.worksheet import Worksheet
from app.exceptions import ValidationError
import arrow
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Color, Font, Side, Style, PatternFill


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
        def cm_to_inch(cm: float):
            return cm * 0.393701

        def prepare(worksheet: Worksheet):
            worksheet.header_footer.setHeader(
                '&L&"Calibri,Regular"&K000000&G&C&"Lao UI,Bold"&8Total Project Construction Pty. Ltd.&"Lao UI,Regular"&K000000_x000D_ACN 117 578 560  ABN 84 117 578 560_x000D_PO Box 313 HALL ACT_x000D_P: 02-6230 2455   F:02-6230 2488_x000D_E: troy@totalproject.com.au')
            worksheet.header_footer.setFooter(
                '&L&"Arial,Italic"&9&K000000App. A - Contract Variations&R&"Arial,Italic"&9&K000000{}'.format(
                    self.name))
            worksheet.page_margins.top = cm_to_inch(3.4)
            worksheet.page_margins.bottom = cm_to_inch(2)
            worksheet.page_margins.left = cm_to_inch(1.2)
            worksheet.page_margins.right = cm_to_inch(1.1)

        color_style = Style(fill=PatternFill(patternType='solid', fgColor=Color('D8E4BC')))
        color_fill = PatternFill(patternType='solid', fgColor=Color('D8E4BC'))
        wb = Workbook()

        ws = wb.active
        prepare(ws)
        ws.title = 'Appendix A'

        ws.merge_cells('A1:D1')
        ws['A1'].value = '{}\nJOB #:'.format(self.name)
        ws['A1'].fill = color_fill
        ws['A1'].font = Font(name='Lao UI', size=11, bold=True)
        ws['A1'].style.alignment.wrap_text = True
        ws['A1'].alignment = Alignment(vertical='top')
        ws.row_dimensions[1].height = 35

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
            ws[cell].fill = color_fill
            ws[cell].font = Font(name='Lao UI', size=10, bold=True)
            ws[cell].alignment = Alignment(horizontal='center')
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
            ws['A' + str(row)].alignment = Alignment(horizontal='center', vertical='center')

            ws['B' + str(row)].value = variation.description
            ws['B' + str(row)].alignment = Alignment(vertical='center')

            column = None
            if variation.pending:
                column = 'C'
            elif variation.approved:
                column = 'D'
            elif variation.declined:
                column = 'C'

            cell = ws[column + str(row)]
            cell.value = variation.amount

            if variation.completed:
                column = 'E'
                cell = ws[column + str(row)]
                cell.value = variation.amount

            for column in ['A', 'B', 'C', 'D', 'E']:
                cell = ws[column + str(row)]

                cell.border = Border(left=Side(border_style='thin', color='FF000000'),
                                     right=Side(border_style='thin', color='FF000000'))

                if column != 'A':
                    cell.font = Font(name='Lao UI', size=9)
                else:
                    cell.font = Font(name='Lao UI', size=10)

                if column != 'A':
                    cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

                if column == 'A':
                    cell.alignment = Alignment(horizontal='center', vertical='center')
                else:
                    cell.alignment = Alignment(vertical='center')

            row += 1

        while row < 34:
            for column in ['A', 'B', 'C', 'D', 'E']:
                cell = ws[column + str(row)]
                if column == 'A':
                    cell.font = Font(name='Lao UI', size=10)
                else:
                    cell.font = Font(name='Lao UI', size=9)
                cell.border = Border(left=Side(border_style='thin', color='FF000000'),
                                     right=Side(border_style='thin', color='FF000000'))
            row += 1

        ws.merge_cells('A{}:B{}'.format(row, row))

        ws['A{}'.format(row)].value = 'TOTALS'
        ws['C{}'.format(row)].value = '=SUM(C6:C{})'.format(row - 1)
        ws['D{}'.format(row)].value = '=SUM(D6:D{})'.format(row - 1)
        ws['E{}'.format(row)].value = '=SUM(E6:E{})'.format(row - 1)

        for column in 'ABCDE':
            cell = ws[column + str(row)]
            cell.fill = color_fill
            cell.border = Border(
                left=Side(border_style='medium', color='FF000000'),
                right=Side(border_style='medium', color='FF000000'),
                top=Side(border_style='medium', color='FF000000'),
                bottom=Side(border_style='medium', color='FF000000')
            )
            cell.font = Font(name='Lao UI', size=11)
            cell.alignment = Alignment(horizontal='center')

            if column != 'A':
                cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

        for row in range(len(self.variations)):
            ws.row_dimensions[6 + row].height = 30

        ws.column_dimensions['A'].width = 5
        ws.column_dimensions['B'].width = 40
        ws.column_dimensions['C'].width = 13
        ws.column_dimensions['D'].width = 13
        ws.column_dimensions['E'].width = 13
        wb.worksheets[0].title = 'Appendix A'

        for index, variation in enumerate(self.variations):
            new_ws = wb.create_sheet()
            """:type : Worksheet"""
            prepare(new_ws)
            new_ws.title = 'V{}'.format(index + 1)

            new_ws.merge_cells('A1:H1')
            new_ws['A1'].value = 'CONTRACT VARIATION'
            new_ws['A1'].fill = color_style
            new_ws['A1'].font = Font(name='Lao UI', size=16, bold=True)
            new_ws['A1'].alignment = Alignment(vertical='center', horizontal='center')

            new_ws.merge_cells('B3:H3')
            new_ws['B3'].value = 'PROJECT: {}'.format(self.name)
            new_ws['B3'].style = color_style
            new_ws['B3'].font = Font(name='Lao UI', size=12, bold=True)
            for column in 'BCDEFGH':
                new_ws['{}3'.format(column)].border = Border(top=Side(border_style='thin', color='FF000000'),
                                                             bottom=Side(border_style='thin', color='FF000000'))

            new_ws['B5'].value = 'VARIATION NO:'
            new_ws['B5'].style = color_style
            new_ws['C5'].style = color_style
            new_ws['B5'].font = Font(name='Lao UI', size=12, bold=True)
            new_ws.merge_cells('D5:E5')
            new_ws['D5'].value = index + 1
            new_ws['D5'].style = color_style
            new_ws['D5'].font = Font(name='Lao UI', size=14, bold=True)
            new_ws.merge_cells('G5:H5')
            new_ws['G5'].value = 'TPC REF: {}'.format("")
            new_ws['G5'].font = Font(name='Lao UI', size=14, bold=True)
            new_ws['G5'].alignment = Alignment(vertical='center', horizontal='left')
            for column in 'ABCDEFGH':
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

            row = max(row, 13)
            for column in 'ABCDEFGH':
                cell = new_ws[column + str(row - 1)]
                cell.border = Border(bottom=Side(border_style='thin', color='FF000000'))

            new_ws['B' + str(row)].value = 'Value of work'
            new_ws['H' + str(row)].value = '=SUM(H7:H{})'.format(row - 1)
            row += 1

            new_ws['B' + str(row)] = 'Add OH/Profit {}%'.format(self.margin * 100)
            new_ws['H' + str(row)] = '=H{} * {}%'.format(row - 1, self.margin * 100)

            if self.admin_fee is not None:
                new_ws['B' + str(row)] = 'Fixed administration fee'
                new_ws['H' + str(row)] = self.admin_fee

            for column in 'BCDEFGH':
                new_ws[column + str(row)].border = Border(bottom=Side(border_style='thin', color='FF000000'))
            row += 1

            new_ws['B' + str(row)] = 'Subtotal'
            if self.admin_fee is None:
                new_ws['H' + str(row)] = '=H{} + H{}'.format(row - 2, row - 1)
            else:
                new_ws['H' + str(row)] = '=H{} + H{} + H{}'.format(row - 3, row - 2, row - 1)
            new_ws['H' + str(row)].font = Font(bold=True)
            row += 1

            new_ws['B' + str(row)] = 'Add GST'
            new_ws['H' + str(row)].value = '=H{} * 0.1'.format(row - 1)
            new_ws['H' + str(row)].font = Font(underline='singleAccounting')
            for column in 'BCDEFGH':
                new_ws[column + str(row)].border = Border(bottom=Side(border_style='medium', color='FF000000'))
            row += 1

            new_ws.merge_cells('B{}:C{}'.format(row, row))
            for column in 'BCDEFGH':
                new_ws['{}{}'.format(column, row)].style = color_style
            new_ws['B' + str(row)].value = 'TOTAL'
            new_ws['B' + str(row)].font = Font(name='Lao UI', size=11, bold=True)
            new_ws['H' + str(row)].value = '=H{} + H{}'.format(row - 1, row - 2)
            new_ws['H' + str(row)].font = Font(bold=True)

            for idx in range(7, row):
                cell = new_ws['H' + str(idx)]
                cell.number_format = r'_-"$"* #,##0.00_-;\\-"$"* #,##0.00_-;_-"$"* "-"??_-;_-@_-'

            row += 4
            new_ws['B{}'.format(row)].value = 'Variation Prepared By:'
            new_ws['G{}'.format(row)].value = 'Variation Prepared By:'

            row += 5
            new_ws['B{}'.format(row)].value = 'FOR'
            new_ws['B{}'.format(row + 1)].value = 'Total Project Construction Pty Ltd'
            new_ws['G{}'.format(row)].value = 'FOR'

            row += 3
            new_ws['B{}'.format(row)].value = 'Date:'
            new_ws['C{}'.format(row)].value = '=TODAY()'
            new_ws['G{}'.format(row)].value = 'Date:'

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

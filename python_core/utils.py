from fpdf import FPDF
import re

def create_pdf(report_text, idea_title):
    class PDF(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 15)
            self.cell(0, 10, 'Startup Validation Report', 0, 1, 'C')
            self.ln(5)

        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.multi_cell(0, 10, f"Idea: {idea_title[:50]}...", align='L')
    pdf.ln(5)
    
    # Content
    pdf.set_font("Arial", size=12)
    
    # Simple markdown-ish parsing
    for line in report_text.split('\n'):
        line = line.strip()
        if not line:
            pdf.ln(5)
            continue
            
        if line.startswith('# '):
            pdf.set_font("Arial", "B", 16)
            pdf.cell(0, 10, line[2:], ln=True)
            pdf.set_font("Arial", size=12)
        elif line.startswith('## '):
            pdf.set_font("Arial", "B", 14)
            pdf.cell(0, 10, line[3:], ln=True)
            pdf.set_font("Arial", size=12)
        elif line.startswith('### '):
            pdf.set_font("Arial", "B", 12)
            pdf.cell(0, 10, line[4:], ln=True)
            pdf.set_font("Arial", size=12)
        elif line.startswith('- '):
            pdf.cell(5) # Indent
            pdf.multi_cell(0, 7, f"- {line[2:]}")
        else:
             # Remove bold markers for simplicity in PDF
            clean_line = line.replace('**', '').replace('__', '')
            pdf.multi_cell(0, 7, clean_line)
            
    return pdf.output(dest='S').encode('latin-1', 'replace')

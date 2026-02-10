import sys
import os

print(f"Inner Debug Script Running")
print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")

try:
    import fpdf
    from fpdf import FPDF
    print(f"SUCCESS: fpdf imported from {fpdf.__file__}")
except ImportError as e:
    print(f"FAILURE importing fpdf: {e}")
except Exception as e:
    print(f"FAILURE generic: {e}")

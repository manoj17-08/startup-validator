import sys
import os

print(f"Python Executable: {sys.executable}")
print(f"Current Working Directory: {os.getcwd()}")
print("System Path:")
for p in sys.path:
    print(f"  {p}")

try:
    import fpdf
    print(f"SUCCESS: fpdf imported from {fpdf.__file__}")
except ImportError as e:
    print(f"FAILURE: {e}")

try:
    import streamlit
    print(f"SUCCESS: streamlit imported from {streamlit.__file__}")
except ImportError as e:
    print(f"FAILURE: {e}")

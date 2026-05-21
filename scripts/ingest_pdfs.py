import os
import sqlite3
import hashlib
from pathlib import Path

# Paths
DB_PATH = Path("c:/Dev/CROWLEYDB/database/crowley_unified.sqlite")
PDF_DIR = Path("E:/pdf/crowley")

def init_db(conn):
    # Ensure the schema is loaded
    schema_path = Path("c:/Dev/CROWLEYDB/database/schema.sql")
    if schema_path.exists():
        with open(schema_path, "r", encoding="utf-8") as f:
            conn.executescript(f.read())

def generate_id(prefix, text):
    hash_object = hashlib.md5(text.encode())
    return f"{prefix}_{hash_object.hexdigest()[:8]}"

def determine_lane(filename):
    """
    Heuristic to determine the evidentiary lane of a document based on its title/author.
    A: Magical Record / Crowley's works
    B: Confessions
    C: Scholarship / Biography
    D: Practitioner Manuals
    E: History
    """
    fn_lower = filename.lower()
    
    # Check for scholarly biographers
    if "kaczynski" in fn_lower or "churton" in fn_lower or "pasi" in fn_lower or "baker" in fn_lower:
        return "C" # Scholarship
    
    # Check for practitioners / disciples
    if "grant" in fn_lower or "eshelman" in fn_lower or "orpheus" in fn_lower:
        return "D" # Disciples
        
    # Check for Confessions
    if "confessions" in fn_lower:
        return "B" # Autobiography
        
    # Default to Crowley's magical works if Aleister Crowley is the primary author
    if "aleister crowley" in fn_lower or "master therion" in fn_lower or "macgregor mathers" in fn_lower:
        return "A" # Primary
        
    return "E" # Default / Unknown

def parse_filename(filename):
    """Attempt to extract Author and Title from the filename."""
    name_without_ext = os.path.splitext(filename)[0]
    
    # Common separators
    if " - " in name_without_ext:
        parts = name_without_ext.split(" - ", 1)
        return parts[0].strip(), parts[1].strip()
    
    # If no clear separator, just return the whole thing as title
    return "Unknown", name_without_ext

def ingest_pdfs():
    print(f"Connecting to database: {DB_PATH}")
    
    # Ensure directory exists
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    init_db(conn)
    cursor = conn.cursor()
    
    if not PDF_DIR.exists():
        print(f"Warning: Directory {PDF_DIR} not found. Cannot ingest PDFs.")
        return
        
    print(f"Scanning directory: {PDF_DIR}")
    files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(('.pdf', '.epub', '.azw3', '.mobi'))]
    
    inserted = 0
    for file in files:
        file_path = PDF_DIR / file
        doc_id = generate_id("DOC", file)
        lane = determine_lane(file)
        author, title = parse_filename(file)
        
        # Insert into documents table
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO documents (id, title, author, evidentiary_lane, file_path)
                VALUES (?, ?, ?, ?, ?)
            """, (doc_id, title, author, lane, str(file_path)))
            
            if cursor.rowcount > 0:
                inserted += 1
                
                # If it's a primary text (Lane A), also add a stub to the works table
                if lane == 'A':
                    work_id = generate_id("WORK", file)
                    cursor.execute("""
                        INSERT OR IGNORE INTO works (id, title, class, document_id)
                        VALUES (?, ?, 'Unclassified', ?)
                    """, (work_id, title, doc_id))
                    
        except sqlite3.Error as e:
            print(f"Error inserting {file}: {e}")
            
    conn.commit()
    conn.close()
    
    print(f"Ingestion complete. Added {inserted} new documents.")

if __name__ == "__main__":
    ingest_pdfs()

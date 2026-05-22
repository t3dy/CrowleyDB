import sqlite3
import json
import os
from pathlib import Path

OUTPUT_DIR = Path("c:/Dev/CROWLEYDB/frontend/public/data")

from db_utils import open_db

def get_db_connection():
    conn = open_db()
    conn.row_factory = sqlite3.Row
    return conn

def export_table_to_json(conn, table_name):
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    
    data = [dict(row) for row in rows]
    
    output_path = OUTPUT_DIR / f"{table_name}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Exported {len(data)} rows to {output_path}")

def build_site():
    if not OUTPUT_DIR.exists():
        os.makedirs(OUTPUT_DIR)
        
    conn = get_db_connection()
    
    tables = [
        "documents",
        "works",
        "persons",
        "terms",
        "thelemic_tree",
        "topics",
        "event_topics",
        "events",
        "locations",
        "workings",
        "term_works",
        "person_events",
        "person_workings",
        "grades"
    ]
    
    for table in tables:
        try:
            export_table_to_json(conn, table)
        except sqlite3.Error as e:
            print(f"Error exporting table {table}: {e}")
            
    conn.close()
    print("Site data build complete.")

if __name__ == "__main__":
    build_site()

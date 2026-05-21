import sqlite3
from pathlib import Path

DB_PATH = Path("c:/Dev/CROWLEYDB/database/crowley_unified.sqlite")

TERMS = [
    ('TRM_001', 'Thelema', 93, 'From Greek θέλημα (will).', 'The central philosophy of Aleister Crowley, dictating that one must discover and accomplish their True Will.', 'It is the Word of the Law, equating to Agape (Love) in Gematria.', 'A'),
    ('TRM_002', 'Aiwass', 93, 'Unknown origin, possibly dictated.', 'The praeterhuman intelligence that dictated the Book of the Law to Crowley.', 'Considered by Crowley as his Holy Guardian Angel and the minister of Hoor-Paar-Kraat.', 'A'),
    ('TRM_003', 'Abramelin', None, 'From the Book of Abramelin.', 'A rigorous magical operation lasting 6 to 18 months to contact one\'s Holy Guardian Angel.', 'Crowley attempted this at Boleskine but abandoned it midway, leading to supposed magical blowback.', 'A')
]

def seed_dictionary():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Insert Terms
    cursor.execute("DELETE FROM terms")
    cursor.executemany("""
        INSERT INTO terms (id, term, gematria_value, etymology, definition, thelemic_significance, evidentiary_lane)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, TERMS)
    
    conn.commit()
    conn.close()
    print(f"Seeded {len(TERMS)} dictionary terms.")

if __name__ == "__main__":
    seed_dictionary()

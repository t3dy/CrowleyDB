import sqlite3
from pathlib import Path

DB_PATH = Path("c:/Dev/CROWLEYDB/database/crowley_unified.sqlite")

LOCATIONS = [
    ('LOC_001', 'Boleskine House, Loch Ness', 57.266, -4.471, 'Site of the incomplete Abramelin working, considered the focal point of Crowley\'s magical system in the early 1900s.'),
    ('LOC_002', 'Cairo, Egypt', 30.044, 31.235, 'The Boulaq Museum and the apartment where the Book of the Law was received in 1904.'),
    ('LOC_003', 'Abbey of Thelema, Cefalù', 38.033, 14.016, 'Crowley\'s magical commune in Sicily (1920-1923), infamous for the death of Raoul Loveday.'),
    ('LOC_004', 'Bou Saâda, Algeria', 35.212, 4.181, 'Where Crowley and Victor Neuburg scried the Enochian Aethyrs (The Vision and the Voice) in 1909.')
]

EVENTS = [
    ('EVT_001', '1875', None, 'Birth of Edward Alexander Crowley', 'Born in Royal Leamington Spa to Plymouth Brethren parents.', 'Unknown', 'E', None),
    ('EVT_002', '1899', '1900', 'The Abramelin Working', 'Attempted the rigorous Abramelin operation at Boleskine to attain the Knowledge and Conversation of his Holy Guardian Angel.', 'LOC_001', 'A', None),
    ('EVT_003', '1904-04-08', '1904-04-10', 'Reception of Liber AL vel Legis', 'Dictation of the Book of the Law by Aiwass in Cairo. Marks the beginning of the Aeon of Horus.', 'LOC_002', 'A', None),
    ('EVT_004', '1909-11', '1909-12', 'The Vision and the Voice', 'Scrying of the 30 Enochian Aethyrs with Victor Neuburg in the Algerian desert.', 'LOC_004', 'A', None),
    ('EVT_005', '1920', '1923', 'Abbey of Thelema', 'Established a commune based on Thelemic principles. Ended with Mussolini expelling Crowley from Italy.', 'LOC_003', 'E', None),
    ('EVT_006', '1947-12-01', None, 'Death of Aleister Crowley', 'Died in Netherwood, Hastings. His ashes were buried near a tree in Hampton, New Jersey.', 'Unknown', 'E', None)
]

def seed_timeline_map():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Insert Locations
    cursor.execute("DELETE FROM locations")
    cursor.executemany("""
        INSERT INTO locations (id, name, latitude, longitude, significance)
        VALUES (?, ?, ?, ?, ?)
    """, LOCATIONS)
    
    # Insert Events
    cursor.execute("DELETE FROM events")
    cursor.executemany("""
        INSERT INTO events (id, date_start, date_end, title, description, location_id, evidentiary_lane, document_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, EVENTS)
    
    conn.commit()
    conn.close()
    print(f"Seeded {len(LOCATIONS)} locations and {len(EVENTS)} events.")

if __name__ == "__main__":
    seed_timeline_map()

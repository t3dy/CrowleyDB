import sqlite3

from db_utils import open_db

# Qabalistic paths 11-32 (1-10 are the Sephiroth, 11-32 are the paths)
# We will focus on paths 11-32 which correspond to the Hebrew alphabet.
PATHS = [
    (11, 'Aleph', 'Air', 'The Fool', 0, 'Path from Kether to Chokmah'),
    (12, 'Beth', 'Mercury', 'The Magus', 0, 'Path from Kether to Binah'),
    (13, 'Gimel', 'Moon', 'The Priestess', 0, 'Path from Kether to Tiphareth'),
    (14, 'Daleth', 'Venus', 'The Empress', 0, 'Path from Chokmah to Binah'),
    (15, 'Heh', 'Aquarius', 'The Star', 1, 'Path from Chokmah to Tiphareth. Swapped with Tzaddi (Aries) in Thoth Tarot.'),
    (16, 'Vau', 'Taurus', 'The Hierophant', 0, 'Path from Chokmah to Chesed'),
    (17, 'Zayin', 'Gemini', 'The Lovers', 0, 'Path from Binah to Tiphareth'),
    (18, 'Cheth', 'Cancer', 'The Chariot', 0, 'Path from Binah to Geburah'),
    (19, 'Teth', 'Leo', 'Lust', 0, 'Path from Chesed to Geburah. Often called Strength in traditional Tarot.'),
    (20, 'Yod', 'Virgo', 'The Hermit', 0, 'Path from Chesed to Tiphareth'),
    (21, 'Kaph', 'Jupiter', 'Fortune', 0, 'Path from Chesed to Netzach'),
    (22, 'Lamed', 'Libra', 'Adjustment', 0, 'Path from Geburah to Tiphareth. Often called Justice in traditional Tarot.'),
    (23, 'Mem', 'Water', 'The Hanged Man', 0, 'Path from Geburah to Hod'),
    (24, 'Nun', 'Scorpio', 'Death', 0, 'Path from Tiphareth to Netzach'),
    (25, 'Samekh', 'Sagittarius', 'Art', 0, 'Path from Tiphareth to Yesod. Often called Temperance in traditional Tarot.'),
    (26, 'Ayin', 'Capricorn', 'The Devil', 0, 'Path from Tiphareth to Hod'),
    (27, 'Pe', 'Mars', 'The Tower', 0, 'Path from Netzach to Hod'),
    (28, 'Tzaddi', 'Aries', 'The Emperor', 1, 'Path from Netzach to Yesod. Swapped with Heh (Aquarius) in Thoth Tarot.'),
    (29, 'Qoph', 'Pisces', 'The Moon', 0, 'Path from Netzach to Malkuth'),
    (30, 'Resh', 'Sun', 'The Sun', 0, 'Path from Hod to Yesod'),
    (31, 'Shin', 'Fire', 'The Aeon', 0, 'Path from Hod to Malkuth. Often called Judgement in traditional Tarot.'),
    (32, 'Tau', 'Saturn', 'The Universe', 0, 'Path from Yesod to Malkuth. Often called The World in traditional Tarot.')
]

def seed_tree():
    conn = open_db()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM thelemic_tree")
    
    cursor.executemany("""
        INSERT INTO thelemic_tree (path_number, hebrew_letter, astrological_attribution, thoth_tarot_card, is_swapped, description)
        VALUES (?, ?, ?, ?, ?, ?)
    """, PATHS)
    
    conn.commit()
    conn.close()
    print(f"Seeded {len(PATHS)} paths into thelemic_tree.")

if __name__ == "__main__":
    seed_tree()

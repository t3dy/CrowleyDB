import sqlite3
from pathlib import Path

DB_PATH = Path("c:/Dev/CROWLEYDB/database/crowley_unified.sqlite")
SCHEMA_PATH = Path("c:/Dev/CROWLEYDB/database/schema.sql")

# Extensive data for the Tree of Life
# Sephiroth (1-10) and Paths (11-32)
TREE_DATA = [
    # Sephiroth
    (1, 'Kether', None, 'Primum Mobile', None, None, 0, 'Brilliance', 'White brilliance', 'White brilliance', 'White flecked gold', 'Eheieh', 'Metatron', 'Chaioth ha-Qadesh', 'Crowley equates this to the point, the Tao.', 'The Crown, the source of all.'),
    (2, 'Chokmah', None, 'Zodiac', None, None, 0, 'Pure soft blue', 'Grey', 'Blue pearl grey', 'White flecked red, blue, and yellow', 'Yah', 'Ratziel', 'Auphanim', 'The Great Father, Chiah.', 'Wisdom.'),
    (3, 'Binah', None, 'Saturn', None, None, 0, 'Crimson', 'Black', 'Dark brown', 'Grey flecked pink', 'YHVH Elohim', 'Tzaphqiel', 'Aralim', 'The Great Mother, Babalon.', 'Understanding.'),
    (4, 'Chesed', None, 'Jupiter', None, None, 0, 'Deep violet', 'Blue', 'Deep purple', 'Deep azure flecked yellow', 'El', 'Tzadqiel', 'Chashmalim', 'Mercy, love.', 'Mercy.'),
    (5, 'Geburah', None, 'Mars', None, None, 0, 'Orange', 'Scarlet red', 'Bright scarlet', 'Red flecked black', 'Elohim Gibor', 'Kamael', 'Seraphim', 'Severity, strength.', 'Severity.'),
    (6, 'Tiphareth', None, 'Sun', None, None, 0, 'Clear pink rose', 'Yellow (gold)', 'Rich salmon', 'Gold amber', 'YHVH Eloah V\'Daath', 'Raphael', 'Malachim', 'The Holy Guardian Angel, Asar Un-Nefer.', 'Beauty.'),
    (7, 'Netzach', None, 'Venus', None, None, 0, 'Amber', 'Emerald', 'Bright yellow green', 'Olive flecked gold', 'YHVH Tzabaoth', 'Haniel', 'Elohim', 'Victory.', 'Victory.'),
    (8, 'Hod', None, 'Mercury', None, None, 0, 'Violet purple', 'Orange', 'Russet red', 'Yellow-brown flecked white', 'Elohim Tzabaoth', 'Michael', 'Beni Elohim', 'Splendour.', 'Splendour.'),
    (9, 'Yesod', None, 'Moon', None, None, 0, 'Indigo', 'Violet', 'Very dark purple', 'Citrine flecked azure', 'Shaddai El Chai', 'Gabriel', 'Kerubim', 'Foundation.', 'Foundation.'),
    (10, 'Malkuth', None, 'Elements', None, None, 0, 'Yellow', 'Citrine, olive, russet, black', 'Citrine, olive, russet, black', 'Black rayed yellow', 'Adonai ha-Aretz', 'Sandalphon', 'Ashim', 'The manifested world.', 'The Kingdom.'),
    
    # Paths (Adding Tarot and more)
    (11, 'Path 11', 'Aleph', 'Air', 'The Fool', 'The Fool', 0, 'Bright pale yellow', 'Sky blue', 'Blue emerald green', 'Emerald flecked gold', 'YHVH', 'Raphael', 'Chassan', 'Crowley assigns this to Harpocrates, the babe in the egg.', 'Path from Kether to Chokmah'),
    (12, 'Path 12', 'Beth', 'Mercury', 'The Magus', 'The Magician', 0, 'Yellow', 'Purple', 'Grey', 'Indigo rayed violet', 'Elohim Tzabaoth', 'Michael', 'Beni Elohim', 'Tahuti, Hermes. Word of the Aeon.', 'Path from Kether to Binah'),
    (13, 'Path 13', 'Gimel', 'Moon', 'The Priestess', 'The High Priestess', 0, 'Blue', 'Silver', 'Cold pale blue', 'Silver rayed sky-blue', 'Shaddai El Chai', 'Gabriel', 'Kerubim', 'The Camel traversing the Abyss.', 'Path from Kether to Tiphareth'),
    (14, 'Path 14', 'Daleth', 'Venus', 'The Empress', 'The Empress', 0, 'Emerald green', 'Sky blue', 'Early spring green', 'Bright rose or cerise', 'YHVH Tzabaoth', 'Haniel', 'Elohim', 'Babalon as the pregnant womb.', 'Path from Chokmah to Binah'),
    (15, 'Path 15', 'Heh', 'Aquarius', 'The Star', 'The Emperor', 1, 'Violet', 'Sky blue', 'Bluish mauve', 'White tinted purple', 'YHVH', 'Tzaphqiel', 'Aralim', 'Swapped with Tzaddi! Crowley puts The Star here. Nuit.', 'Path from Chokmah to Tiphareth.'),
    (16, 'Path 16', 'Vau', 'Taurus', 'The Hierophant', 'The Hierophant', 0, 'Red orange', 'Deep indigo', 'Deep warm olive', 'Rich brown', 'YHVH', 'Uriel', 'Kerubim', 'The revealer of the mysteries. Orus.', 'Path from Chokmah to Chesed'),
    (17, 'Path 17', 'Zayin', 'Gemini', 'The Lovers', 'The Lovers', 0, 'Orange', 'Pale mauve', 'New yellow leather', 'Reddish grey inclined to mauve', 'YHVH', 'Raphael', 'Beni Elohim', 'The Marriage of Babalon and the Beast.', 'Path from Binah to Tiphareth'),
    (18, 'Path 18', 'Cheth', 'Cancer', 'The Chariot', 'The Chariot', 0, 'Amber', 'Maroon', 'Rich bright russet', 'Dark greenish brown', 'Elohim', 'Gabriel', 'Kerubim', 'The Sangraal, the Cup of Babalon.', 'Path from Binah to Geburah'),
    (19, 'Path 19', 'Teth', 'Leo', 'Lust', 'Strength', 0, 'Yellow (greenish)', 'Deep purple', 'Grey', 'Reddish amber', 'YHVH', 'Michael', 'Seraphim', 'Renamed from Strength to Lust. Babalon riding the Beast.', 'Path from Chesed to Geburah.'),
    (20, 'Path 20', 'Yod', 'Virgo', 'The Hermit', 'The Hermit', 0, 'Green, yellowish', 'Slate grey', 'Green grey', 'Plum colour', 'YHVH', 'Raphael', 'Tarshishim', 'The Secret Seed, the spermatozoon.', 'Path from Chesed to Tiphareth'),
    (21, 'Path 21', 'Kaph', 'Jupiter', 'Fortune', 'Wheel of Fortune', 0, 'Violet', 'Blue', 'Rich purple', 'Bright blue rayed yellow', 'El', 'Tzadqiel', 'Chashmalim', 'The wheel of Samsara.', 'Path from Chesed to Netzach'),
    (22, 'Path 22', 'Lamed', 'Libra', 'Adjustment', 'Justice', 0, 'Emerald green', 'Blue', 'Deep blue-green', 'Pale green', 'YHVH', 'Haniel', 'Elohim', 'Renamed from Justice to Adjustment. Maat.', 'Path from Geburah to Tiphareth.'),
    (23, 'Path 23', 'Mem', 'Water', 'The Hanged Man', 'The Hanged Man', 0, 'Deep blue', 'Sea green', 'Deep olive-green', 'White flecked purple', 'El', 'Gabriel', 'Taliahad', 'The drowned man, sacrifice. Samadhi.', 'Path from Geburah to Hod'),
    (24, 'Path 24', 'Nun', 'Scorpio', 'Death', 'Death', 0, 'Green blue', 'Dull brown', 'Very dark brown', 'Livid indigo brown', 'YHVH', 'Kamael', 'Seraphim', 'Putrefaction before rebirth.', 'Path from Tiphareth to Netzach'),
    (25, 'Path 25', 'Samekh', 'Sagittarius', 'Art', 'Temperance', 0, 'Blue', 'Yellow', 'Green', 'Dark vivid blue', 'YHVH', 'Michael', 'Seraphim', 'Renamed from Temperance to Art. Solve et Coagula.', 'Path from Tiphareth to Yesod.'),
    (26, 'Path 26', 'Ayin', 'Capricorn', 'The Devil', 'The Devil', 0, 'Indigo', 'Black', 'Blue black', 'Cold dark grey near black', 'YHVH', 'Haniel', 'Elohim', 'Pan, Baphomet.', 'Path from Tiphareth to Hod'),
    (27, 'Path 27', 'Pe', 'Mars', 'The Tower', 'The Tower', 0, 'Scarlet', 'Red', 'Venetian red', 'Bright red rayed azure or orange', 'Elohim Gibor', 'Kamael', 'Seraphim', 'The destruction of the old aeon.', 'Path from Netzach to Hod'),
    (28, 'Path 28', 'Tzaddi', 'Aries', 'The Emperor', 'The Star', 1, 'Scarlet', 'Red', 'Brilliant flame', 'Glowing red', 'YHVH', 'Melchidael', 'Aralim', 'Swapped with Heh! Crowley puts The Emperor here.', 'Path from Netzach to Yesod.'),
    (29, 'Path 29', 'Qoph', 'Pisces', 'The Moon', 'The Moon', 0, 'Crimson (ultra violet)', 'Buff, flecked silver-white', 'Light translucent pinkish brown', 'Stone colour', 'YHVH', 'Amnitziel', 'Kerubim', 'The threshold of sleep and illusion.', 'Path from Netzach to Malkuth'),
    (30, 'Path 30', 'Resh', 'Sun', 'The Sun', 'The Sun', 0, 'Orange', 'Gold yellow', 'Rich amber', 'Amber rayed red', 'YHVH Eloah V\'Daath', 'Raphael', 'Malachim', 'Ra-Hoor-Khuit.', 'Path from Hod to Yesod'),
    (31, 'Path 31', 'Shin', 'Fire', 'The Aeon', 'Judgement', 0, 'Glowing orange scarlet', 'Vermilion', 'Scarlet, flecked gold', 'Vermilion flecked crimson & emerald', 'Elohim', 'Michael', 'Seraphim', 'Renamed from Judgement to The Aeon. Stele of Revealing.', 'Path from Hod to Malkuth.'),
    (32, 'Path 32', 'Tau', 'Saturn', 'The Universe', 'The World', 0, 'Indigo', 'Black', 'Blue black', 'Black rayed blue', 'YHVH Elohim', 'Tzaphqiel', 'Aralim', 'Renamed from The World to The Universe.', 'Path from Yesod to Malkuth.')
]

GRADES = [
    ('GRD_001', 'Neophyte (1=10)', 'A.\'.A.\'.', 10, 'The grade associated with Malkuth. The task is to obtain control of the astral plane.'),
    ('GRD_002', 'Zelator (2=9)', 'A.\'.A.\'.', 9, 'Associated with Yesod. The task is to master the foundations of yoga and the physical body.'),
    ('GRD_003', 'Practicus (3=8)', 'A.\'.A.\'.', 8, 'Associated with Hod. The task is to master the intellect and the Qabalah.'),
    ('GRD_004', 'Philosophus (4=7)', 'A.\'.A.\'.', 7, 'Associated with Netzach. The task is to master the emotions and moral nature.'),
    ('GRD_005', 'Adeptus Minor (5=6)', 'A.\'.A.\'.', 6, 'Associated with Tiphareth. The task is to attain the Knowledge and Conversation of the Holy Guardian Angel.'),
    ('GRD_006', 'Adeptus Major (6=5)', 'A.\'.A.\'.', 5, 'Associated with Geburah. The task is to learn the practical application of Magick.'),
    ('GRD_007', 'Adeptus Exemptus (7=4)', 'A.\'.A.\'.', 4, 'Associated with Chesed. The task is to write a thesis setting forth a complete system of the universe.'),
    ('GRD_008', 'Magister Templi (8=3)', 'A.\'.A.\'.', 3, 'Associated with Binah. The task is the crossing of the Abyss and the destruction of the ego.'),
    ('GRD_009', 'Magus (9=2)', 'A.\'.A.\'.', 2, 'Associated with Chokmah. The task is to declare a new Word (Logos) to humanity.'),
    ('GRD_010', 'Ipsissimus (10=1)', 'A.\'.A.\'.', 1, 'Associated with Kether. The highest grade, utterly beyond comprehension.'),
    ('GRD_011', 'Zelator (1=10)', 'Golden Dawn', 10, 'Golden Dawn grade in Malkuth.'),
    ('GRD_012', 'Theoricus (2=9)', 'Golden Dawn', 9, 'Golden Dawn grade in Yesod.')
]

SAINTS = [
    ('PRS_S001', 'Michael Maier', 'Unknown', 'Thelemic Saint', 1568, 1622, 'A German physician, counselor to Rudolf II Habsburg, and a learned alchemist and Rosicrucian apologist.'),
    ('PRS_S002', 'Jacques de Molay', 'Unknown', 'Thelemic Saint', 1243, 1314, 'The 23rd and last Grand Master of the Knights Templar.'),
    ('PRS_S003', 'Christian Rosenkreuz', 'Frater C.R.C.', 'Thelemic Saint', 1378, 1484, 'Legendary founder of the Rosicrucian Order.'),
    ('PRS_S004', 'Paracelsus', 'Unknown', 'Thelemic Saint', 1493, 1541, 'Swiss physician, alchemist, and astrologer of the German Renaissance.'),
    ('PRS_S005', 'Apollonius of Tyana', 'Unknown', 'Thelemic Saint', 15, 100, 'Greek Neopythagorean philosopher.')
]

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Reload schema
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        cursor.executescript(f.read())
        
    cursor.execute("DROP TABLE IF EXISTS thelemic_tree")
    cursor.execute("""
        CREATE TABLE thelemic_tree (
            path_number INTEGER PRIMARY KEY,
            name TEXT,
            hebrew_letter TEXT,
            astrological_attribution TEXT,
            thoth_tarot_card TEXT,
            gd_tarot_card TEXT,
            is_swapped BOOLEAN DEFAULT 0,
            color_scale_king TEXT,
            color_scale_queen TEXT,
            color_scale_emperor TEXT,
            color_scale_empress TEXT,
            god_name TEXT,
            archangel TEXT,
            angel_choir TEXT,
            crowley_tweaks TEXT,
            description TEXT
        )
    """)
    
    cursor.executemany("""
        INSERT INTO thelemic_tree (path_number, name, hebrew_letter, astrological_attribution, thoth_tarot_card, gd_tarot_card, is_swapped, color_scale_king, color_scale_queen, color_scale_emperor, color_scale_empress, god_name, archangel, angel_choir, crowley_tweaks, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, TREE_DATA)
    
    cursor.executemany("""
        INSERT OR REPLACE INTO grades (id, name, system, tree_path_number, description)
        VALUES (?, ?, ?, ?, ?)
    """, GRADES)
    
    cursor.executemany("""
        INSERT OR REPLACE INTO persons (id, name, magical_motto, role_category, birth_year, death_year, biography)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, SAINTS)
    
    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()

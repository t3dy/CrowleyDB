import sqlite3
from pathlib import Path

DB_PATH = Path("c:/Dev/CROWLEYDB/.tmp/crowley_unified_rebuilt.sqlite")
SCHEMA_PATH = Path("c:/Dev/CROWLEYDB/database/schema.sql")


def open_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=OFF")
    conn.execute("PRAGMA synchronous=OFF")
    with open(SCHEMA_PATH, "r", encoding="utf-8") as handle:
        conn.executescript(handle.read())
    return conn

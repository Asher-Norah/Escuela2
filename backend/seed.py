# seed.py
# --------
# Run this script ONCE to populate the database with students.
# It reads the mock data and inserts it into PostgreSQL.
#
# To run:
#   cd ~/Desktop/escuela/backend
#   source venv/bin/activate
#   python seed.py

from app.database import SessionLocal, engine, Base
from app.models.student import Student
from app.models import *   # makes sure all tables are created

# Create all tables first
Base.metadata.create_all(bind=engine)

# All students — matches our frontend mock data
# Format: (name, admission_no, class_name, gender)
STUDENTS = [
  # ── FORM 3 NORTH ──────────────────────────────
  ("Aisha Mohamed",   "GFA/0042", "Form 3 North", "Female"),
  ("Brian Kamau",     "GFA/0041", "Form 3 North", "Male"),
  ("Grace Wambui",    "GFA/0045", "Form 3 North", "Female"),
  ("James Njoroge",   "GFA/0046", "Form 3 North", "Male"),
  ("Kevin Ochieng",   "GFA/0044", "Form 3 North", "Male"),
  ("Mary Wanjiku",    "GFA/0047", "Form 3 North", "Female"),
  ("Peter Mwangi",    "GFA/0048", "Form 3 North", "Male"),
  ("Lucy Akinyi",     "GFA/0049", "Form 3 North", "Female"),
  ("David Kipchoge",  "GFA/0050", "Form 3 North", "Male"),
  ("Faith Nduta",     "GFA/0051", "Form 3 North", "Female"),
  ("Samuel Otieno",   "GFA/0052", "Form 3 North", "Male"),
  ("Esther Muthoni",  "GFA/0053", "Form 3 North", "Female"),
  ("Collins Odhiambo","GFA/0054", "Form 3 North", "Male"),
  ("Diana Nyambura",  "GFA/0055", "Form 3 North", "Female"),
  ("Moses Kimani",    "GFA/0056", "Form 3 North", "Male"),

  # ── FORM 2 NORTH ──────────────────────────────
  ("Sandra Muthoni",  "GFA/0060", "Form 2 North", "Female"),
  ("Peter Kibet",     "GFA/0061", "Form 2 North", "Male"),
  ("Alice Waweru",    "GFA/0062", "Form 2 North", "Female"),
  ("John Kariuki",    "GFA/0063", "Form 2 North", "Male"),
  ("Rose Atieno",     "GFA/0064", "Form 2 North", "Female"),
  ("Mark Mutua",      "GFA/0065", "Form 2 North", "Male"),
  ("Winnie Chebet",   "GFA/0066", "Form 2 North", "Female"),
  ("Victor Omondi",   "GFA/0067", "Form 2 North", "Male"),
  ("Beatrice Wangui", "GFA/0068", "Form 2 North", "Female"),
  ("Dennis Njoroge",  "GFA/0069", "Form 2 North", "Male"),
  ("Mercy Achieng",   "GFA/0070", "Form 2 North", "Female"),
  ("Stephen Kamau",   "GFA/0071", "Form 2 North", "Male"),
  ("Irene Wanjiru",   "GFA/0072", "Form 2 North", "Female"),
  ("Patrick Ochieng", "GFA/0073", "Form 2 North", "Male"),
  ("Josephine Nduta", "GFA/0074", "Form 2 North", "Female"),

  # ── FORM 4 SOUTH ──────────────────────────────
  ("Daniel Omondi",   "GFA/0080", "Form 4 South", "Male"),
  ("Cynthia Waweru",  "GFA/0081", "Form 4 South", "Female"),
  ("George Mwangi",   "GFA/0082", "Form 4 South", "Male"),
  ("Lydia Akinyi",    "GFA/0083", "Form 4 South", "Female"),
  ("Charles Kiprop",  "GFA/0084", "Form 4 South", "Male"),
  ("Sylvia Wairimu",  "GFA/0085", "Form 4 South", "Female"),
  ("Timothy Otieno",  "GFA/0086", "Form 4 South", "Male"),
  ("Vivian Cherotich","GFA/0087", "Form 4 South", "Female"),
  ("Ronald Kimani",   "GFA/0088", "Form 4 South", "Male"),
  ("Purity Njeri",    "GFA/0089", "Form 4 South", "Female"),
  ("Emmanuel Oduya",  "GFA/0090", "Form 4 South", "Male"),
  ("Carolyne Wanjiku","GFA/0091", "Form 4 South", "Female"),
  ("Francis Mutuku",  "GFA/0092", "Form 4 South", "Male"),
  ("Hellen Atieno",   "GFA/0093", "Form 4 South", "Female"),
  ("Isaac Mwenda",    "GFA/0094", "Form 4 South", "Male"),
]

def seed():
  db = SessionLocal()
  added = 0
  skipped = 0

  print("🌱 Seeding students into the database...\n")

  for name, adm_no, class_name, gender in STUDENTS:
    # Check if student already exists — don't duplicate
    exists = db.query(Student).filter(Student.admission_no == adm_no).first()
    if exists:
      print(f"  ⏭  Skipped (already exists): {name} ({adm_no})")
      skipped += 1
      continue

    student = Student(
      name         = name,
      admission_no = adm_no,
      class_name   = class_name,
      gender       = gender,
      is_active    = True,
    )
    db.add(student)
    added += 1
    print(f"  ✅ Added: {name} ({adm_no}) — {class_name}")

  db.commit()
  db.close()

  print(f"\n✅ Done! {added} students added, {skipped} skipped.")
  print("You can now use the attendance register with real students.")

if __name__ == "__main__":
  seed()
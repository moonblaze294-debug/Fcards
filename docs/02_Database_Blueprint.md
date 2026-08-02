Concentric Database Blueprint v1.0

Core Principles

- UUID is the primary key for every table.
- Every table has "created_at" and "updated_at".
- Table names are plural.
- Column names use "snake_case".
- Human-readable codes (e.g. FM-01-01-001) are stored separately from UUIDs.
- Flashcards belong to exactly one Topic.
- Notes belong to exactly one Topic.
- Topics belong to exactly one Chapter.
- Chapters belong to exactly one Subject.

---

Database Hierarchy

Subject
    ↓
Chapter
    ↓
Topic
   ├── Note (1)
   ├── Flashcards (Many)
   └── Tags

---

Tables

Academic

- subjects
- chapters
- topics

Learning

- flashcards
- notes
- tags
- flashcard_tags
- topic_tags

Users

- profiles
- bookmarks
- user_progress

Study

- study_sessions
- study_session_flashcards

Quiz (Future)

- quiz_attempts
- quiz_answers

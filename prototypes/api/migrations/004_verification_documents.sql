CREATE TABLE IF NOT EXISTS verification_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  doc_type TEXT NOT NULL CHECK (doc_type IN ('id_front', 'id_back', 'selfie', 'other')),
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_vd_user ON verification_documents(user_id);

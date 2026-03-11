CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  serial VARCHAR(12) UNIQUE NOT NULL,
  token VARCHAR(64) NOT NULL,
  last_name VARCHAR(50),
  first_name VARCHAR(50),
  middle_name VARCHAR(50),
  age_group VARCHAR(20),
  gender VARCHAR(20),
  occupation VARCHAR(50),
  email VARCHAR(255),
  quick_answers JSONB,
  quick_gate VARCHAR(10),
  quick_result JSONB,
  full_answers JSONB,
  scores JSONB,
  weakest_gate VARCHAR(10),
  strongest_gate VARCHAR(10),
  soul_type VARCHAR(20),
  rank VARCHAR(20),
  full_result JSONB,
  scheduled_send_at TIMESTAMP WITH TIME ZONE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  preview_viewed_at TIMESTAMP WITH TIME ZONE,
  detail_viewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_diagnoses_serial ON diagnoses(serial);
CREATE INDEX idx_diagnoses_scheduled_send ON diagnoses(scheduled_send_at)
  WHERE email_sent_at IS NULL;
CREATE INDEX idx_diagnoses_email ON diagnoses(email);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER diagnoses_updated_at
  BEFORE UPDATE ON diagnoses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

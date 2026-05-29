-- 本番DB(zrudckkrzejxaoeqtgso)の実スキーマが、旧設計のまま作られておりコードと列名がズレていた。
-- アプリコードを正として列名を揃え、コードが参照するタイミング列を追加する。
-- 2026-05-29 に Management API 経由で本番へ適用済み（このファイルは記録）。

ALTER TABLE diagnoses RENAME COLUMN serial_code TO serial;
ALTER TABLE diagnoses RENAME COLUMN access_token TO token;
ALTER TABLE diagnoses RENAME COLUMN weakness_gate TO weakest_gate;
ALTER TABLE diagnoses RENAME COLUMN strength_gate TO strongest_gate;

ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS scheduled_send_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS preview_viewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS detail_viewed_at TIMESTAMP WITH TIME ZONE;

-- quick診断のinsert時点ではfull診断の列が未確定なため、2段階書き込みに合わせてNOT NULLを解除。
ALTER TABLE diagnoses ALTER COLUMN answers DROP NOT NULL;
ALTER TABLE diagnoses ALTER COLUMN scores DROP NOT NULL;
ALTER TABLE diagnoses ALTER COLUMN total_score DROP NOT NULL;
ALTER TABLE diagnoses ALTER COLUMN rank DROP NOT NULL;
ALTER TABLE diagnoses ALTER COLUMN soul_type DROP NOT NULL;
ALTER TABLE diagnoses ALTER COLUMN weakest_gate DROP NOT NULL;
ALTER TABLE diagnoses ALTER COLUMN strongest_gate DROP NOT NULL;

-- 旧設計の名残（report_generated / report_content）はコード未使用のため残置（無害）。

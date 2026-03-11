-- Add missing columns to diagnoses table if they don't exist

-- Check and add quick_answers column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'diagnoses' AND column_name = 'quick_answers'
    ) THEN
        ALTER TABLE diagnoses ADD COLUMN quick_answers JSONB;
    END IF;
END $$;

-- Check and add quick_gate column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'diagnoses' AND column_name = 'quick_gate'
    ) THEN
        ALTER TABLE diagnoses ADD COLUMN quick_gate VARCHAR(10);
    END IF;
END $$;

-- Check and add quick_result column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'diagnoses' AND column_name = 'quick_result'
    ) THEN
        ALTER TABLE diagnoses ADD COLUMN quick_result JSONB;
    END IF;
END $$;

-- Check and add full_answers column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'diagnoses' AND column_name = 'full_answers'
    ) THEN
        ALTER TABLE diagnoses ADD COLUMN full_answers JSONB;
    END IF;
END $$;

-- Check and add scores column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'diagnoses' AND column_name = 'scores'
    ) THEN
        ALTER TABLE diagnoses ADD COLUMN scores JSONB;
    END IF;
END $$;

-- Check and add full_result column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'diagnoses' AND column_name = 'full_result'
    ) THEN
        ALTER TABLE diagnoses ADD COLUMN full_result JSONB;
    END IF;
END $$;

-- Custom ENUM types for OBSERVE
CREATE TYPE user_role AS ENUM ('visitor', 'user', 'analyst', 'admin');
CREATE TYPE event_type AS ENUM ('conflict', 'news', 'weather', 'flight', 'vessel', 'market', 'political', 'humanitarian', 'cyber');
CREATE TYPE severity_level AS ENUM ('minimal', 'low', 'moderate', 'high', 'critical');
CREATE TYPE conflict_type AS ENUM ('armed_conflict', 'civil_unrest', 'terrorism', 'political_crisis', 'border_dispute');
CREATE TYPE briefing_type AS ENUM ('daily', 'regional', 'country', 'conflict', 'market', 'custom');
CREATE TYPE ingestion_status AS ENUM ('pending', 'running', 'success', 'failed', 'partial');
CREATE TYPE asset_class AS ENUM ('currency', 'crypto', 'commodity', 'index', 'equity');
CREATE TYPE alert_condition AS ENUM ('new_event', 'severity_change', 'country_event', 'keyword_match', 'price_threshold');

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";        -- spatial queries
CREATE EXTENSION IF NOT EXISTS "vector";         -- pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- full-text search normalization
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- trigram similarity for search

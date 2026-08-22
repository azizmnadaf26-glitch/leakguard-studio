-- init.sql
-- Run this script against your production PostgreSQL database to initialize the LeakGuard Studio schema.

CREATE TABLE IF NOT EXISTS fingerprints (
    id SERIAL PRIMARY KEY,
    asset_hash TEXT UNIQUE NOT NULL,
    wallet_address TEXT NOT NULL,
    title TEXT,
    category TEXT,
    tags TEXT[],
    embedding FLOAT8[],
    asa_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ownership_history (
    id SERIAL PRIMARY KEY,
    asset_hash TEXT NOT NULL,
    from_wallet TEXT NOT NULL,
    to_wallet TEXT NOT NULL,
    tx_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_listings (
    id SERIAL PRIMARY KEY,
    asset_hash TEXT UNIQUE NOT NULL,
    asa_id BIGINT NOT NULL,
    seller_wallet TEXT NOT NULL,
    title TEXT,
    category TEXT,
    price_algo FLOAT NOT NULL,
    status TEXT DEFAULT 'listed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    asa_id BIGINT NOT NULL,
    buyer_wallet TEXT NOT NULL,
    seller_wallet TEXT NOT NULL,
    price_algo FLOAT NOT NULL,
    tx_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bounties (
    id SERIAL PRIMARY KEY,
    client_wallet TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    prize_algo FLOAT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'open',
    tx_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bounty_submissions (
    id SERIAL PRIMARY KEY,
    bounty_id INTEGER REFERENCES bounties(id),
    creator_wallet TEXT NOT NULL,
    submission_url TEXT,
    note TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS creator_profiles (
    id SERIAL PRIMARY KEY,
    freelancer_id TEXT UNIQUE NOT NULL,
    freelancer_name TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    portfolio_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

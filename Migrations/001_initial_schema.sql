-- ============================================
-- CONCENTRIC DATABASE
-- Version: 1.0
-- Migration: 001_initial_schema.sql
-- ============================================

create extension if not exists "pgcrypto";
create table onion_layers (
    id uuid primary key default gen_random_uuid(),

    code text unique not null,
    name text not null,

    priority integer not null,

    color text not null,

    description text,

    review_multiplier numeric(4,2) default 1.0,

    created_at timestamptz default now()
);

create table subjects (
    id uuid primary key default gen_random_uuid(),

    code text unique not null,

    name text not null,

    icon text,

    display_order integer default 0,

    is_active boolean default true,

    created_at timestamptz default now()
);
create table chapters (
    id uuid primary key default gen_random_uuid(),

    subject_id uuid not null references subjects(id) on delete cascade,

    code text unique not null,

    chapter_number integer not null,

    name text not null,

    display_order integer default 0,

    estimated_cards integer default 0,

    estimated_notes integer default 0,

    is_premium boolean default false,

    created_at timestamptz default now()
);
create table topics (
    id uuid primary key default gen_random_uuid(),

    chapter_id uuid not null references chapters(id) on delete cascade,

    code text unique not null,

    topic_number integer not null,

    name text not null,

    display_order integer default 0,

    estimated_cards integer default 0,

    estimated_notes integer default 0,

    created_at timestamptz default now()
);

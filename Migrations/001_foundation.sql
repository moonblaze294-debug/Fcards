-- =====================================================
-- CONCENTRIC DATABASE
-- Migration 001 - Foundation
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- PRIORITY LAYERS
-- =====================================================

create table onion_layers (
    id uuid primary key default gen_random_uuid(),

    code text not null unique,
    name text not null,
    priority smallint not null unique,
    color text not null,
    description text,

    created_at timestamptz not null default now()
);

-- =====================================================
-- SUBJECTS
-- =====================================================

create table subjects (
    id uuid primary key default gen_random_uuid(),

    code text not null unique,
    name text not null,
    slug text not null unique,

    icon text,

    display_order integer not null default 0,

    is_active boolean not null default true,

    created_at timestamptz not null default now()
);

-- =====================================================
-- CHAPTERS
-- =====================================================

create table chapters (
    id uuid primary key default gen_random_uuid(),

    subject_id uuid not null
        references subjects(id)
        on delete cascade,

    code text not null unique,

    chapter_number integer not null,

    name text not null,

    slug text not null,

    description text,

    display_order integer not null default 0,

    is_premium boolean not null default false,

    created_at timestamptz not null default now(),

    unique(subject_id, chapter_number)
);

-- =====================================================
-- TOPICS
-- =====================================================

create table topics (
    id uuid primary key default gen_random_uuid(),

    chapter_id uuid not null
        references chapters(id)
        on delete cascade,

    code text not null unique,

    topic_number integer not null,

    name text not null,

    slug text not null,

    description text,

    display_order integer not null default 0,

    created_at timestamptz not null default now(),

    unique(chapter_id, topic_number)
);

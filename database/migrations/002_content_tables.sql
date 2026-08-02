-- =====================================================
-- CONCENTRIC DATABASE
-- Migration 002 - Content Tables
-- =====================================================

-- =====================================================
-- FLASHCARDS
-- =====================================================

create table flashcards (
    id uuid primary key default gen_random_uuid(),

    code text not null unique,

    topic_id uuid not null
        references topics(id)
        on delete cascade,

    layer_id uuid not null
        references onion_layers(id),

    front text not null,

    back text not null,

    explanation text,

    difficulty smallint not null default 2
        check (difficulty between 1 and 3),

    pyq_count integer not null default 0,

    last_asked_year integer,

    examiner_tip text,

    sort_order integer not null default 0,

    status text not null default 'draft'
        check (status in ('draft','published','archived')),

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);

-- =====================================================
-- NOTES
-- =====================================================

create table notes (
    id uuid primary key default gen_random_uuid(),

    topic_id uuid not null unique
        references topics(id)
        on delete cascade,

    title text not null,

    content text not null,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now()
);

-- =====================================================
-- TAGS
-- =====================================================

create table tags (
    id uuid primary key default gen_random_uuid(),

    code text not null unique,

    name text not null unique,

    color text,

    icon text,

    description text,

    created_at timestamptz not null default now()
);

-- =====================================================
-- TOPIC TAGS
-- =====================================================

create table topic_tags (
    topic_id uuid not null
        references topics(id)
        on delete cascade,

    tag_id uuid not null
        references tags(id)
        on delete cascade,

    primary key (topic_id, tag_id)
);

-- =====================================================
-- FLASHCARD TAGS
-- =====================================================

create table flashcard_tags (
    flashcard_id uuid not null
        references flashcards(id)
        on delete cascade,

    tag_id uuid not null
        references tags(id)
        on delete cascade,

    primary key (flashcard_id, tag_id)
);

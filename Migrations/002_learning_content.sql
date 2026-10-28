-- =====================================================
-- CONCENTRIC DATABASE
-- Migration 002 - Learning Content
-- =====================================================

-- =====================================================
-- CARDS
-- =====================================================

create table cards (
    id uuid primary key default gen_random_uuid(),

    code text not null unique,

    topic_id uuid not null
        references topics(id)
        on delete cascade,

    layer_id uuid not null
        references onion_layers(id),

    question text not null,

    answer text not null,

    explanation text,

    mnemonic text,

    image_url text,

    sort_order integer not null default 0,

    is_active boolean not null default true,

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

    reference_book text,

    edition text,

    page_start integer,

    page_end integer,

    updated_at timestamptz not null default now(),

    created_at timestamptz not null default now()
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
-- CARD TAGS
-- =====================================================

create table card_tags (

    card_id uuid not null
        references cards(id)
        on delete cascade,

    tag_id uuid not null
        references tags(id)
        on delete cascade,

    primary key(card_id, tag_id)
);

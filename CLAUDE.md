# Bara-v1

## Description
Personal productivity suite - a comprehensive application for managing tasks, notes, time tracking, and personal organization

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Supabase (Auth & Database)
- Tailwind CSS
- Radix UI

## Project Conventions
- Follow the global conventions from parent CLAUDE.md
- Two-actor development model (see TWO_ACTOR_MODEL.md)
- Session-based implementation (~45 min chunks)
- Aggressive permissions enabled for Claude Code

## Context Management
- **New Chat?** Use prompt in NEW_CHAT_PROMPT.md
- **Quick Status:** Run ./status.sh
- **Current State:** See CURRENT_STATE.md
- **Generate Prompt:** ./generate-context-prompt.sh | pbcopy

## CRITICAL SESSION PROTOCOL
- **MANDATORY:** Check CRITICAL_CHECKS_PROTOCOL.md before marking ANY session complete
- **Database Migrations:** If migrations fail, mark session as BLOCKED, not completed
- **Blocking Issues:** Report at TOP of session status with severity levels
- **Verification:** All features must be testable or session is incomplete

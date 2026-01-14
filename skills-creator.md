---
name: "meeting-notes"
description: "Transform meeting transcripts or raw notes into structured summaries with action items, decisions, and follow-ups. Use when user shares meeting content or asks for meeting notes."
version: "1.0.0"
---

# Meeting Notes Skill

## When to Use
- User shares a meeting transcript
- User asks to summarize meeting notes
- User mentions "action items" or "meeting summary"

## Procedure
1. Extract action items with owners and deadlines
2. Highlight decisions made (with who made them)
3. Summarize discussion points (don't transcribe verbatim)
4. Flag open questions for follow-up
5. Keep to one page maximum

## Output Format
**Action Items** (top of document)
- [ ] Task — Owner — Deadline

**Decisions Made**
- Decision: [what] — Made by: [who]

**Discussion Summary**
Brief bullets, not transcription.

**Open Questions**
- Question needing follow-up
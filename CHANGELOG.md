# Changelog

Hosted interface versions and the legacy adapter package version are separate. Discover the live server's tools and permissions before acting.

## Hosted interface 0.6.0 — public documentation

- Lead with the no-install hosted OAuth connection rather than the old stdio setup.
- Document account preferences, strategy catalogs, exact timeframes and template creation, editing, deletion and application.
- Document supported trade/review fields, journal stops/targets, notes and source-protected manual lifecycle corrections.
- Explain optional permissions, immutable previews, explicit confirmation, saved-state verification, retries and conflicts.
- State the limits: no exchange orders, synced-execution rewriting or hosted chat screenshot ingestion.

This documentation update does not release a new adapter package, change the hosted server, change existing grants or establish end-to-end verification in every AI client.

## Legacy adapter 0.1.0

The original read-only stdio adapter and `v0.1.0` tag are retained unchanged. Historical installation instructions are in [the legacy reference](docs/legacy-adapter.md). It does not gain hosted journal-write tools from this documentation update.

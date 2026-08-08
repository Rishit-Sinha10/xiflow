# Changelog

All notable changes to VRTX (football lineup platform) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Frontend
- Landing page with premium hero, feature showcases, and product marketing sections
- Dashboard with quick stats (lineup/team counts), recent lineups, teams, and quick actions
- Lineup Builder (`/builder`) with drag-and-drop player placement and pitch rendering
- Formation switching across seven formations: 4-3-3, 4-3-3 Attack, 4-3-3 Holding, 4-4-2, 4-5-1, 4-2-1-3, 4-2-3-1
- Lineup management screens: list, detail (`/lineups/[id]`), and create (`/lineups/create`)
- Read-only shared lineup view (`/share/[accessCode]`) with share-link creation flow
- Team management: list, detail (`/teams/[id]`), and create (`/teams/create`) with team badge/color customization
- Player search and assignment with real player data and cached player service
- Stats dashboard with activity timeline, formation usage, sharing reach, and top players widgets
- Public pages for documentation, support, privacy policy, and terms of service
- Auth modal with email/password and social login, protected routes (`RequireAuth`)
- Theme context with light/dark mode, lineup and team state contexts
- Shared component library: Button, Badge, Modal, Toast, Skeleton, Empty, ConfirmDialog, Field, Loading
- Motion and reveal animations via Framer Motion; animated SVG signature assets
- Open Graph image generation API route (`/api/og`)
- Firebase client integration (`src/lib/firebase.js`) and typed API client (`src/lib/api.js`)

#### Backend
- Express server with layered architecture (routes / controllers / services)
- Firebase Admin initialization, JWT auth middleware, global error handler, request logging, and input validation
- Authentication routes: register, login, verify token, profile management
- Lineup routes: full CRUD plus duplication and stats
- Team routes: CRUD plus member add/remove
- Player routes: listing, search, filtering by team/position, and cache sync from external data (`fifa_players.csv`)
- Sharing routes: create share links, access shared lineups, delete links, share stats
- Stats routes: user and lineup analytics
- Zod validation and centralized constants/configuration
- `probe-roles.mjs` helper script for debugging Firestore roles

### Changed
- Migrated pitch, formation, and player components to the new component architecture under `src/components/`
- Replaced legacy `pages`/`login` structure with App Router routes
- Split monolithic frontend API/context code into per-domain services and contexts

### Removed
- Legacy `frontend/src/api/protected`, `frontend/src/login`, and `frontend/src/lib/firebase.config.js` (secrets no longer tracked)
- Firebase Admin SDK usage from the frontend (server-side only now)

## [0.1.0] - 2026-07-03

### Added
- Initial Next.js frontend foundation
- Responsive football pitch component (`Pitchlines.js`)
- Formation builder with seven formations and player slots (`formationBuilder.js`, `player.js`, `playerSlot.js`)
- Formation definitions library (`src/lib/formations.js`)
- Firebase client configuration skeleton
- Backend scaffold committed to the repository
- `.gitignore` corrections to stop tracking Firebase configuration and build artifacts

[Unreleased]: https://github.com/Ramesh1234-ai/vrtx/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Ramesh1234-ai/vrtx/releases/tag/v0.1.0

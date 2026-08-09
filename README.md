# xiflow
xiflow is a premium football platform for building, saving, sharing, and evolving tactical lineups. The product is designed to feel polished, modern, and intuitive while remaining original in experience and product direction.
## Overview
This project is being built as both a product experience and a portfolio-grade full-stack application. The current implementation focuses on a responsive football pitch and formation-based lineup builder, with a roadmap toward a broader football workspace for fans, coaches, analysts, and community creators.
## Product Vision
The long-term goal is to create a differentiated football platform that combines:
- the clarity of modern sports products
- the tactical depth of coaching and analysis tools
- the elegance and speed of premium SaaS interfaces
The experience should feel like a premium operating layer for football strategy rather than a simple lineup editor.
## Core Product Goals
The platform should allow users to:
- build and customize tactical lineups
- switch between formations quickly
- place players visually on a football pitch
- save and revisit lineups
- create custom teams
- search and assign players
- share lineups through unique URLs
- collaborate in real time in future versions
- explore tactical insights and AI-enhanced analysis later
## Design Principles
- premium and minimal visual language
- responsive layouts for mobile, tablet, and desktop
- accessible and keyboard-friendly interactions
- scalable architecture over quick fixes
- modular frontend structure with clear separation of concerns
- polished UX that feels intentional rather than cluttered
## Current Status
The frontend currently includes
- a responsive football pitch experience
- formation selection controls
- support for seven formations:
  - 4-3-3
  - 4-3-3 Attack
  - 4-3-3 Holding
  - 4-4-2
  - 4-5-1
  - 4-2-1-3
  - 4-2-3-1
Backend infrastructure is not yet implemented, but the architecture is being designed to support it cleanly.
## MVP Scope
The first production milestone should focus on the following experience:
1. lineup builder with formation switching
2. player placement and tactical editing
3. saved lineups
4. custom team creation
5. player search and assignment
6. shareable lineup links
7. authentication and persistence
## Recommended Tech Stack
### Frontend
- Next.js App Router
- React
- Tailwind CSS
- modern component architecture
- responsive UI patterns
### Backend and Data
- Supabase for authentication, database, storage, and realtime features
- Prisma ORM for structured data modeling
- PostgreSQL as the primary database
### Interaction and Motion
- Framer Motion for motion and transitions
- dnd-kit for drag-and-drop interactions
### Future Enhancements
- TypeScript migration
- AI tactical analysis
- live football data integration
- player profiles and statistics
## Proposed Architecture
### Frontend Layer
- app shell for authenticated and guest experiences
- reusable UI components for pitch, formations, player cards, and team controls
- state management around lineup, formation, and team context
### Backend Layer
- authentication service
- lineup management service
- team and roster service
- sharing service for public or private links
- collaboration service for future real-time editing
### Data Model Concepts
Core entities include:
- User
- Team
- Lineup
- Player
- Formation
- ShareLink
- CollaborationSession
## Planned API Surface
The backend should expose domain-oriented endpoints such as:
- POST /api/lineups
- GET /api/lineups/:id
- PATCH /api/lineups/:id
- DELETE /api/lineups/:id
- POST /api/teams
- GET /api/teams/:id
- POST /api/share
- GET /api/share/:token
## Recommended Project Structure
A scalable structure for this app should follow a product-oriented layout:
- app/ for routes and layouts
- components/ for reusable UI elements
- features/ for domain modules such as lineup builder and team management
- lib/ for utilities and shared logic
- services/ for API and backend integration
- types/ for shared contracts and data models
## Local Development
### Prerequisites
- Node.js 20+
- npm, pnpm, or bun
### Install Dependencies
```bash
npm install
```
### Start the Development Server
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.
### Build and Validate
```bash
npm run build
npm run lint
```
## Environment Variables
For production and backend integration, the app should use environment variables such as:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
## Production Deployment Guide
### Frontend
- Deploy the Next.js app on Vercel
- Configure environment variables in Vercel
- Enable production builds and preview deployments
### Backend
- Deploy API services on Render
- Use Supabase for authentication, database, storage, and realtime
- Configure secure secrets and service roles only on the server side
### Recommended Production Checklist
- secure environment variables
- production-ready auth flows
- database migrations and backup strategy
- validation and error handling for all API routes
- performance monitoring and analytics
- responsive accessibility testing
- SEO and metadata setup for shareable pages
## Development Roadmap
### Phase 1: Foundation
- finalize the core UI shell
- improve pitch editing interactions
- implement saved lineups
- add team creation flow
### Phase 2: Product Depth
- add player search and filtering
- enable shareable lineup links
- introduce authentication and persistence
### Phase 3: Collaboration and Intelligence
- add real-time collaboration
- support advanced tactical insights
- integrate richer player data and analytics
## Portfolio Value
This project is intended to demonstrate:
- senior-level frontend architecture
- strong product thinking and UI/UX execution
- scalable full-stack implementation strategy
- thoughtful system design decisions
- a polished modern web product experience
The goal is not to clone an existing football application, but to build a premium and original football platform with a strong product identity.
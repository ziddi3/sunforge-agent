# Devpost Submission Draft

## Project Name

SunForge Agent

## Tagline

A Gemini-powered project intelligence agent for complex builder ecosystems.

## Inspiration

Builders often accumulate private repositories, public deployments, architecture notes, assets, and release tasks across disconnected tools. Traditional project management systems track tickets and files, but they do not understand how those pieces relate to each other.

SunForge Agent was built to solve that operational problem.

## What It Does

SunForge Agent audits a project ecosystem using sanitized metadata. It maps repositories to deployments, classifies components by role, detects architecture drift, flags public/private boundaries, and creates the next build plan.

## How We Built It

- Google Cloud Agent Builder for agent orchestration
- Gemini for reasoning and planning
- MongoDB MCP for project memory and audit records
- MongoDB Atlas for structured ecosystem data
- Cloud Run for the demo API
- Lightweight web dashboard for the audit console

## Why It Matters

Complex builders often have valuable systems spread across many private repositories and deployed services. SunForge Agent creates a safer way to reason about that ecosystem without exposing protected source code.

## What Makes It Different

Instead of being a chatbot, SunForge Agent behaves like a systems auditor. It reads project records, applies rules, detects drift, and produces tasks that can be acted on immediately.

## Challenges

The biggest challenge was designing a public demo that proves the value of the agent while keeping the real ecosystem private.

## Accomplishments

- Defined a safe public/private demo boundary
- Created a project ecosystem audit workflow
- Built sanitized sample data for repositories and deployments
- Designed MongoDB-backed audit memory
- Produced a clear three-minute demo plan

## What's Next

- Complete MongoDB MCP integration
- Add live audit report persistence
- Deploy demo dashboard
- Add GitHub metadata import for repositories the user authorizes
- Add deployment checks for frontend and backend services

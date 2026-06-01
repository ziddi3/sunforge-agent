# SunForge Agent

**SunForge Agent** is a Gemini-powered creator operations agent for the **Google Cloud Rapid Agent Hackathon**.

It helps creators turn scattered lore, characters, art, music, metadata, and launch planning into structured, launch-ready project operations.

## Hackathon Track

**MongoDB MCP Track**

## Core Mission

SunForge Agent acts as a launch operator for complex creator universes.

It can:

- Organize fictional universe data
- Check canon consistency
- Track art, music, chapter, and metadata readiness
- Create launch checklists
- Generate release audit reports
- Store and retrieve project state through MongoDB MCP tools
- Assist creators under human oversight

## Planned Stack

- Google Cloud Agent Builder
- Gemini
- MongoDB MCP Server
- Google Cloud Run
- Node.js backend
- Web dashboard frontend

## Repository Structure

```text
app/
  frontend/
  backend/
agent/
  instructions.md
  tools.md
  workflows.md
data/
  sample-starseeds.json
  sample-characters.json
  sample-assets.json
  sample-launch-vault.json
docs/
  architecture.md
  demo-script.md
  devpost-submission.md
```

## Demo Mission

> Prepare the First Sun Drop for launch.

The agent inspects the selected Starseed, checks related assets and canon rules, creates missing launch tasks, and generates a release readiness report.

## License

MIT

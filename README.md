#  RFP Agentic AI System

## Overview
This project is an **agentic AI system** designed to automate enterprise RFP (Request for Proposal) analysis.  
It replaces manual RFP review with a structured, multi-agent workflow that evaluates requirements, matches products, and supports proposal creation.

---

##  Key Features
- Automated RFP processing
- Agent-based orchestration (Sales, Technical, Pricing)
- AI-powered (mock-first) specification matching
- Stable, reproducible results for demos
- Production-ready AI integration with safe fallback
- Secure backend and deployment architecture

---

##  Agentic Architecture

### Sales Agent
- Ingests and processes incoming RFPs
- Extracts high-level requirements

### Technical Agent
- Evaluates RFP requirements against OEM product specifications
- Computes a **spec-match percentage** using an AI reasoning layer

### Pricing Agent
- Prepares pricing-ready outputs for proposals

Each agent operates independently and communicates via APIs, enabling modular and scalable design.

---

##  AI Integration Strategy

The Technical Agent includes an AI reasoning layer for specification matching.

### Mock Mode (Default)
- Deterministic AI-like reasoning
- Stable and reproducible results for demos
- No external API dependency

### Real Mode (Production-Ready)
- Supports live LLM integration (e.g., OpenAI)
- Can be enabled via environment variables without code changes

This mirrors real-world enterprise systems where AI services may be rate-limited or unavailable.

---

## Environment Configuration

AI behavior is controlled using environment variables:

.env
AI_MODE = MOCK

To enable live AI in production:

AI_MODE=REAL
OPENAI_API_KEY=api_key_here

**Tech Stack**

Frontend: React (Vite)
Backend: Node.js, Express
Deployment: Render / Vercel
AI Layer: Mock-first LLM integration (OpenAI-ready)

**Why This Matters**

- Reduces RFP response time from days to minutes
- Improves consistency and accuracy
- Demonstrates scalable, enterprise-grade agentic AI architecture
- 
**This repository focuses on architecture, agent orchestration, and AI integration patterns.
The mock-first AI approach ensures reliability while remaining fully production-ready.**

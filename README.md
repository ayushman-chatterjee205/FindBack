# FindBack - AI-Powered Campus Lost & Found System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20pgvector-336791.svg?style=flat&logo=postgresql&logoColor=white)](https://github.com/pgvector/pgvector)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

FindBack is an automated, high-precision lost and found management platform built specifically for college campuses. It combines **multi-signal AI matching** (visual embeddings, semantic text, campus spatial graphs, and temporal decay) with strict anti-fraud verification and secure QR/PIN custody handover.

---

## 👨‍💻 Creator & Engineering Lead

* **Ayushman Chatterjee** (Roll No: `2563002`)
* *Department of Computer Science & Engineering (IoT & Cyber Security including Blockchain Technology)*
* *Heritage Institute of Technology, Kolkata*

---

## 🏛 System Architecture

The project is arranged as a modular monorepo:

- **`frontend/`**: Next.js 14+ (App Router), React, Tailwind CSS, TypeScript web application for students and security staff. Includes built-in responsive mobile simulation.
- **`backend/`**: FastAPI (Python 3.11+) asynchronous REST API with SQLAlchemy ORM, pgvector, and multi-signal AI matching engine.
- **`docs/`**: Comprehensive documentation, architectural master guide, presentations, and specification papers.
- **Database**: PostgreSQL 16 with `pgvector` extension for vector similarity search (or SQLite with vector fallback for local offline testing).

---

## 🚀 Quick Start (Docker)

To run the entire platform locally with PostgreSQL (pgvector enabled):

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/FindBack.git
cd FindBack

# 2. Configure environment variables
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Start PostgreSQL, Redis, Backend, and Frontend containers
docker-compose up --build
```

* **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
* **FastAPI Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **PostgreSQL / pgvector**: `localhost:5432`

---

## 🛠 Manual Local Development Setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv

# Windows Powershell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt

# Run migrations & seed campus registry
python scripts/seed_campus.py

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install

# Start development server
npm run dev
```

---

## 📱 Interactive Mobile Simulation Mode

For live demo and evaluation presentations, FindBack includes a built-in mobile device viewport simulator:
* Press **`Ctrl + M`** anywhere on the desktop site, or
* Click the floating **`[DEMO: Mobile]`** pill in the bottom-right corner.
* Provides an interactive iPhone frame with dynamic screen navigation and responsive touch verification.

---

## 🧠 AI Multi-Signal Matching Engine

FindBack evaluates candidate matches using a 4-dimensional composite score:

$$S_{\text{composite}} = (0.35 \cdot S_{\text{text}} + 0.35 \cdot S_{\text{image}} + 0.15 \cdot S_{\text{spatial}} + 0.15 \cdot S_{\text{temporal}}) \times 100$$

1. **Text Semantic Similarity ($S_{\text{text}}$, 35%)**: 384-dimensional dense semantic embeddings (Sentence-Transformers / MiniLM) measuring cosine similarity across title, category, brand, and description.
2. **Visual Feature Similarity ($S_{\text{image}}$, 35%)**: 512-dimensional visual embeddings comparing form factor, geometry, contours, and color palette.
3. **Spatial Hierarchy ($S_{\text{spatial}}$, 15%)**: Topological campus graph across 5 blocks (CME, Central, ICT, Mechanical, Science) scoring room, floor, and block proximity.
4. **Temporal Decay ($S_{\text{temporal}}$, 15%)**: Exponential decay $\exp(-\lambda \cdot \Delta t_{\text{days}})$ with causality guards penalizing impossible discovery timestamps.

* **Score $\ge$ 75%**: Triggers proactive notifications to the student.
* **35% $\le$ Score < 75%**: Displayed in the candidate suggestion catalog.

---

## 🔒 Anti-Fraud & Custody Handover

1. **Masked Public Details**: Private identifiers (stickers, serial numbers, wallpapers) are kept hidden from public listings.
2. **Blind Proof-of-Ownership**: Claimant must supply verified answers to private distinguishing marks before approval.
3. **Two-Factor Custody Handover**: Once approved, student presents a dynamic 15-minute OTP / QR code scanned by staff to finalize physical return and write an immutable audit trail.

---

## 📄 Documentation & Reports

Detailed design specifications and presentations are located in the [`docs/`](./docs) folder:
* **`docs/FindBack_Master_Guide_and_Architecture.docx`**: Full engineering specification and system blueprint.
* **`docs/FindBack_Project_Report.pdf`**: Comprehensive academic project report.
* **`docs/FindBack_Project_Presentation.pptx`**: 10-slide high-impact presentation deck.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

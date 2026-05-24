# H-ESDM+ Backend — Flask + PostgreSQL

## Setup Instructions

### 1. Clone and Navigate
```bash
git clone https://github.com/SubhraC-prog/Verifas.ai.git
cd Verifas.ai/backend
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Database
```bash
cp .env.example .env
# Edit .env and add your PostgreSQL connection string
```

### 5. Initialize Database
```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 6. Run Development Server
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/pipeline/submit` — Submit PICO form
- `GET /api/pipeline/status/<id>` — Check pipeline status
- `GET /api/results/<id>` — Retrieve analysis results

## Database Schema

- `users` — User authentication
- `pipelines` — Pipeline submissions
- `pico_data` — PICO extraction results
- `analysis_results` — Final outputs

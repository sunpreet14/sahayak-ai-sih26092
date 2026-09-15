# Sahayak AI connection

The teammate frontend now opens the ORIGINAL Sahayak AI interface when Get Started is clicked.

## Run

### Terminal 1 — MongoDB/Express profile server
```powershell
cd backend
npm install
node server.js
```

### Terminal 2 — React frontend
```powershell
cd frontend
npm install
npm run dev
```

### Terminal 3 — Original Sahayak AI engine
```powershell
cd sahayak_backend
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

Open the React/Vite website and click **Get Started**. It opens the original Sahayak AI interface at `/sahayak/index.html`.

The original Sahayak UI is preserved. Its recommendation button calls the original FastAPI `/smart-text` endpoint on port 8000.

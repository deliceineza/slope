# Land Suitability and Construction Permit Assessment System

## Run the backend

1. Open a terminal in `c:\Users\user\Documents\slope\backend`
2. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Start FastAPI:
   ```powershell
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

## Run the frontend

1. Open a second terminal in `c:\Users\user\Documents\slope\frontend`
2. Install frontend packages if not already installed:
   ```powershell
   npm install
   ```
3. Start Vite:
   ```powershell
   npm run dev
   ```

## What it does

- Frontend sends a POST request to `http://localhost:8000/analyze`
- Backend returns permit status and land value
- Frontend displays results in responsive cards

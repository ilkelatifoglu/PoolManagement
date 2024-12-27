# Pool Management System

## Project Setup

### Backend Setup

1. Create and activate virtual environment:

```bash
cd backend
python -m venv venv

# on Mac/Linux
source venv/bin/activate

# on Windows
venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create .env file in backend directory including the following variables:

```env
MYSQL_HOST=your_rds_host
MYSQL_USER=your_rds_username
MYSQL_PASSWORD=your_rds_password
MYSQL_PORT=your_rds_port
MYSQL_DATABASE=pool_management
```

4. Run Flask server:

```bash
flask run
```

Server will run on http://localhost:5000 as default

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create .env file in frontend directory including the following variables:

```env
REACT_APP_API_URL=http://localhost:5000/
```

3. Start development server:

```bash
npm start
```

Frontend will run on http://localhost:3000 as default

### Project Structure

```
PoolManagement/
├── backend/                      # Python Flask server
│   ├── database/                # Database configurations and models
│   │   ├── queries/            # SQL query templates and database operations
│   │   └── schemas/            # Database table definitions and migrations
│   ├── routes/                  # API endpoint definitions
│   ├── services/                # Business logic and data processing
│   ├── utils/                   # Helper functions and utilities
│   ├── app.py                   # Main application entry point
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # Backend environment variables
└── frontend/                    # React application
    ├── public/
    ├── src/                     # React source code
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.js
    │   └── index.js
    ├── package.json             # Node.js dependencies and scripts
    ├── package-lock.json
    └── .env                     # Frontend environment variables
```

### Important Notes

- Always activate virtual environment using `source venv/bin/activate` on Mac/Linux or `venv\Scripts\activate` on Windows when working on backend
- Run both frontend and backend servers during development

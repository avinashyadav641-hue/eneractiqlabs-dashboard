# Telemetry Analytics API

Read-only analytics backend serving Parquet telemetry data from S3 via DuckDB.

## Architecture

```
Frontend (Vercel)
        ↓ REST
FastAPI (Python)
        ↓ SQL
DuckDB
        ↓
Amazon S3 (Parquet)
```

## Project Structure

```
backend-analytics/
├── main.py              # FastAPI application
├── db.py                # DuckDB connection manager
├── settings.py          # Environment configuration
├── queries/             # SQL query files
│   ├── overview.sql
│   ├── daily_summary.sql
│   ├── devices.sql
│   └── device_latest.sql
├── requirements.txt
├── Dockerfile
├── .env.example
└── README.md
```

## Prerequisites

- Python 3.10+
- AWS credentials configured (IAM role or access keys)
- S3 bucket with Parquet files

### Expected Parquet Schema

Your telemetry Parquet files should contain these columns:
- `device_id` (string) - Device identifier
- `timestamp` (datetime) - Record timestamp
- `voltage` (float) - Voltage reading
- `temperature` (float) - Temperature reading
- `soc` (float) - State of charge

## Local Development

### 1. Setup

```bash
cd backend-analytics

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your S3 bucket details
```

### 2. Configure `.env`

```env
S3_BUCKET=your-telemetry-bucket
S3_PREFIX=telemetry/
AWS_REGION=us-east-1

# For local dev with explicit credentials
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### 3. Run

```bash
uvicorn main:app --reload --port 8000
```

API available at: http://localhost:8000

Docs at: http://localhost:8000/docs

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /overview` | Total rows, device count, time range |
| `GET /daily-summary` | Per-device daily avg voltage, max temp, avg SOC |
| `GET /devices` | List all devices with summary |
| `GET /devices/latest` | Latest reading per device |

## Deployment

### Option 1: Render

1. Create new Web Service
2. Connect your GitHub repo
3. Set environment variables:
   - `S3_BUCKET`
   - `S3_PREFIX`
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT`

### Option 2: Railway

1. Create new project from GitHub
2. Add environment variables in Railway dashboard
3. Railway auto-detects Python and uses the Dockerfile

### Option 3: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (from backend-analytics directory)
fly launch

# Set secrets
fly secrets set S3_BUCKET=your-bucket
fly secrets set S3_PREFIX=telemetry/
fly secrets set AWS_REGION=us-east-1
fly secrets set AWS_ACCESS_KEY_ID=xxx
fly secrets set AWS_SECRET_ACCESS_KEY=xxx

# Deploy
fly deploy
```

### Option 4: Docker (any platform)

```bash
# Build
docker build -t telemetry-api .

# Run
docker run -p 8000:8000 \
  -e S3_BUCKET=your-bucket \
  -e S3_PREFIX=telemetry/ \
  -e AWS_REGION=us-east-1 \
  -e AWS_ACCESS_KEY_ID=xxx \
  -e AWS_SECRET_ACCESS_KEY=xxx \
  telemetry-api
```

## S3 Setup

### Bucket Structure

```
your-bucket/
└── telemetry/
    ├── day_001.parquet
    ├── day_002.parquet
    └── ...
```

### IAM Policy (minimal)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket",
        "arn:aws:s3:::your-bucket/telemetry/*"
      ]
    }
  ]
}
```

## Adding New Queries

1. Create SQL file in `queries/` folder
2. Use `{{S3_PATH}}` placeholder for the Parquet path
3. Call with `execute_query("your_query_name")`

Example:

```sql
-- queries/hourly_avg.sql
SELECT
    device_id,
    DATE_TRUNC('hour', timestamp) AS hour,
    AVG(voltage) AS avg_voltage
FROM read_parquet({{S3_PATH}})
GROUP BY device_id, DATE_TRUNC('hour', timestamp);
```

## Performance Notes

- DuckDB reads Parquet directly from S3 (no local copy)
- Single connection reused across requests
- Queries execute on columnar data (fast aggregations)
- Consider partitioning by date for large datasets

## License

MIT

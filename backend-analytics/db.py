"""
DuckDB connection manager with S3 integration.
Single connection reused across all requests.
"""
import duckdb
from settings import get_settings

# Module-level connection (singleton)
_connection: duckdb.DuckDBPyConnection | None = None


def _init_connection() -> duckdb.DuckDBPyConnection:
    """Initialize DuckDB with S3 credentials and httpfs extension."""
    settings = get_settings()
    
    conn = duckdb.connect(":memory:")
    
    # Install and load httpfs for S3 access
    conn.execute("INSTALL httpfs;")
    conn.execute("LOAD httpfs;")
    
    # Configure S3 access
    conn.execute(f"SET s3_region = '{settings.aws_region}';")
    
    # Use explicit credentials if provided
    if settings.aws_access_key_id and settings.aws_secret_access_key:
        conn.execute(f"SET s3_access_key_id = '{settings.aws_access_key_id}';")
        conn.execute(f"SET s3_secret_access_key = '{settings.aws_secret_access_key}';")
    
    return conn


def get_connection() -> duckdb.DuckDBPyConnection:
    """Get or create the singleton DuckDB connection."""
    global _connection
    if _connection is None:
        _connection = _init_connection()
    return _connection


def get_s3_base() -> str:
    """Get the S3 base path for all feature folders."""
    settings = get_settings()
    prefix = settings.s3_prefix.rstrip("/")
    return f"s3://{settings.s3_bucket}/{prefix}"

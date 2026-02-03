-- Overview statistics across all daily features data
-- Returns: total_rows, device_count, min_day, max_day

SELECT
    COUNT(*) AS total_rows,
    COUNT(DISTINCT drone_id) AS device_count,
    MIN(day_index) AS min_timestamp,
    MAX(day_index) AS max_timestamp
FROM read_parquet({{S3_PATH}});

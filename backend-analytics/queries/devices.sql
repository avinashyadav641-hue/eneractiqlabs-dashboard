-- List all available devices (drones)
-- Returns: device_id, first_seen (day), last_seen (day), total_records

SELECT
    drone_id AS device_id,
    MIN(day_index) AS first_seen,
    MAX(day_index) AS last_seen,
    COUNT(*) AS total_records
FROM read_parquet({{S3_PATH}})
GROUP BY drone_id
ORDER BY drone_id;

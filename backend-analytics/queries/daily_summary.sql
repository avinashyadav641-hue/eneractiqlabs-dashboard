-- Daily summary per device
-- Returns: device_id, day, avg_voltage, max_temperature, avg_soc, row_count

SELECT
    drone_id AS device_id,
    day_index AS date,
    ROUND(avg_cell_voltage_V, 3) AS avg_voltage,
    ROUND(max_pack_temp_C, 2) AS max_temperature,
    NULL AS avg_soc,
    1 AS row_count
FROM read_parquet({{S3_PATH}})
ORDER BY drone_id, day_index;

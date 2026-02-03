-- Latest record per device
-- Returns the most recent day's data for each drone

SELECT
    drone_id AS device_id,
    day_index AS timestamp,
    avg_cell_voltage_V AS voltage,
    avg_current_A AS current,
    avg_pack_temp_C AS temperature,
    NULL AS soc,
    NULL AS soh
FROM read_parquet({{S3_PATH}})
QUALIFY ROW_NUMBER() OVER (PARTITION BY drone_id ORDER BY day_index DESC) = 1
ORDER BY drone_id;

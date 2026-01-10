-- CreateTable
CREATE TABLE "TelemetrySample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "cycleIndex" REAL NOT NULL,
    "missionId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentA" REAL NOT NULL,
    "temperatureC" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TelemetrySample_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CellTelemetry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sampleId" TEXT NOT NULL,
    "cellIndex" INTEGER NOT NULL,
    "voltage" REAL NOT NULL,
    CONSTRAINT "CellTelemetry_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "TelemetrySample" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TelemetrySample_assetId_dayIndex_idx" ON "TelemetrySample"("assetId", "dayIndex");

-- CreateIndex
CREATE INDEX "TelemetrySample_assetId_cycleIndex_idx" ON "TelemetrySample"("assetId", "cycleIndex");

-- CreateIndex
CREATE INDEX "CellTelemetry_sampleId_idx" ON "CellTelemetry"("sampleId");

-- CreateIndex
CREATE INDEX "CellTelemetry_sampleId_cellIndex_idx" ON "CellTelemetry"("sampleId", "cellIndex");

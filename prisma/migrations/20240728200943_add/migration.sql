-- CreateTable
CREATE TABLE "SensorReading" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'ESP32',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

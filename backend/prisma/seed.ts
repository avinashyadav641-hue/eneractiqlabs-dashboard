import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Orca-001 asset
  const asset = await prisma.asset.upsert({
    where: { id: 'orca-001' },
    update: {},
    create: {
      id: 'orca-001',
      name: 'Orca 001',
    },
  })

  console.log(`✅ Created asset: ${asset.name}`)

  // Create state for Orca-001
  const state = await prisma.assetStateLatest.upsert({
    where: { assetId: 'orca-001' },
    update: {
      status: 'FLIGHT',
      soc: 72.0,
      soh: 98.0,
      isFlying: true,
      isCharging: false,
      criticalFaultCount: 0,
      timestamp: new Date(),
    },
    create: {
      assetId: 'orca-001',
      status: 'FLIGHT',
      soc: 72.0,
      soh: 98.0,
      isFlying: true,
      isCharging: false,
      criticalFaultCount: 0,
    },
  })

  console.log(`✅ Created state for ${asset.name}:`, {
    status: state.status,
    soc: state.soc,
    soh: state.soh,
    isFlying: state.isFlying,
  })

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

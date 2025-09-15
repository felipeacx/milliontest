const Database = require("./database")

async function showDatabaseStats() {
  const database = new Database()

  try {
    const db = await database.connect()
    const propertiesCollection = db.collection("properties")
    const ownersCollection = db.collection("owners")

    const totalProperties = await propertiesCollection.countDocuments()
    const totalOwners = await ownersCollection.countDocuments()

    console.log(`Dataset Overview:`)
    console.log(`  Properties: ${totalProperties}`)
    console.log(`  Owners: ${totalOwners}`)

    const propertyTypes = await propertiesCollection
      .aggregate([
        {
          $group: {
            _id: "$propertyType",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
          },
        },
        { $sort: { count: -1 } },
      ])
      .toArray()

    console.log("\nProperty Types:")
    propertyTypes.forEach((type) => {
      console.log(
        `  ${type._id}: ${type.count} (avg: $${Math.round(type.avgPrice).toLocaleString()})`
      )
    })

    const priceStats = await propertiesCollection
      .aggregate([
        {
          $group: {
            _id: null,
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ])
      .toArray()

    if (priceStats.length > 0) {
      const stats = priceStats[0]
      console.log(`\nPrice Statistics:`)
      console.log(
        `  Range: $${stats.minPrice.toLocaleString()} - $${stats.maxPrice.toLocaleString()}`
      )
      console.log(`  Average: $${Math.round(stats.avgPrice).toLocaleString()}`)
    }
  } catch (error) {
    console.error("Error showing stats:", error.message)
  } finally {
    await database.disconnect()
  }
}

if (require.main === module) {
  showDatabaseStats().catch(console.error)
}

module.exports = showDatabaseStats

const Database = require("./database")

async function runQueries() {
  const database = new Database()

  try {
    const db = await database.connect()
    const propertiesCollection = db.collection("properties")
    const ownersCollection = db.collection("owners")

    const allProperties = await propertiesCollection.find({}).toArray()
    console.log(`Total properties: ${allProperties.length}`)

    const priceRangeProperties = await propertiesCollection
      .find({ price: { $gte: 300000, $lte: 700000 } })
      .toArray()
    console.log(`Properties in $300K-$700K range: ${priceRangeProperties.length}`)

    const propertyTypes = await propertiesCollection
      .aggregate([
        { $group: { _id: "$propertyType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray()

    console.log("Property types:")
    propertyTypes.forEach((type) => {
      console.log(`  ${type._id}: ${type.count}`)
    })

    const featuredProperties = await propertiesCollection
      .find({ features: { $in: ["pool", "garden"] } })
      .toArray()
    console.log(`Properties with pool or garden: ${featuredProperties.length}`)

    const totalOwners = await ownersCollection.countDocuments()
    console.log(`Total owners: ${totalOwners}`)
  } catch (error) {
    console.error("Error running queries:", error.message)
  } finally {
    await database.disconnect()
  }
}

if (require.main === module) {
  runQueries().catch(console.error)
}

module.exports = runQueries

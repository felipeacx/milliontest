const Database = require("./database")
const { sampleProperties, sampleOwners, sampleCategories } = require("./sampleData")

async function populateDatabase() {
  const database = new Database()

  try {
    const db = await database.connect()

    const propertiesCollection = db.collection("properties")
    const ownersCollection = db.collection("owners")
    const categoriesCollection = db.collection("categories")

    const existingProperties = await propertiesCollection.countDocuments()
    const existingOwners = await ownersCollection.countDocuments()
    const existingCategories = await categoriesCollection.countDocuments()

    if (existingProperties > 0 || existingOwners > 0 || existingCategories > 0) {
      await propertiesCollection.deleteMany({})
      await ownersCollection.deleteMany({})
      await categoriesCollection.deleteMany({})
    }

    await categoriesCollection.insertMany(sampleCategories)
    await ownersCollection.insertMany(sampleOwners)
    await propertiesCollection.insertMany(sampleProperties)

    await propertiesCollection.createIndex({ name: "text", address: "text", description: "text" })
    await propertiesCollection.createIndex({ price: 1 })
    await propertiesCollection.createIndex({ propertyType: 1 })
    await propertiesCollection.createIndex({ isActive: 1 })
    await propertiesCollection.createIndex({ ownerId: 1 })
    await propertiesCollection.createIndex({ createdDate: -1 })
    await propertiesCollection.createIndex({ features: 1 })

    await ownersCollection.createIndex({ email: 1 }, { unique: true })
    await ownersCollection.createIndex({ name: 1 })

    await categoriesCollection.createIndex({ name: 1 }, { unique: true })

    const totalProperties = await propertiesCollection.countDocuments()
    const totalOwners = await ownersCollection.countDocuments()
    const totalCategories = await categoriesCollection.countDocuments()

    console.log(
      `Database populated: ${totalProperties} properties, ${totalOwners} owners, ${totalCategories} categories`
    )
  } catch (error) {
    console.error("Error populating database:", error.message)
  } finally {
    await database.disconnect()
  }
}

populateDatabase().catch(console.error)

module.exports = populateDatabase

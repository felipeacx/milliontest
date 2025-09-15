const Database = require("./database")

async function clearDatabase() {
  const database = new Database()

  try {
    const db = await database.connect()

    const collections = await db.listCollections().toArray()

    if (collections.length === 0) {
      console.log("Database is already empty.")
      return
    }

    let totalCleared = 0
    for (const collection of collections) {
      const col = db.collection(collection.name)
      const count = await col.countDocuments()

      if (count > 0) {
        await col.deleteMany({})
        totalCleared += count
      }
    }

    console.log(
      `Database cleared: ${totalCleared} documents removed from ${collections.length} collections`
    )
  } catch (error) {
    console.error("Error clearing database:", error.message)
  } finally {
    await database.disconnect()
  }
}

if (require.main === module) {
  clearDatabase().catch(console.error)
}

module.exports = clearDatabase

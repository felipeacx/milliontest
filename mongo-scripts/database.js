const { MongoClient } = require("mongodb")
const config = require("./config")

class Database {
  constructor() {
    this.client = null
    this.db = null
  }

  async connect() {
    try {
      this.client = new MongoClient(config.mongodb.url, config.mongodb.options)
      await this.client.connect()
      this.db = this.client.db(config.mongodb.databaseName)
      return this.db
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error.message)
      throw error
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()
    }
  }

  getDb() {
    return this.db
  }

  async isConnected() {
    if (!this.client) return false
    try {
      await this.client.db("admin").command({ ping: 1 })
      return true
    } catch {
      return false
    }
  }
}

module.exports = Database

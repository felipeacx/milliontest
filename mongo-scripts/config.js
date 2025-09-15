// config.js
require("dotenv").config()

module.exports = {
  mongodb: {
    url: process.env.MONGODB_URL || "mongodb://localhost:27017",
    databaseName: process.env.DATABASE_NAME || "technicaldb",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
}

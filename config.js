exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  "mongodb://localhost/good-dog"
exports.DATABASE_TEST_URL = "mongodb://localhost/good-dog-test"
exports.PORT = process.env.PORT || 8080
exports.JWT_SECRET = process.env.JWT_SECRET
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d"

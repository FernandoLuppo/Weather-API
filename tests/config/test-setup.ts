import mongoose from "mongoose"
import User from "../../src/model/User"
import RefreshToken from "../../src/model/RefreshToken"
import Pokemon from "../../src/model/Pokemon"

beforeAll(async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect("mongodb://localhost/PokemonTest")
  }
})

beforeEach(async () => {
  await Pokemon.deleteMany({})
  await RefreshToken.deleteMany({})
  await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.disconnect()
})

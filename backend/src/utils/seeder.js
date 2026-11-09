const mongoose = require("mongoose");
require("dotenv").config();
const { User } = require("../models");

const usersData = [

  {
    fullName: "Hayat Hossain",
    email: "rabbihossain872006+1@gmail.com",
    phoneNumber: "01735566789",
    password: "$2a$08$58Hf6zz/8PDpTwBsOnf6H.gUB7gvsS1uJedkygC/WaROeOnnFdoX2",
    role: "admin",
    isEmailVerified: true,
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log("Database dropped successfully!");
  } catch (err) {
    console.error("Error dropping database:", err);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await dropDatabase();
  await seedUsers();
  console.log("Database seeding completed!");
  mongoose.disconnect();
};

seedDatabase();
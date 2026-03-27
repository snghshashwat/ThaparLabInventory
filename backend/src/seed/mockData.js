require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Component = require("../models/Component");
const Transaction = require("../models/Transaction");

const ADMIN_EMAIL = "ssingh14_be23@thapar.edu";

const components = [
  {
    name: "Arduino Uno",
    componentId: "ELEC-ARD-001",
    available: 28,
    lab: "Electronics",
    threshold: 8,
  },
  {
    name: "Breadboard",
    componentId: "ELEC-BRD-002",
    available: 54,
    lab: "Electronics",
    threshold: 15,
  },
  {
    name: "Resistor Kit",
    componentId: "ELEC-RST-003",
    available: 72,
    lab: "Electronics",
    threshold: 20,
  },
  {
    name: "Capacitor Pack",
    componentId: "ELEC-CAP-004",
    available: 35,
    lab: "Electronics",
    threshold: 10,
  },

  {
    name: "Servo Motor",
    componentId: "ROBO-SRV-001",
    available: 18,
    lab: "Robotics",
    threshold: 6,
  },
  {
    name: "DC Motor",
    componentId: "ROBO-DCM-002",
    available: 25,
    lab: "Robotics",
    threshold: 8,
  },
  {
    name: "Motor Driver L298N",
    componentId: "ROBO-DRV-003",
    available: 14,
    lab: "Robotics",
    threshold: 5,
  },
  {
    name: "Ultrasonic Sensor",
    componentId: "ROBO-USS-004",
    available: 30,
    lab: "Robotics",
    threshold: 10,
  },

  {
    name: "Raspberry Pi Pico",
    componentId: "EMBD-PIC-001",
    available: 20,
    lab: "Embedded Systems",
    threshold: 7,
  },
  {
    name: "ESP32 Dev Board",
    componentId: "EMBD-ESP-002",
    available: 16,
    lab: "Embedded Systems",
    threshold: 6,
  },
  {
    name: "OLED Display",
    componentId: "EMBD-OLED-003",
    available: 22,
    lab: "Embedded Systems",
    threshold: 8,
  },
  {
    name: "GPIO Jumper Set",
    componentId: "EMBD-JMP-004",
    available: 60,
    lab: "Embedded Systems",
    threshold: 18,
  },

  {
    name: "NodeMCU",
    componentId: "IOT-NMC-001",
    available: 19,
    lab: "IoT",
    threshold: 7,
  },
  {
    name: "DHT11 Sensor",
    componentId: "IOT-DHT-002",
    available: 40,
    lab: "IoT",
    threshold: 12,
  },
  {
    name: "MQ2 Gas Sensor",
    componentId: "IOT-MQ2-003",
    available: 24,
    lab: "IoT",
    threshold: 8,
  },
  {
    name: "Relay Module",
    componentId: "IOT-RLY-004",
    available: 26,
    lab: "IoT",
    threshold: 9,
  },
];

const transactions = [
  {
    studentRoll: "102301001",
    items: [
      { componentId: "ELEC-ARD-001", name: "Arduino Uno", qty: 2 },
      { componentId: "ELEC-BRD-002", name: "Breadboard", qty: 2 },
    ],
    type: "take",
    lab: "Electronics",
    doneBy: ADMIN_EMAIL,
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
  },
  {
    studentRoll: "102301014",
    items: [{ componentId: "ROBO-SRV-001", name: "Servo Motor", qty: 3 }],
    type: "take",
    lab: "Robotics",
    doneBy: ADMIN_EMAIL,
    timestamp: new Date(Date.now() - 1000 * 60 * 32),
  },
  {
    studentRoll: "102301014",
    items: [{ componentId: "ROBO-SRV-001", name: "Servo Motor", qty: 1 }],
    type: "return",
    lab: "Robotics",
    doneBy: ADMIN_EMAIL,
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    studentRoll: "102301022",
    items: [
      { componentId: "EMBD-ESP-002", name: "ESP32 Dev Board", qty: 2 },
      { componentId: "EMBD-OLED-003", name: "OLED Display", qty: 2 },
    ],
    type: "take",
    lab: "Embedded Systems",
    doneBy: ADMIN_EMAIL,
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    studentRoll: "102301045",
    items: [{ componentId: "IOT-DHT-002", name: "DHT11 Sensor", qty: 4 }],
    type: "take",
    lab: "IoT",
    doneBy: ADMIN_EMAIL,
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    studentRoll: "102301045",
    items: [{ componentId: "IOT-DHT-002", name: "DHT11 Sensor", qty: 2 }],
    type: "return",
    lab: "IoT",
    doneBy: ADMIN_EMAIL,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
];

async function seed() {
  await connectDB();

  await Promise.all([Component.deleteMany({}), Transaction.deleteMany({})]);

  const insertedComponents = await Component.insertMany(components);
  await Transaction.insertMany(transactions);

  console.log(
    `Seed complete: ${insertedComponents.length} components, ${transactions.length} transactions`,
  );

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error("Seeding failed:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});

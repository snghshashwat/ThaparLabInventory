export const LAB_OPTIONS = [
  "Electronics",
  "Robotics",
  "Embedded Systems",
  "IoT",
  "Mechanical",
];

export const LAB_INSTRUCTORS = {
  Electronics: {
    name: "Dr. Rakesh Sharma",
    contact: "+91 98765 11001",
    location: "Block C, Room E-201",
  },
  Robotics: {
    name: "Dr. Meenal Kaur",
    contact: "+91 98765 11002",
    location: "Block C, Room R-104",
  },
  "Embedded Systems": {
    name: "Prof. Arvind Jain",
    contact: "+91 98765 11003",
    location: "Block D, Room ES-305",
  },
  IoT: {
    name: "Prof. Sneha Gupta",
    contact: "+91 98765 11004",
    location: "Block D, Room IOT-110",
  },
  Mechanical: {
    name: "Prof. Vikram Saini",
    contact: "+91 98765 11005",
    location: "Mechanical Workshop, Bay 2",
  },
};

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", adminOnly: false },
  { label: "Transactions", path: "/transactions", adminOnly: true },
  { label: "Warnings", path: "/warnings", adminOnly: true },
  { label: "Logs", path: "/logs", adminOnly: true },
  { label: "Student Holdings", path: "/student-holdings", adminOnly: true },
  { label: "Inventory", path: "/inventory", adminOnly: true },
  { label: "Add Component", path: "/add-component", adminOnly: true },
];

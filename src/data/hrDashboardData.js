// CARD METRICS
export const hrStats = [
  {
    title: "Total Employees",
    value: 24,
    trend: "up",
    percent: 8,
    subtitle: "overall employees",
  },
  {
    title: "Aadhaar Pending",
    value: 4,
    trend: "down",
    percent: 2,
    subtitle: "need verification",
  },
  {
    title: "PAN Pending",
    value: 3,
    trend: "down",
    percent: 1,
    subtitle: "pending PAN upload",
  },
  {
    title: "Bank Pending",
    value: 2,
    trend: "down",
    percent: 1,
    subtitle: "bank details missing",
  },
  {
    title: "Address Pending",
    value: 5,
    trend: "down",
    percent: 3,
    subtitle: "address proof pending",
  },
  {
    title: "Pending Confirmation",
    value: 5,
    trend: "up",
    percent: 4,
    subtitle: "awaiting review",
  },
];

// CHART DATA
export const verificationChartData = [
  { name: "Address", completed: 19, pending: 5 },
  { name: "Aadhaar", completed: 20, pending: 4 },
  { name: "PAN", completed: 21, pending: 3 },
  { name: "Bank", completed: 22, pending: 2 },
];

export const employeeStatusFlow = [
  { stage: "Created", count: 24 },
  { stage: "Address Verified", count: 19 },
  { stage: "Aadhaar Verified", count: 20 },
  { stage: "PAN Verified", count: 21 },
  { stage: "Active", count: 22 },
  { stage: "Confirmed", count: 17 },
];

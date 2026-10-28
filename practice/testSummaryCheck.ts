import { getTestSummary, type TestResult } from "../utils/testSummary";

const testResults: TestResult[] = [
  { testId: "TC001", testName: "Admin Login", status: "Passed" },
  {
    testId: "TC002",
    testName: "User Creation",
    status: "Failed",
    defectId: "BUG-102",
  },
  { testId: "TC003", testName: "Report Download", status: "Blocked" },
  {
    testId: "TC004",
    testName: "User Deletion",
    status: "Failed",
    defectId: "BUG-105",
  },
  { testId: "TC005", testName: "Dashboard Loading", status: "Passed" },
];

const summary = getTestSummary(testResults);

console.log("Test Execution Summary");
console.log("Passed:", summary.passed);
console.log("Failed:", summary.failed);
console.log("Blocked:", summary.blocked);

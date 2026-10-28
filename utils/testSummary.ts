export type TestStatus = "Passed" | "Failed" | "Blocked";
export interface TestResult {
  testId: string;
  testName: string;
  status: TestStatus;
  defectId?: string;
}

export interface TestSummary {
  passed: number;
  failed: number;
  blocked: number;
}

export const getTestSummary = (results: TestResult[]): TestSummary => {
  let passedCount = 0;
  let failedCount = 0;
  let blockedCount = 0;

  for (const result of results) {
    if (result.status === "Passed") {
      passedCount++;
    } else if (result.status == "Failed") {
      failedCount++;
    } else if (result.status === "Blocked") {
      blockedCount++;
    }
  }
  return {
    passed: passedCount,
    failed: failedCount,
    blocked: blockedCount,
  };
};

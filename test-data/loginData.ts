export interface LoginTestData {
  testId: string;
  username: string;
  password: string;
  expectedError: string;
  description?: string;
}
export const loginTestData: LoginTestData[] = [
  {
    testId: "SD_LOGIN_002",
    username: "standard_user",
    password: "wrong_password",
    expectedError:
      "Epic sadface: Username and password do not match any user in this service",
    description: "Verify invalid password validation",
  },
  {
    testId: "SD_LOGIN_003",
    username: "",
    password: "secret_sauce",
    expectedError: "Epic sadface: Username is required",
  },
  {
    testId: "SD_LOGIN_004",
    username: "standard_user",
    password: "",
    expectedError: "Epic sadface: Password is required",
    description: "Verify empty password validation",
  },
];

/**
 * Environment configuration
 * Centralizes all environment variable access
 */

interface EnvironmentConfig {
  API_BASE_URL: string;
  NODE_ENV: "development" | "production" | "test";
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
  IS_TEST: boolean;
}

// Validate required environment variables
const requiredEnvVars = {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
};

// Check for missing required environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export const ENV: EnvironmentConfig = {
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5252/api",
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_TEST: process.env.NODE_ENV === "test",
};

// Validate API URL format
try {
  new URL(ENV.API_BASE_URL);
} catch (error) {
  throw new Error(`Invalid API_BASE_URL: ${ENV.API_BASE_URL}`);
}

export default ENV;

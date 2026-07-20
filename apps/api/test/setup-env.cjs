process.env.NODE_ENV = "test";
process.env.COMMERCE_STORE_KEY = "fardad";
process.env.COMMERCE_BFF_SHARED_SECRET = "test-commerce-bff-secret-at-least-32-bytes";
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/fardad_test";
process.env.JWT_ACCESS_SECRET = "test-access-secret-at-least-32-characters";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-32-characters";

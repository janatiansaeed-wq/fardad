export const env = {
  appName: process.env.APP_NAME ?? "Fardad",

  appUrl: process.env.APP_URL ?? "http://localhost:3000",

  databaseUrl: process.env.DATABASE_URL ?? "",

  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "",

  nextAuthUrl: process.env.NEXTAUTH_URL ?? "",
};

export default env;
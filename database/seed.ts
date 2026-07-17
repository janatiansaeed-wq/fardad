import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { slug: "gift-pack" },
    update: {},
    create: {
      name: "پک های هدیه",
      slug: "gift-pack",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@fardad.ir" },
    update: {},
    create: {
      email: "admin@fardad.ir",
      firstName: "System",
      lastName: "Administrator",
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean old data (child first, then root)
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.menuItem.deleteMany({});
  } catch (e) {
    console.log('⚠️ Database might be empty, skipping cleanup...');
  }

  // 2. Prepare menu data (with pictures)
  const menuItems = [
    { 
      name: "Classic Cheeseburger", 
      price: 12.99, 
      category: "Burgers", 
      description: "Juicy beef patty, cheddar, lettuce, tomato, house sauce.", 
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", 
      isAvailable: true
    },
    { 
      name: "Spicy Pepperoni Pizza", 
      price: 15.50, 
      category: "Pizza", 
      description: "Crispy crust, spicy pepperoni, mozzarella, chili flakes.", 
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
      isAvailable: true 
    },
    { 
      name: "Truffle Mushroom Pasta", 
      price: 18.00, 
      category: "Pasta", 
      description: "Creamy truffle sauce, wild mushrooms, parmesan.", 
      image: "https://images.unsplash.com/photo-1626844131082-256783844137",
      isAvailable: true  
    },
    { 
      name: "Sushi Platter", 
      price: 24.00, 
      category: "Japanese", 
      description: "Assorted nigiri and maki rolls, fresh fish.", 
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      isAvailable: true
    },
    {
      name: "Caesar Salad",
      price: 10.50,
      category: "Salads",
      description: "Romaine hearts, croutons, parmesan, caesar dressing.",
      image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
      isAvailable: true
    },
    {
      name: "Double Espresso",
      price: 3.50,
      category: "Drinks",
      description: "Rich and strong double shot coffee.",
      image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
      isAvailable: true
    }
  ];

  // 3. Create item
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  console.log('✅ Menu items seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
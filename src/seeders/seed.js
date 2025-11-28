const { User, Product, Client, Comment, Permission, syncDatabase } = require('../models');

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Sync database first
        await syncDatabase(true); // This will drop and recreate tables

        // Create admin user
        const admin = await User.create({
            email: 'admin@example.com',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            isAdmin: true,
        });
        console.log('✅ Admin user created');

        // Create regular user
        const regularUser = await User.create({
            email: 'user@example.com',
            password: 'user123',
            firstName: 'John',
            lastName: 'Doe',
            isAdmin: false,
        });
        console.log('✅ Regular user created');

        // Create permissions for regular user
        await Permission.create({
            userId: regularUser.id,
            resource: 'products',
            canView: true,
            canCreate: true,
            canUpdate: false,
            canDelete: false,
        });

        await Permission.create({
            userId: regularUser.id,
            resource: 'clients',
            canView: true,
            canCreate: true,
            canUpdate: true,
            canDelete: false,
        });

        await Permission.create({
            userId: regularUser.id,
            resource: 'orders',
            canView: true,
            canCreate: true,
            canUpdate: false,
            canDelete: false,
        });

        await Permission.create({
            userId: regularUser.id,
            resource: 'comments',
            canView: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
        });

        console.log('✅ Permissions created for regular user');

        // Create sample products
        const products = await Product.bulkCreate([
            {
                name: 'Laptop',
                description: 'High-performance laptop for professionals',
                price: 1299.99,
                stock: 50,
                sku: 'LAP-001',
                createdBy: admin.id,
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse',
                price: 29.99,
                stock: 200,
                sku: 'MOU-001',
                createdBy: admin.id,
            },
            {
                name: 'Mechanical Keyboard',
                description: 'RGB mechanical keyboard',
                price: 149.99,
                stock: 75,
                sku: 'KEY-001',
                createdBy: admin.id,
            },
            {
                name: 'USB-C Hub',
                description: '7-in-1 USB-C hub with HDMI',
                price: 49.99,
                stock: 150,
                sku: 'HUB-001',
                createdBy: admin.id,
            },
            {
                name: 'Monitor 27"',
                description: '4K UHD monitor 27 inches',
                price: 399.99,
                stock: 30,
                sku: 'MON-001',
                createdBy: admin.id,
            },
        ]);
        console.log('✅ Sample products created');

        // Create sample clients
        const clients = await Client.bulkCreate([
            {
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                phone: '+1-555-0101',
                address: '123 Main St',
                city: 'New York',
                country: 'USA',
                notes: 'Preferred customer',
                createdBy: admin.id,
            },
            {
                firstName: 'Bob',
                lastName: 'Smith',
                email: 'bob.smith@example.com',
                phone: '+1-555-0102',
                address: '456 Oak Ave',
                city: 'Los Angeles',
                country: 'USA',
                createdBy: admin.id,
            },
            {
                firstName: 'Carol',
                lastName: 'Williams',
                email: 'carol.williams@example.com',
                phone: '+1-555-0103',
                address: '789 Pine Rd',
                city: 'Chicago',
                country: 'USA',
                createdBy: regularUser.id,
            },
        ]);
        console.log('✅ Sample clients created');

        // Create sample comments
        await Comment.bulkCreate([
            {
                content: 'Great product, customers love it!',
                relatedTo: 'product',
                relatedId: products[0].id,
                createdBy: admin.id,
            },
            {
                content: 'Need to restock soon',
                relatedTo: 'product',
                relatedId: products[1].id,
                createdBy: regularUser.id,
            },
            {
                content: 'VIP client - offer special discounts',
                relatedTo: 'client',
                relatedId: clients[0].id,
                createdBy: admin.id,
            },
            {
                content: 'General reminder: Update inventory weekly',
                relatedTo: 'general',
                createdBy: admin.id,
            },
        ]);
        console.log('✅ Sample comments created');

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📝 Login credentials:');
        console.log('Admin - Email: admin@example.com, Password: admin123');
        console.log('User  - Email: user@example.com, Password: user123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();

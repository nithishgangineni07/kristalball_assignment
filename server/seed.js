require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Base = require('./models/Base');
const Asset = require('./models/Asset');
const Purchase = require('./models/Purchase');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mams', {
});

const seedDB = async () => {
    try {
        await User.deleteMany({});
        await Base.deleteMany({});
        await Asset.deleteMany({});
        await Purchase.deleteMany({});
        // Clear others if needed

        console.log('Cleared DB');

        // Create Bases
        const base1 = await new Base({ name: 'Alpha Base', location: 'Nevada' }).save();
        const base2 = await new Base({ name: 'Bravo Base', location: 'Texas' }).save();
        const base3 = await new Base({ name: 'Charlie Base', location: 'Germany' }).save();

        console.log('Bases created');

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        await new User({ name: 'Admin User', email: 'admin@mams.com', password, role: 'admin' }).save();
        await new User({ name: 'Commander Alpha', email: 'cmdr_alpha@mams.com', password, role: 'commander', baseId: base1._id }).save();
        await new User({ name: 'Logistics Officer', email: 'logistics@mams.com', password, role: 'logistics' }).save();

        console.log('Users created');

        // Create Assets (Opening Balances)
        await new Asset({ baseId: base1._id, equipmentType: 'M16 Rifle', openingBalance: 100 }).save();
        await new Asset({ baseId: base1._id, equipmentType: 'Ammo Box 5.56mm', openingBalance: 500 }).save();
        await new Asset({ baseId: base2._id, equipmentType: 'Humvee', openingBalance: 10 }).save();
        await new Asset({ baseId: base2._id, equipmentType: 'M16 Rifle', openingBalance: 50 }).save();
        await new Asset({ baseId: base3._id, equipmentType: 'Tank M1', openingBalance: 5 }).save();

        console.log('Assets initialized');

        // Create some initial history (Optional, but good for dashboard)
        // Purchases
        await new Purchase({ baseId: base1._id, equipmentType: 'M16 Rifle', quantity: 20, recordedBy: base1._id /* dummy */ }).save();

        console.log('Seed Complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

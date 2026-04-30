const User = require('../models/User');

const ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const ensureAdminAccount = async () => {
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    }
    return;
  }

  await User.create({
    name: 'Hostel Admin',
    email: ADMIN_EMAIL,
    password: DEFAULT_ADMIN_PASSWORD,
    role: 'admin',
    address: 'Administration Office'
  });

  console.log(`Default admin account created for ${ADMIN_EMAIL}`);
};

module.exports = ensureAdminAccount;

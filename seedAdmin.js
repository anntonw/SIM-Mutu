require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./models');
const User = require('./models/user');

async function createAdmin() {
  try {
    await sequelize.sync();

    const hashedPassword = bcrypt.hashSync('admin123', 10);

    const [admin, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password: hashedPassword,
        role: 'admin',
        lokasi: 'Pusat'
      }
    });

    if (created) {
      console.log('✅ Admin user berhasil dibuat!');
    } else {
      console.log('ℹ️ Admin user sudah ada.');
    }

    process.exit();
  } catch (err) {
    console.error(err);
  }
}

createAdmin();

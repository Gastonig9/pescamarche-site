import { config } from 'dotenv';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserSchema } from '../modules/users/schemas/user.schema';

config();

async function seedAdmin() {
  const mongoUri =
    process.env.MONGO_URI ?? 'mongodb://localhost:27017/pescamarche';
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@pescamarche.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123';

  await mongoose.connect(mongoUri);
  const UserModel = mongoose.model('User', UserSchema);

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await UserModel.findOneAndUpdate(
    { email: adminEmail },
    {
      name: 'Administrador',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      active: true,
    },
    { upsert: true, new: true },
  );

  console.log(`Admin user ready: ${adminEmail}`);
  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user', error);
  process.exit(1);
});

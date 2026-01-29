import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as dns from 'node:dns';
import * as bcrypt from 'bcryptjs';

const totalDocuments = 10000;
const batchSize = 1000;

async function seed() {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));

  const count = await userModel.estimatedDocumentCount();

  if (count > 0) {
    console.log('Database is not empty. Skipping seed.');
    await app.close();
    return;
  }

  console.log('Seeding started');

  let inserted = 0;

  while (inserted < totalDocuments) {
    const batch: CreateUserDto[] = [];

    for (let i = 0; i < batchSize; i++) {
      batch.push({
        username: faker.internet.username(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      });
    }

    try {
      await userModel.insertMany(batch, { ordered: false });
    } catch {
      //ignore
    }

    inserted += batchSize;
    console.log(`Inserted: ${inserted}/${totalDocuments}`);
  }

  console.log('Seeding completed');
  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

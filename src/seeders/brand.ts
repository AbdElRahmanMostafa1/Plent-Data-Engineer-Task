import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Brand from '../models/brand'; // Import your Brand schema
import { faker } from '@faker-js/faker';
import { MONGO_URL } from '../constants';

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      const brandsToInsert = [];
      for (let i = 0; i < 10; i++) {
        const brandData = new Brand({
          brandName: faker.person.lastName(),
          yearFounded: faker.number.int({ min: 1600, max: 2023 }),
          headquarters: faker.person.jobArea(),
          numberOfLocations: faker.number.int({ min: 1, max: 100 }),
        });
        brandsToInsert.push(brandData);
      }

      await Brand.insertMany(brandsToInsert);
      console.log('Brands are seeded successfully...');
    } catch (error: any) {
      console.error('Error seeding Brands:', error.message);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Brand, {BrandDocument} from "../models/brand";
import { faker } from "@faker-js/faker";
import { MONGO_URL } from "../constants";

mongoose
    .connect(MONGO_URL)
    .then(async () => {
        console.log("Brands Transformation");

        try {
            const brands = (await Brand.find({})) as BrandDocument[] | any;

            for (const brandData of brands) {
                let yearFounded = brandData.yearFounded;
                let numberOfLocations = brandData.numberOfLocations;

                if (brandData?.brand?.name) {
                    brandData.brandName = brandData.brand.name;
                    delete brandData.brand;
                }
                if (!brandData.brandName) {
                    brandData.brandName = faker.person.lastName();
                }

                if (!yearFounded && brandData.yearCreated) {
                    yearFounded = parseInt(brandData.yearCreated);
                    delete brandData.yearCreated;
                }
                if (!yearFounded && brandData.yearsFounded) {
                    yearFounded = parseInt(brandData.yearsFounded);
                }

                if (!numberOfLocations) {
                    const yearFoundedPath = Brand.schema.path('numberOfLocations');
                    const minimumYear = yearFoundedPath.options.min;
                    numberOfLocations = minimumYear;
                }
                if (!numberOfLocations || isNaN(numberOfLocations)) {
                    const yearFoundedPath = Brand.schema.path('numberOfLocations');
                    const minimumYear = yearFoundedPath.options.min;
                    numberOfLocations = minimumYear[0];
                }

                if (!yearFounded || isNaN(yearFounded)) {
                    const yearFoundedPath = Brand.schema.path('yearFounded');
                    const minimumYear = yearFoundedPath.options.min;                    
                    yearFounded = minimumYear[0];
                }

                if (!brandData.headquarters) {
                    brandData.headquarters = "Jastside";
                }

                const brand = new Brand({
                    brandName: brandData.brandName,
                    yearFounded,
                    headquarters: brandData.headquarters,
                    numberOfLocations,
                });

                const validationError = brand.validateSync();
                if (validationError) {
                    console.error(`Validation error for brand with ID ${brandData._id}: ${validationError.message}`);
                    continue;
                }

                await Brand.findByIdAndUpdate(brandData._id, {
                    brandName: brandData.brandName,
                    yearFounded,
                    headquarters: brandData.headquarters,
                    numberOfLocations,
                }, {
                    strict: false
                });
            }
        } catch (error: any) {
            console.error("Error processing brands:", error.message);
        }  finally {
            mongoose.disconnect();
        }
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });

import { FindOptionsSelect } from "typeorm";
import { Rental } from "./rental.entity";

export const rentalSelectColsConfig: FindOptionsSelect<Rental> = {
    id: true,
    createdAt: true,
    startDate: true,
    endDate: true,
    pickupLocation: true,
    returnLocation: true,
    totalAmount: true,
    user: {
        id: true,
        account: {
            id: true,
            firstName: true,
            lastName: true,
        }
    },
    model: {
        id: true,
        slug: true,
        name: true,
        featuredImage: {
            id: true,
            url: true,
        },
        brand: {
            id: true,
            name: true,
        }
    }
};
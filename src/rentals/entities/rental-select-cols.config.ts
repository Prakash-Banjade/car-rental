import { FindOptionsSelect } from "typeorm";
import { Rental } from "./rental.entity";

export const rentalSelectColsConfig: FindOptionsSelect<Rental> = {
    id: true,
    createdAt: true,
    totalAmount: true,
    status: true,
    payment: {
        id: true,
        amount: true,
        paymentMethod: true,
        status: true,
    },
    user: {
        id: true,
        account: {
            id: true,
            firstName: true,
            lastName: true,
        }
    },
    rentalItems: {
        id: true,
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
        },
        startDate: true,
        endDate: true,
        pickupLocation: true,
        returnLocation: true,
        totalAmount: true,
    }
};
import { FindOptionsSelect } from 'typeorm';
import { Model } from './model.entity';

export const modelsColumnsConfig: FindOptionsSelect<Model> = {
    id: true,
    name: true,
    slug: true,
    color: true,
    createdAt: true,
    rating: true,
    dailyRentalRate: true,
    seatCount: true,
    doorCount: true,
    transmission: true,
    maxSpeed: true,
    engineVolume: true,
    fuelType: true,
    acceleration: true,
    status: true,
    power: true,
    featuredImage: {
        id: true,
        url: true
    },
    gallery: {
        id: true,
        url: true,
    },
    brand: {
        id: true,
        name: true,
        slug: true,
        logo: {
            id: true,
            url: true
        }
    },
    carType: {
        id: true,
        name: true,
        slug: true,
        image: {
            id: true,
            url: true
        }
    },
};

export const modelColumnsConfig: FindOptionsSelect<Model> = {
    brand: {
        id: true,
        name: true,
        slug: true,
        logo: {
            id: true,
            url: true
        }
    },
    featuredImage: {
        id: true,
        url: true
    },
    gallery: {
        id: true,
        url: true,
    },
    carType: {
        id: true,
        name: true,
        slug: true,
        image: {
            id: true,
            url: true
        }
    },
    reviews: {
        id: true,
        rating: true,
        comment: true,
        user: {
            id: true,
            account: {
                firstName: true,
                lastName: true,
            }
        }
    },
}
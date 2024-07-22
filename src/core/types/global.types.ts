export enum Roles {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
}

export interface AuthUser {
    userId: string;
    accountId: string;
    name: string;
    email: string;
    role: Roles;
}

export enum Action {
    MANAGE = 'manage',
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    RESTORE = 'restore',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum EGearBox {
    AT = 'automatic-transmission',
    MT = 'manual-transmission',
    CVT = 'continuously-variable-transmission',
    SAT = 'semi-automatic-transmission',
    DCT = 'dual-clutch-transmission',
    TT = 'tiptronic-transmission'
}

export enum EFuelType {
    PETROL = 'petrol',
    DIESEL = 'diesel',
    ELECTRIC = 'electric',
    HYBRID = 'hybrid',
}

export enum EModelStatus {
    AVAILABLE = 'available',
    RENTED = 'rented',
    MAINTENANCE = 'maintenance',
}

export enum ERentalStatus {
    RENTED = 'rented',
    RETURNED = 'returned',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CASH_ON_DELIVERY = 'cashOnDelivery',
    CASH = 'cash',
    CREDIT = 'credit',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
}

export enum PaymentStatus {
    PENDING = 'pending',
    AWATING_PAYMENT = 'awaitingPayment',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum ReportPeriod {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year'
}
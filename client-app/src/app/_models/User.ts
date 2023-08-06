import { UserSubscription } from "./UserSubscription"

export interface User {

    id: string,
    name: string,
    userName: string,
    address: string,
    personalCode: string,
    registrationDate: Date,
    registrationEnds: Date,
    idCard: string,
    subscriptionId: string | null,
    subscription: UserSubscription,
    email: string,
    phoneNumber: string,
    firstLogin: number,
    password: string,
    role: string,
    accessFailedCount: number

}

export interface LoginUser {


    id: string,
    name: string,
    userName: string,
    role: string,
    isBlocked: boolean

}

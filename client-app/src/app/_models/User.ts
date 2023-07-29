export interface User {

    name: string,
    userName: string,
    address: string,
    personalCode:string,
    registrationDate: Date,
    idCard: string,
    subscriptionId: number,
    email: string,
    phoneNumber: string,
    firstLogin: number,
    password: string,
    roles: string[]

}

export interface LoginUser {


    name: string,
    userName: string,
    roles: string[]

}

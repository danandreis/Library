import { User } from "./User";

export interface Borrow {

    id: string,
    title: string,
    author: string,
    bookId: string,
    appUser: User,
    startDate: Date | null,
    endDate: Date | null,
    returnDate: Date | null,
    delayTime: number,
    extended: number
}
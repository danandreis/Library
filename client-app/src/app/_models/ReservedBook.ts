import { Book } from "./Book";
import { User } from "./User";

export interface ReservedBook {


    id: string, //reservationID
    bookId: string,
    title: string,
    author: string,
    appUserId: string,
    appUser: User | null,
    startDate: Date,
    endDate: Date

}
import { Book } from "./Book";
import { User } from "./User";

export interface BorrowedBook {

    id: string,
    bookId: string,
    book: Book | null,
    appUserId: string,
    appUser: User | null,
    startDate: Date,
    endDate: Date,
    returnDate: Date | null,
    delayTime: number,
    extended: number

}
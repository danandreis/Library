import { BookDomain } from "./BookDomain";
import { BookLanguage } from "./BookLanguage";
import { BookType } from "./BookType";
import { BorrowedBook } from "./BorrowedBook";

export interface Book {

    id: string,
    title: string,
    author: string,
    publisher: string,
    year: number,
    pages: number,
    isbn: string,
    copies: number,
    bookDomainId: string,
    bookDomain: BookDomain,
    bookLanguageId: string,
    bookLanguage: BookLanguage,
    bookTypeId: string,
    bookType: BookType,
    bookBorrows: BorrowedBook[],
    description: string,
    rating: number,
    isBorrowedByUser: boolean,
    isBorrowedByOther: boolean
}
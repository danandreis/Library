import { BookDomain } from "./BookDomain";
import { BookLanguage } from "./BookLanguage";
import { BookType } from "./BookType";

export interface Book {

    id: string,
    title: string,
    author: string,
    publisher: string,
    year: number,
    pages: number,
    isbn: string,
    copies: number,
    bookDomainId:string,
    bookDomain: BookDomain,
    bookLanguageId:string,
    bookLanguage: BookLanguage,
    bookTypeId:string,
    bookType: BookType,
    Description: string,
    Rating: number
}
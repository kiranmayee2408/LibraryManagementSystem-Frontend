import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IssuedBook {
    issueId: number;
    bookId: number;
    memberId: number;
    issueDate: string;
    dueDate: string;
    returnDate: string | null;
    bookTitle?: string;
    memberName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class IssuedBookService {
    private apiUrl = 'https://localhost:7011/api/IssuedBooks';

    constructor(private http: HttpClient) { }

    getIssuedBooks(): Observable<IssuedBook[]> {
        return this.http.get<IssuedBook[]>(this.apiUrl);
    }

    getIssuedBookById(id: number): Observable<IssuedBook> {
        return this.http.get<IssuedBook>(`${this.apiUrl}/${id}`);
    }

    createIssuedBook(book: Partial<IssuedBook>): Observable<IssuedBook> {
        return this.http.post<IssuedBook>(this.apiUrl, book);
    }

    updateIssuedBook(id: number, book: Partial<IssuedBook>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, book);
    }

    deleteIssuedBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

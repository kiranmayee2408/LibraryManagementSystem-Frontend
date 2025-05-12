import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IssuedBook {
    issueId: number;
    bookId: number;
    memberId: number;
    issueDate: string;
    dueDate: string;
    returnDate: string;
}

export interface IssuedBookViewModel extends IssuedBook {
    bookTitle: string;
    memberName: string;
}

@Injectable({
    providedIn: 'root'
})
export class IssuedBookService {
    private apiUrl = 'https://localhost:7011/api/IssuedBooks';

    constructor(private http: HttpClient) { }

    getIssuedBooks(): Observable<IssuedBookViewModel[]> {
        return this.http.get<IssuedBookViewModel[]>(this.apiUrl);
    }

    getIssuedBookById(id: number): Observable<IssuedBook> {
        return this.http.get<IssuedBook>(`${this.apiUrl}/${id}`);
    }

    createIssuedBook(data: Omit<IssuedBook, 'issueId'>): Observable<IssuedBook> {
        return this.http.post<IssuedBook>(this.apiUrl, data);
    }


    updateIssuedBook(id: number, book: Partial<IssuedBook>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, book);
    }

    deleteIssuedBook(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

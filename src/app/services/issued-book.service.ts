import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

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
    private apiUrl = `${environment.apiUrl}/IssuedBooks`;
    private hubConnection!: signalR.HubConnection;

    constructor(private http: HttpClient) {
        this.startSignalR();
    }

    private startSignalR(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/issued-books`)
            .withAutomaticReconnect()
            .build();

        this.hubConnection
            .start()
            .then(() => console.log('SignalR connected (IssuedBooks)'))
            .catch(err => console.error('SignalR connection error:', err));
    }

    onIssuedBooksChanged(callback: () => void): void {
        this.hubConnection.on('IssuedBooksUpdated', callback);
    }

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

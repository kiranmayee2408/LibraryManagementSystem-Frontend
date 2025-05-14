import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  role: string | null = null;
  private hubConnection!: signalR.HubConnection;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.loadBooks();
    this.startSignalR();
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('🔌 SignalR disconnected from BookHub');
      });
    }
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        console.error('Book load error:', err);
        alert('Failed to load books.');
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log('Book deleted');
          // Optional: this.loadBooks(); (SignalR should handle it)
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Delete failed. Check console.');
        }
      });
    }
  }

  startSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/books`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to BookHub'))
      .catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('BooksUpdated', () => {
      console.log('BooksUpdated event received');
      this.loadBooks();
    });
  }
}

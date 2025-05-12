import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from '../../services/book.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-book-list',
  standalone: true,
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule]
})
export class BookListComponent implements OnInit {
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
      this.bookService.deleteBook(id).subscribe(() => {
        this.loadBooks();
      });
    }
  }

  startSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7011/hubs/books')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('📡 Connected to BookHub'))
      .catch(err => console.error('❌ SignalR connection error:', err));

    this.hubConnection.on('BooksUpdated', () => {
      console.log('📢 BooksUpdated event received');
      this.loadBooks();
    });
  }
}
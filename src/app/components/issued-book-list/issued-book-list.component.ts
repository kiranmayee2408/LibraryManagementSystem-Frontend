import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IssuedBookService, IssuedBook, IssuedBookViewModel } from '../../services/issued-book.service';
import { AuthService } from '../../services/auth.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-issued-book-list',
  standalone: true,
  templateUrl: './issued-book-list.component.html',
  styleUrls: ['./issued-book-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class IssuedBookListComponent implements OnInit {
  issuedBooks: IssuedBookViewModel[] = [];
  role: string | null = null;
  private hubConnection!: signalR.HubConnection;

  constructor(
    private issuedBookService: IssuedBookService,
    private authService: AuthService,
    private router: Router // ✅ Add Router for navigation
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.loadIssuedBooks();
    this.startSignalRConnection();
  }

  loadIssuedBooks(): void {
    this.issuedBookService.getIssuedBooks().subscribe(data => this.issuedBooks = data);
  }

  onAdd(): void {
    this.router.navigate(['/issued-books/manage']);
  }

  onEdit(issueId: number): void {
    this.router.navigate(['/issued-books/manage', issueId]);
  }

  onDelete(issueId: number): void {
    if (confirm('Are you sure you want to delete this issued book record?')) {
      this.issuedBookService.deleteIssuedBook(issueId).subscribe(() => {
        this.loadIssuedBooks();
      });
    }
  }

  startSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7011/hubs/issued-books')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected to issued-books hub'))
      .catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('IssuedBookUpdated', () => {
      console.log('Received IssuedBookUpdated signal');
      this.loadIssuedBooks();
    });
  }
}

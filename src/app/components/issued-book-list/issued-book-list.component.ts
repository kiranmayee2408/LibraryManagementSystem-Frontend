import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IssuedBookService, IssuedBookViewModel } from '../../services/issued-book.service';
import { AuthService } from '../../services/auth.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-issued-book-list',
  standalone: true,
  templateUrl: './issued-book-list.component.html',
  styleUrls: ['./issued-book-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class IssuedBookListComponent implements OnInit, OnDestroy {
  issuedBooks: IssuedBookViewModel[] = [];
  role: string | null = null;
  private hubConnection!: signalR.HubConnection;

  constructor(
    private issuedBookService: IssuedBookService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.loadIssuedBooks();
    this.startSignalRConnection();
  }

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('🔌 SignalR disconnected');
      });
    }
  }

  loadIssuedBooks(): void {
    this.issuedBookService.getIssuedBooks().subscribe({
      next: (data) => {
        this.issuedBooks = data;
      },
      error: (err) => {
        console.error('Failed to load issued books:', err);
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/issued-books/manage']);
  }

  onEdit(issueId: number): void {
    this.router.navigate(['/issued-books/manage', issueId]);
  }

  onDelete(issueId: number): void {
    if (confirm('Are you sure you want to delete this issued book record?')) {
      this.issuedBookService.deleteIssuedBook(issueId).subscribe({
        next: () => {
          console.log('✅ Issued book deleted');
          // SignalR will trigger loadIssuedBooks()
        },
        error: (err) => {
          console.error('❌ Delete failed:', err);
          alert('Delete failed. Check console for details.');
        }
      });
    }
  }

  startSignalRConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/issued-books`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected to issued-books hub'))
      .catch(err => console.error('SignalR connection error:', err));

    this.hubConnection.on('IssuedBooksUpdated', () => {
      console.log('📡 Received IssuedBooksUpdated signal');
      this.loadIssuedBooks();
    });
  }
}

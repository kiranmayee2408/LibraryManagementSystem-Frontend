import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IssuedBookService, IssuedBook } from '../../services/issued-book.service';

@Component({
  selector: 'app-issued-book-list',
  standalone: true,
  templateUrl: './issued-book-list.component.html',
  styleUrls: ['./issued-book-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class IssuedBookListComponent implements OnInit {
  issuedBooks: IssuedBook[] = [];

  constructor(private issuedBookService: IssuedBookService) { }

  ngOnInit(): void {
    this.loadIssuedBooks();
  }

  loadIssuedBooks(): void {
    this.issuedBookService.getIssuedBooks().subscribe(data => this.issuedBooks = data);
  }

  onDelete(issueId: number): void {
    if (confirm('Are you sure you want to delete this issued book record?')) {
      this.issuedBookService.deleteIssuedBook(issueId).subscribe(() => {
        this.loadIssuedBooks();
      });
    }
  }
}

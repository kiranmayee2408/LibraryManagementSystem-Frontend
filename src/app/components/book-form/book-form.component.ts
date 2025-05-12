import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class BookFormComponent implements OnInit {
  bookId: number | null = null;
  formData: Book = {
    bookId: 0,
    title: '',
    author: '',
    isbn: '',
    availableCopies: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe(book => {
        this.formData = { ...book };
      });
    }
  }

  onSubmit(): void {
    console.log('✅ Book form submitted', this.formData);

    if (this.bookId) {
      this.bookService.updateBook(this.bookId, this.formData).subscribe(() => {
        this.router.navigate(['/books']);
      });
    } else {
      const { title, author, isbn, availableCopies } = this.formData;
      this.bookService.createBook({ title, author, isbn, availableCopies }).subscribe(() => {
        this.router.navigate(['/books']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}

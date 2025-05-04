import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class BookFormComponent implements OnInit {
  selectedBookId: number | null = null;
  currentYear = new Date().getFullYear();

  bookForm = this.fb.group({
    title: ['', Validators.required],
    author: [''],
    isbn: ['', Validators.required],
    availableCopies: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.selectedBookId = id ? +id : null;

      if (this.selectedBookId) {
        this.bookService.getBookById(this.selectedBookId).subscribe(book => {
          this.bookForm.patchValue(book);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const book: Book = {
        bookId: this.selectedBookId!, // ✅ backend needs this!
        title: this.bookForm.value.title ?? '',
        author: this.bookForm.value.author ?? '',
        isbn: this.bookForm.value.isbn ?? '',
        availableCopies: this.bookForm.value.availableCopies ?? 1
      };


      if (this.selectedBookId) {
        this.bookService.updateBook(this.selectedBookId, book).subscribe(() => {
          this.router.navigate(['/books']);
        });
      } else {
        this.bookService.createBook(book).subscribe(() => {
          this.router.navigate(['/books']);
        });
      }
    }
  }
  onDelete(): void {
    if (this.selectedBookId && confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(this.selectedBookId).subscribe(() => {
        this.router.navigate(['/books']);
      });
    }
  }
  onReset(): void {
    this.selectedBookId = null;
    this.bookForm.reset({
      title: '',
      author: '',
      isbn: '',
      availableCopies: 1,
    });
  }
}

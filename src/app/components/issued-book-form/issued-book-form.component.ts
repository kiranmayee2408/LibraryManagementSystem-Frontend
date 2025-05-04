import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IssuedBookService, IssuedBook } from '../../services/issued-book.service';

@Component({
  selector: 'app-issued-book-form',
  standalone: true,
  templateUrl: './issued-book-form.component.html',
  styleUrls: ['./issued-book-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class IssuedBookFormComponent implements OnInit {
  issueId: number | null = null;

  issuedBookForm = this.fb.group({
    bookId: [0, Validators.required],
    memberId: [0, Validators.required],
    issueDate: ['', Validators.required],
    dueDate: ['', Validators.required],
    returnDate: ['']
  });

  constructor(
    private fb: FormBuilder,
    private issuedBookService: IssuedBookService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.issueId = +id;
      this.issuedBookService.getIssuedBookById(this.issueId).subscribe((book: IssuedBook) => {
        this.issuedBookForm.patchValue(book);
      });
    }
  }

  onSubmit(): void {
    const book: Partial<IssuedBook> = {
      bookId: this.issuedBookForm.value.bookId ?? 0,
      memberId: this.issuedBookForm.value.memberId ?? 0,
      issueDate: this.issuedBookForm.value.issueDate ?? '',
      dueDate: this.issuedBookForm.value.dueDate ?? '',
      returnDate: this.issuedBookForm.value.returnDate ?? null
    };

    if (this.issueId) {
      this.issuedBookService.updateIssuedBook(this.issueId, book).subscribe(() => {
        this.router.navigate(['/issued-books']);
      });
    } else {
      this.issuedBookService.createIssuedBook(book).subscribe(() => {
        this.router.navigate(['/issued-books']);
      });
    }
  }
}

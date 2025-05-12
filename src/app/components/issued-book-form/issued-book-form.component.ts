import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssuedBookService, IssuedBook } from '../../services/issued-book.service';
import { BookService, Book } from '../../services/book.service';
import { MemberService, Member } from '../../services/member.service';

@Component({
  selector: 'app-issued-book-form',
  standalone: true,
  templateUrl: './issued-book-form.component.html',
  styleUrls: ['./issued-book-form.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class IssuedBookFormComponent implements OnInit {
  issueId: number | null = null;
  formData: IssuedBook = {
    issueId: 0,
    bookId: 0,
    memberId: 0,
    issueDate: '',
    dueDate: '',
    returnDate: ''
  };
  books: Book[] = [];
  members: Member[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issuedBookService: IssuedBookService,
    private bookService: BookService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {
    this.issueId = Number(this.route.snapshot.paramMap.get('id'));

    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.memberService.getMembers().subscribe(members => {
        this.members = members;

        if (this.issueId) {
          this.issuedBookService.getIssuedBookById(this.issueId).subscribe(data => {
            this.formData = {
              ...data,
              issueDate: data.issueDate?.split('T')[0],
              dueDate: data.dueDate?.split('T')[0],
              returnDate: data.returnDate ? data.returnDate.split('T')[0] : ''
            };
          });
        }
      });
    });
  }

  onSubmit(): void {
    const payload = {
      bookId: Number(this.formData.bookId),
      memberId: Number(this.formData.memberId),
      issueDate: this.formData.issueDate,
      dueDate: this.formData.dueDate,
      returnDate: this.formData.returnDate
    };

    if (this.issueId) {
      this.issuedBookService.updateIssuedBook(this.issueId, {
        ...payload,
        issueId: this.issueId
      }).subscribe(() => {
        this.router.navigate(['/issued-books']);
      });
    } else {
      this.issuedBookService.createIssuedBook(payload).subscribe(() => {
        this.router.navigate(['/issued-books']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/issued-books']);
  }
}

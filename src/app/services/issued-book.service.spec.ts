import { TestBed } from '@angular/core/testing';
import { IssuedBookService } from './issued-book.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IssuedBookService', () => {
    let service: IssuedBookService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(IssuedBookService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

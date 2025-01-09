import { TestBed } from '@angular/core/testing';

import { UserareaService } from './userarea.service';

describe('UserareaService', () => {
  let service: UserareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

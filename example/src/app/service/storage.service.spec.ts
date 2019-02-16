import { inject, TestBed } from '@angular/core/testing'
import { StorageService } from './storage.service';

describe('Service: StorageService', () => {
  let service: StorageService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        StorageService
      ],
    })

    service = TestBed.get(StorageService)

    // Mock implementation of console.error to
    // return undefined to stop printing out to console log during test
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })


  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  })

  it('should be empty by default', () => {
    console.log('JSDOM', window.navigator.userAgent);
    console.log('LS', localStorage);

    const actualEmpty = service.isEmpty();

    expect(actualEmpty).toBe(true);
  })

  it('should be able to insert and retrieve data to/from localStorage', () => {
    const expectedData = '123-123';

    service.setItem('dataset 123', '123-123');

    const actualData = service.getItem('dataset 123');

    expect(actualData).toEqual(expectedData);
  })
})

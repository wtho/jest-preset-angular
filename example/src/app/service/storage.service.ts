import { Injectable } from '@angular/core'

@Injectable()
export class StorageService {

  constructor() {}

  isEmpty(): boolean {
    return localStorage.length === 0;
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null  {
    return localStorage.getItem(key);
  }

}

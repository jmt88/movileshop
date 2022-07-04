import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root',
  })

  export class ErrorService {
        errorBehavior = new BehaviorSubject<boolean>(false);
        errorHandler = this.errorBehavior.asObservable();

        getError() {
            return this.errorHandler
        }

        setError(e:boolean) {
            this.errorBehavior.next(e)
        }
  }  
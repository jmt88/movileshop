import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorService } from '../../_interceptors/error.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private messageService: NzMessageService, private errorService: ErrorService) { }

  isLoading = false;

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
   
  }

  submitForm() {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      
      this.isLoading = true;

      this.authService.Login(this.validateForm.controls['userName'].value, this.validateForm.controls['password'].value).subscribe(response => {
        if (response['success']) {
          this.isLoading = false;
          this.authService.setSession(response['datos']);
          this.router.navigate(['/dashboard'])
        } else {
          this.isLoading = false;
          this.messageService.error(response.message);
        }
      });
      this.procesarError();
    }
  }

  procesarError() {
   this.errorService.getError().subscribe(e => {
      if(e) {
        this.isLoading = !e;
      }
    });
  }

}

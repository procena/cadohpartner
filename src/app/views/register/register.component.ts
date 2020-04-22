import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formbulider: FormBuilder
  ) { }

 ngOnInit() {
    this.registerForm = this.formbulider.group({

    });
  }
  goToLogin() {
    // this.router.navigate(['/login']);
  }

}

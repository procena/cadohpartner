
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, reduce } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
  // animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/home'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          const tokenStr = 'Bearer ' + data;
          sessionStorage.setItem('token', tokenStr);
          Swal.fire({
            position: 'center',
            title: 'Olá sr(a): ' + data.usuario.primeiroNome + ' Seja Bem-vindo ao CadohPartner',
            text: '',
            imageUrl: 'https://media1.tenor.com/images/68e115165357b9a96f44ad0d828eda92/tenor.gif?itemid=12289128',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            timer: 5000
          });
          this.router.navigate([this.returnUrl]);
          this.authenticationService.setUserName(this.f.username.value);
        },
        error => {
          Swal.fire({
            title: 'Erro de Autenticação!',
            text: error.error.developerMessage,
            imageUrl: '/assets/img/brand/erroAcesso.svg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            timer: 3500
          });
          // this.error = error.error.developerMessage;
          this.loading = false;
        });
  }

  enviarSolicitacao() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Desejas recuperar sua senha?',
      text: 'Enviar pedido de recuperação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, enviar',
      cancelButtonText: 'Não, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        swalWithBootstrapButtons.fire(
          'Enviado!',
          'Seu pedido foi enviado, receberá a confirmação dentro de instantes',
          'success'
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Pedido de recuperação cancelado',
          'error'
        );
      }
    });
  }
}

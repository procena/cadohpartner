import { estabelecimento } from './../../../_models/estabelecimento';
import { EstabelecimentoService } from './../../../_services/estabelecimento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import 'datatables.net';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../_services/user.service';

// Imports Alertas
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { usuario } from '../../../_models/usuario';
import { Observable } from 'rxjs';
import { permissao } from '../../../_models/permissao';
import { GeneroService } from '../../../_services/genero.service';


@Component({
  selector: 'app-usuarios-estabelecimento',
  templateUrl: './usuarios-estabelecimento.component.html',
  styleUrls: ['./usuarios-estabelecimento.component.css'],
  providers: [UserService, GeneroService]
})
export class UsuariosEstabelecimentoComponent implements OnInit {
  ctrlEditar: boolean = false;
  userForm: FormGroup;
  userUpdate = null;
  dataSaved: any;
  massage = null;
  user = new usuario();
  allUsers: Observable<usuario[]>;
  public table;
  permissoes: any;
  generos: any;
  tipo;
  i: any;
  estabelecimento = new estabelecimento();

  @ViewChild('modalUser', { static: false }) public modal: ModalDirective;
  ngbModalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  constructor(
    private formbulider: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private generosService: GeneroService ,
    private estabelecimentoService: EstabelecimentoService
  ) { }

  ngOnInit() {


    const jsonTarefa = window.sessionStorage.getItem('currentUser');
    const user = JSON.parse(jsonTarefa);


    this.userService.getAllPermissoes().subscribe((res: any) => {
      this.permissoes = res;
    });

    this.generosService.listarGenero().subscribe((res: any) => {
      this.generos = res;
    });

    this.estabelecimentoService.getEstabelecimentoById(user.usuario.estabelecimento.id).subscribe((res: any) => {
      this.estabelecimento = res;
    });

    this.userForm
      = this.formbulider.group({
        id: ['', ],
        enabled: [null, [Validators.required]],
        genero: ['', [Validators.required]],
        imageUrl: ['/', [Validators.required]],
        loginVerified: [false, [Validators.required]],
        primeiroNome: ['', [Validators.required]],
        segundoNome: ['', [Validators.required]],
        password: ['', [Validators.required]],
        providerId: [0, [Validators.required]],
        provider: ['LOCAL', [Validators.required]],
        username: ['', [Validators.required]],
        tipoUsuario: ['', [Validators.required]],
        estabelecimento: [this.estabelecimento , [Validators.required]],
      });

    const Myself = this;
    $(document).ready(function () {
      // tslint:disable-next-line: prefer-const
      Myself.table = $('#utilizadores').DataTable({
        'processing': true,
        'ajax': {
          'url': 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento/' + user.usuario.estabelecimento.id + '/getUsers',
          headers: {
            Authorization: user.tokenType + ' ' + user.token
          },
          'dataSrc': 'content'
        },
        'columns': [
          { 'data': 'id', width: '5%' },
          { 'data': 'primeiroNome', width: '39%' },
          { 'data': 'username', width: '30%' },
          // { 'data': 'tipoUsuario[0].authority', width: '10%' },
          { 'data': 'genero', width: '10%' },
          /*{
            'data': null,
            'className': 'status',
            render: function (data, type, row) {
              const enabled = data.enabled;
              console.log(enabled);
              if (enabled === true) {
                return '<input class="check" type="checkbox" disabled checked />';
              } else {
                return '<input class="check" type="checkbox"/>';
              }

            }
            , width: '5%'
          },*/
          {
            'className': 'button-editar bg-light',
            'data': null,
            'defaultContent': '',
            'render': function (data) {
              const ativo = data;
             // console.log(ativo.enabled);
              if (ativo.enabled === true) {
                // tslint:disable-next-line:max-line-length
                return '<button class="btn-edit btn btn-dark"><i class="fa fa-pencil text-white " aria-hidden="true"></i></button>'
                  ;
              } else {
                // tslint:disable-next-line:max-line-length
                return '<button class="btn-edit btn btn-dark" disabled><i class="fa fa-pencil text-white " aria-hidden="true"></i></button>'
                  ;
              }

            }
            , width: '1%'
          },
          {
            data: null,
            'className': 'button-delete',
            render: function (data, type, row) {
              const status = data.enabled;
              if (status === true) {
                return '<button class="btn-delete btn btn-danger"><i class="fa fa-ban text-white" aria-hidden="true"></i></button>';
              } else {
                // tslint:disable-next-line: max-line-length
                return '<button class="btn-activar btn btn-danger" disabled><i class="fa fa-ban text-white" aria-hidden="true"></i></button>';
              }

            }, width: '1%'
          },
        ],
        'language': {
          'lengthMenu': 'Mostrar _MENU_ registos por páginas',
          'search': 'Pesquisar:',
          'zeroRecords': 'Nada Encontrado!',
          'info': 'Mostrando pag. _PAGE_ de _PAGES_',
          'infoEmpty': 'Sem registos disponiveis',
          'infoFiltered': '(filtered from _MAX_ total registos)',
          'paginate': {
            'previous': '<i class="fa fa-chevron-left"></i>',
            'next': '<i class="fa fa-chevron-right"></i>',
            'first': 'Inicio',
            'last': 'Fim'
          }
        }, 'responsive': true,
        'columnDefs': [{
          'targets': [0, 1, 2, 3, 4, 5],
          'createdCell': function (td, cellData, rowData, row, col) {
            // $(td).addClass('p-0');
            if (col === 0 || col === 4 || col === 5 || col === 6) {
              $(td).addClass('text-center');
            }
            if (col === 1) {
              $(td).html(rowData.primeiroNome + ' ' + rowData.segundoNome + ' ');
            }
          }
        }
        ],
      });
      $('#utilizadores tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          Myself.table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }
      });

      $('#utilizadores tbody').on('click', '.btn-edit', function () {
        const id = $(this).parent().parent().find('td').eq(0)[0].innerHTML;
        Myself.onEditUser(id, status, Myself.modal);
        this.dataSaved = false;
        Myself.loadUsuarioToEdit(id);
      });


      $('#utilizadores tbody').on('click', '.btn-delete', function () {
        const id = $(this).parent().parent().find('td').eq(0)[0].innerHTML;
        // Myself.deleteUsuario(id, false);
        Myself.habilitarUtilizador(id, false);
      });

      $('#utilizadores tbody').on('click', '.btn-activar', function () {
        const id = $(this).parent().parent().find('td').eq(0)[0].innerHTML;
        Myself.habilitarUtilizador(id, true);
      });

    });
  }


  habilitarUtilizador(id, status) {
    const msg = 'Deseja realmente Activar este Utilizador?';
    Swal.fire({
      title: 'Habilitar Utilizador',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Activar!'
    }).then((result) => {
      if (result.value) {
        this.userService.updateStatus(id, status).subscribe(() => {
          this.dataSaved = true;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Utilizador Activado com Sucesso!!!',
            showConfirmButton: false,
            timer: 1500
          });
          this.table.ajax.reload();
        });

      } else {
        this.table.ajax.reload();
      }
    });
  }

  // tslint:disable-next-line: no-shadowed-variable
  deleteUsuario(id, status) {
    // console.log(status);
    Swal.fire({
      title: 'Eliminar',
      text: 'Deseja realmente bloquear este utilizador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.userService.updateStatus(id, status).subscribe(() => {
          this.dataSaved = true;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Utilizador bloqueado com Sucesso!!!',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadAll();
          this.userUpdate = null;
          this.table.ajax.reload();
        });

      }
    });
  }
  onFormSubmit() {
    this.dataSaved = false;
    const user = this.userForm.value;
    console.log(user);
    this.createUser(user);
  }

  popularDados(data) {
    console.log(data.tipoUsuario);
    this.userForm.patchValue({
      id: data.id,
      providerId: '0',
      enabled: data.enabled,
      loginVerified: false,
      imageUrl: '/',
      provider: 'LOCAL',
      genero: data.genero,
      primeiroNome: data.primeiroNome,
      segundoNome: data.segundoNome,
      username: data.username,
      tipoUsuario: data.tipoUsuario,
      estabelecimento: data.estabelecimento

    });
  }
  popularDadosDelete(data) {
    this.userForm.patchValue({
      id: data.id,
      providerId: '0',
      enabled: data.enabled,
      loginVerified: false,
      imageUrl: '/',
      provider: 'LOCAL',
      genero: data.genero,
      primeiroNome: data.primeiroNome,
      segundoNome: data.segundoNome,
      username: data.username,
      tipoUsuario: data.tipoUsuario

    });
  }
  popularSave(data) {
    this.userForm.patchValue({
      providerId: '0',
      enabled: data.enabled,
      loginVerified: false,
      imageUrl: '/',
      provider: 'LOCAL',
      genero: data.genero,
      primeiroNome: data.primeiroNome,
      segundoNome: data.segundoNome,
      username: data.username,
      tipoUsuario: data.tipoUsuario,
      estabelecimento: data.estabelecimento
    });
  }
  popularForm(dado) {
    this.userForm.patchValue({
      tipoUsuario: dado,
      providerId: '0',
      enabled: true,
      loginVerified: false,
      imageUrl: '/',
      provider: 'LOCAL',
    });
  }
  popularForm2(dado) {
    this.userForm.patchValue({
      genero: dado,
      estabelecimento: this.estabelecimento
    });
  }


  createUser(user: usuario) {
    if (this.userUpdate === null) {
      this.userService.createUser(user).subscribe((dataReturn: any) => {
        this.dataSaved = true;
        this.massage = 'Utilizador Cadastrado Com Sucesso!!!';
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: this.massage,
          showConfirmButton: false,
          timer: 1500
        });

        this.loadAll();
        this.userUpdate = null;
        this.userForm.reset();
        this.closeModal();
        this.table.ajax.reload();
      },
        (dataReturn: HttpErrorResponse) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            text: dataReturn.error.details,
            footer: '<a href>Contactar o Administrador?</a>',
            timer: 1500
          });
        }
      );
    } else {
      user.id = this.userUpdate;
      this.userService.updateUser(user).subscribe((dataReturn: any) => {
        this.dataSaved = true;
        this.massage = 'Utilizador alterada com Sucesso!!!';
        this.loadAll();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: this.massage,
          showConfirmButton: false,
          timer: 1500
        });
        this.userUpdate = null;
        this.userForm.reset();
        this.closeModal();
        this.table.ajax.reload();
      },
        (dataReturn: HttpErrorResponse) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: '',
            text: dataReturn.error.details,
            footer: '<a href>Contactar o Administrador?</a>'
          });
        }); this.closeModal();
    }
  }

  loadAll() {
    this.allUsers = this.userService.getAll();
  }

  loadUsuarioToEdit(userId: string) {
    this.userService.getUserById(userId).subscribe(usuariosReturn => {
      this.massage = null;
      this.dataSaved = false;
      this.userUpdate = usuariosReturn.id;
      // console.log(this.userUpdate);
      this.user = usuariosReturn;
      console.log(this.user);
      this.modal.config = this.ngbModalOptions;
      this.modal.show();
      this.popularDados(this.user);

    });
  }



  onSaveUser() {
    this.userForm.reset();
    this.dataSaved = true;
    this.modal.show();
    this.ctrlEditar = true;
  }

  // tslint:disable-next-line: no-shadowed-variable

  onEditUser(id, status, ModalDirective) {
    console.log(id, status);
    // this.dataSaved = false;
    this.userForm.reset();
    ModalDirective.show();
  }
  closeModal() {
    this.modal.hide();
    this.ctrlEditar = false;
  }

  onChangeGenero(form) {
    this.popularForm2(form);
  }
  onChange(form) {
    // console.log(this.permissoes[form]);
    this.popularForm(this.permissoes[form]);
  }

  habilitarEdicao() {
    this.ctrlEditar = true;
  }
}

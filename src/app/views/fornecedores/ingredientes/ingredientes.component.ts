import { estabelecimento } from './../../../_models/estabelecimento';
import { IngredienteService } from './../../../_services/ingrediente.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import 'datatables.net';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ingrediente } from '../../../_models/ingrediente';
import { HttpErrorResponse } from '@angular/common/http';
import { EstabelecimentoService } from '../../../_services/estabelecimento.service';


@Component({
  selector: 'app-ingredientes',
  templateUrl: './ingredientes.component.html',
  styleUrls: ['./ingredientes.component.css'],
  providers: [IngredienteService]
})
export class IngredientesComponent implements OnInit {

  dataSaved = false;
  ingredienteForm: FormGroup;
  allIngredientes: Observable<ingrediente[]>;
  ingredienteIdUpdate = null;
  massage = null;
  public table;
  ingrediente = new ingrediente();
  estabelecimentoID = new estabelecimento();
  url: any;

  @ViewChild('modalIngrediente', { static: false }) public modal: ModalDirective;
  ngbModalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  constructor(private formbulider: FormBuilder,
    private ingredienteService: IngredienteService,
    private estabelecimentoService: EstabelecimentoService) { }

  ngOnInit() {
    this.ingredienteForm
    = this.formbulider.group({
      nome: ['', [Validators.required]],
      enabled: [true, [Validators.required]],
      estabelecimento: [null, [Validators.required]]
    });
    const jsonTarefa = window.sessionStorage.getItem('currentUser');
    // Converte este json para objeto
    const user = JSON.parse(jsonTarefa);

    console.log(user.usuario.estabelecimento.id);
    this.url = 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/ingrediente/estabelecimentoId/' + user.usuario.estabelecimento.id;


  this.loadAllIngredientes();
  this.estabelecimentoService.getEstabelecimentoById(user.usuario.estabelecimento.id).subscribe((res: any) => {
    this.estabelecimentoID = res;
  });


  const Myself = this;
    $(document).ready(function () {
      // tslint:disable-next-line: prefer-const
      Myself.table = $('#ingredientes').DataTable({
        'ajax': {
          'url': Myself.url,
          'dataSrc': 'content'
        },
        'columnDefs': [ {
          'targets': [0, 1, 2],
          'createdCell': function (td, cellData, rowData, row, col) {
              $(td).addClass('p-0');
              if (col !== 1) {
                $(td).addClass('text-center');
              }
          }
        } ],
        'columns': [
          { 'data': 'id', width: '5%' },
          { 'data': 'nome', width: '80%' },
          /*{
            'data': 'status',
            'className': 'status',
            render: function (data, type, row) {
              const ativo = data;

              if (ativo === 'Activo') {
                return '<input type="checkbox" disabled checked />';
              } else {
                return '<input type="checkbox" disabled/>';
              }

            }
            , width: '14%'
          },*/
          {
            'className': 'button-editar bg-light',
            'data': null,
            'defaultContent': '',
            'render': function () {
              // tslint:disable-next-line:max-line-length
              return '<a><button class="btn btn-dark"><i class="fa fa-pencil text-white " aria-hidden="true"></i></button></a>'
                ;
            }
            , width: '1%'
          }
        ], 'language': {
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
        }
      });
      $('#ingredientes tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          Myself.table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }
      });

      $('#ingredientes tbody').on('click', 'td.button-editar', function () {
        const id = $(this).parent().find('td').eq(0)[0].innerHTML;
        const nome = $(this).parent().find('td').eq(1)[0].innerHTML;
        // const status = $(this).parent().find('td').eq(3)[0].innerHTML;
        this.dataSaved = false;
        Myself.onEditIngrediente(id, nome, status, Myself.modal);
        Myself.loadIngredienteToEdit(id);
      });
    });
  }
  popularDados(data) {
    console.log(data);
    this.ingredienteForm.get('enabled').setValue('true');
    this.ingredienteForm.patchValue({
      nome: data.nome,
      status: true,
      estabelecimento: this.estabelecimentoID
    });
  }

  loadAllIngredientes() {
    this.allIngredientes = this.ingredienteService.listarIngredientes(this.estabelecimentoID.id);
  }


  onFormSubmit() {
    this.dataSaved = false;
    const Ingrediente = this.ingredienteForm.value;
    if (this.dataSaved === false) {
      this.popularDados(Ingrediente);
      this.ingrediente = this.ingredienteForm.value;
      // console.log(this.ingrediente);
      this.CreateIngrediente(this.ingrediente);
    } else {
      this.popularDados(Ingrediente);
      this.ingrediente = this.ingredienteForm.value;
      console.log(this.ingrediente);
      this.CreateIngrediente(this.ingrediente);
    }
  }

  loadIngredienteToEdit(ingredienteId: string) {
    // tslint:disable-next-line: no-shadowed-variable
    this.ingredienteService.getIngredienteById(ingredienteId).subscribe(ingrediente => {
      this.massage = null;
      this.dataSaved = false;
      this.ingredienteIdUpdate = ingrediente.id;
      // console.log(this.ingredienteIdUpdate);
      this.ingrediente = ingrediente;
      // console.log(this.ingrediente);
      this.modal.config = this.ngbModalOptions;
      this.ingredienteForm.controls['nome'].setValue(ingrediente);
      this.modal.show();
      this.popularDados(this.ingrediente);
      this.modal.onShow.subscribe(() => {

      });
    });
  }
  // tslint:disable-next-line: no-shadowed-variable
  CreateIngrediente( ingrediente: ingrediente) {
    // alert(this.IngredienteIdUpdate);
    if (this.ingredienteIdUpdate == null) {
      this.ingredienteService.createIngrediente(ingrediente).subscribe(
        (dataReturn: any) => {
          this.dataSaved = true;
          this.massage = 'Ingrediente de Produto Cadastrado Com Sucesso!!!';
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: this.massage,
            showConfirmButton: false,
            timer: 1500
          });
          this.loadAllIngredientes();
          this.ingredienteIdUpdate = null;
          this.ingredienteForm.reset();
          this.closeModal();
          this.table.ajax.reload();
        },
        (dataReturn: HttpErrorResponse) => {
          Swal.fire({
            position: 'center-start',
            icon: 'error',
            title: '',
            text: dataReturn.error.details,
            footer: '<a href>Contactar o Administrador?</a>'
          });
        }
      );
    } else {
      ingrediente.id = this.ingredienteIdUpdate;
      this.ingredienteService.updateIngrediente(ingrediente).subscribe(() => {
        this.dataSaved = true;
        this.massage = 'Ingrediente alterada com Sucesso!!!';
        this.loadAllIngredientes();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: this.massage,
          showConfirmButton: false,
          timer: 1500
        });
        this.ingredienteIdUpdate = null;
        this.closeModal();
        this.table.ajax.reload();
      });
    }
  }
  deleteIngrediente(IngredienteId: string) {
    // if (confirm('Are you sure you want to delete this ?')) {
    Swal.fire({
      title: 'Eliminar',
      text: 'Deseja realmente eliminar esta Ingrediente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.ingredienteService.deleteIngredienteById(IngredienteId).subscribe(() => {
          this.dataSaved = true;
          Swal.fire(
            'Eiminada!',
            'Ingrediente Eliminada',
            'success'
          );
          this.loadAllIngredientes();
          this.ingredienteIdUpdate = null;
        });

      }
    });
    // }
  }
  resetForm() {
    this.ingredienteForm.reset();
    this.massage = null;
    this.dataSaved = false;
  }

  // tslint:disable-next-line: no-shadowed-variable
  onEditIngrediente(id, nome, status, ModalDirective) {
    // console.log(id, nome);
    this.ingredienteForm.reset();
    ModalDirective.show();
  }
  onSaveIngrediente( ) {
    this.ingredienteForm.reset();
    this.modal.show();
  }
  closeModal() {
    this.modal.hide();
  }
}

import { EstabelecimentoService } from './../../../_services/estabelecimento.service';
import { CategoriasService } from './../../../_services/categorias.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import 'datatables.net';
import { categorias } from '../../../_models/categorias';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import 'sweetalert2/src/sweetalert2.scss';
import { HttpErrorResponse } from '@angular/common/http';
import { estabelecimento } from '../../../_models/estabelecimento';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css'],
  providers: [CategoriasService, EstabelecimentoService]
})
export class CategoriaProdutoComponent implements OnInit {

  dataSaved = false;
  categoriaForm: FormGroup;
  allCategorias: Observable<categorias[]>;
  categoriaIdUpdate = null;
  massage = null;
  public table;
  categoria = new categorias();
  estabelecimentoID = new estabelecimento();

  @ViewChild('modalCategoria', { static: false }) public modal: ModalDirective;
  ngbModalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    private formbulider: FormBuilder,
    private categoriaService: CategoriasService,
    private estabelecimentoService: EstabelecimentoService) {
    }

  ngOnInit() {

    const jsonTarefa = window.sessionStorage.getItem('currentUser');
    // Converte este json para objeto
    const user = JSON.parse(jsonTarefa);

    console.log(user.usuario.estabelecimento.id);

    this.categoriaForm
      = this.formbulider.group({
        descricao: ['', [Validators.required]],
        // estabelecimento: ['', []]
      });
    this.loadAllCategorias();
    this.estabelecimentoService.getEstabelecimentoById(user.usuario.estabelecimento.id).subscribe((res: any) => {
      this.estabelecimentoID = res;
    });

    const Myself = this;
    $(document).ready(function () {
      // tslint:disable-next-line: prefer-const
      Myself.table = $('#categorias').DataTable({
        'ajax': {
          'url': 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/categoriaProduto',
          'dataSrc': 'content'
        },
        'columnDefs': [ {
          'targets': [0, 1],
          'createdCell': function (td, cellData, rowData, row, col) {
              $(td).addClass('p-0');
              if (col !== 1) {
                $(td).addClass('text-center');
              }
          }
        } ],
        'columns': [
          { 'data': 'id', width: '5%' },
          { 'data': 'descricao', width: '94%' },
          /*{
            'className': 'button-editar bg-light',
            'data': null,
            'defaultContent': '',
            'render': function () {
              // tslint:disable-next-line:max-line-length
              return '<a><button class="btn btn-primary pb-1"><i class="fa fa-pencil text-white " aria-hidden="true"></i></button></a>'
                ;
            }
            , width: '1%',
          },
          {
            'className': 'button-delete bg-light',
            'data': null,
            'defaultContent': '',
            'render': function () {
              // tslint:disable-next-line:max-line-length
              return '<button class="btn btn-danger pb-1"><i class="fa fa-trash text-white " aria-hidden="true"></i></button></<button>'
                ;
            }
            , width: '1%',
          }*/
        ]
        , 'language': {
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
      $('#categorias tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          Myself.table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }
      });

      $('#categorias tbody').on('click', 'td.button-editar', function () {
        const id = $(this).parent().find('td').eq(0)[0].innerHTML;
        const nome = $(this).parent().find('td').eq(1)[0].innerHTML;
        console.log(id);
        Myself.onEditCategoria(id, nome, Myself.modal);
        Myself.loadCategoriaToEdit(id);
      });

      $('#categorias tbody').on('click', 'td.button-delete', function () {
        const id = $(this).parent().find('td').eq(0)[0].innerHTML;
        console.log(id);
        Myself.deletecategoria(id);
      });
    });
  }

  popularDados(data) {
    this.categoriaForm.get('descricao').setValue(data.descricao);
  }
  popularForm(dado) {
    console.log(this.estabelecimentoID);
    this.categoriaForm.patchValue({
      descricao: dado,
      // estabelecimento: this.estabelecimentoID,
    });
  }

  loadAllCategorias() {
    this.allCategorias = this.categoriaService.listarCategorias();
  }
  onFormSubmit() {
    this.dataSaved = false;
    this.popularForm(this.categoriaForm.value);
    const categoria = this.categoriaForm.value;
    console.log(categoria);
    this.CreateCategoria(categoria);
    this.categoriaForm.reset();
  }

  loadCategoriaToEdit(categoriaId: string) {
    this.categoriaService.getCategoriaById(categoriaId).subscribe(categoria => {
      this.massage = null;
      this.dataSaved = false;
      this.categoriaIdUpdate = categoria.id;
      console.log(this.categoriaIdUpdate);
      this.categoria = categoria;
      console.log(this.categoria);
      this.modal.config = this.ngbModalOptions;
      this.categoriaForm.controls['descricao'].setValue(categoria);
      this.modal.show();
      this.popularDados(this.categoria);
      this.modal.onShow.subscribe(() => {

      });
    });
  }
  CreateCategoria(categoria: categorias) {
    // alert(this.categoriaIdUpdate);
    console.log(categoria);
    if (this.categoriaIdUpdate == null) {
      this.popularForm(categoria.descricao);
      console.log(categoria.estabelecimento);
      /*this.categoriaService.createCategoria(categoria).subscribe(
        (dataReturn: any) => {
          this.dataSaved = true;
          this.massage = 'Categoria de Produto Cadastrado Com Sucesso!!!';
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: this.massage,
            showConfirmButton: false,
            timer: 1500
          });
          this.loadAllCategorias();
          this.categoriaIdUpdate = null;
          this.categoriaForm.reset();
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
      );*/
    } else {
      categoria.id = this.categoriaIdUpdate;
      this.categoriaService.updateCategorias(categoria).subscribe(() => {
        this.dataSaved = true;
        this.massage = 'Categoria alterada com Sucesso!!!';
        this.loadAllCategorias();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.massage,
          showConfirmButton: false,
          timer: 1500
        });
        this.categoriaIdUpdate = null;
        this.categoriaForm.reset();
        this.closeModal();
        this.table.ajax.reload();
      });
    }
  }
  deletecategoria(categoriaId: string) {
    // if (confirm('Are you sure you want to delete this ?')) {
    Swal.fire({
      title: 'Eliminar',
      text: 'Deseja realmente eliminar esta Categoria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.categoriaService.deleteCategoriasById(categoriaId).subscribe(() => {
          this.dataSaved = true;
          Swal.fire(
            'Eiminada!',
            'Categoria Eliminada',
            'success'
          );
          this.loadAllCategorias();
          this.categoriaIdUpdate = null;
        });

      }
    });
    // }
  }
  resetForm() {
    this.categoriaForm.reset();
    this.massage = null;
    this.dataSaved = false;
  }

  // tslint:disable-next-line: no-shadowed-variable
  onEditCategoria(id, nome, ModalDirective) {
    console.log(id, nome);
    this.categoriaForm.reset();
    ModalDirective.show();
  }
  onSaveCategoria( ) {
    this.categoriaForm.reset();
    this.modal.show();
  }
  closeModal() {
    this.modal.hide();
  }

}

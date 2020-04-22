import {estabelecimento} from './../../../_models/estabelecimento';
import {IngredienteService} from './../../../_services/ingrediente.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective, ModalOptions} from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import 'datatables.net';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import Swal from 'sweetalert2';

import 'sweetalert2/src/sweetalert2.scss';
import {HttpErrorResponse} from '@angular/common/http';
import {produto} from '../../../_models/produto';
import {ProdutoService} from '../../../_services/produto.service';
import {CategoriasService} from '../../../_services/permissoes.service';
import {ingrediente} from '../../../_models/ingrediente';
import {EstabelecimentoService} from '../../../_services/estabelecimento.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
  providers: [ProdutoService, CategoriasService]
})
export class ProdutosComponent implements OnInit {
  produtoForm: FormGroup;
  labelFileUpload;
  produtoIdUpdate;
  ctrlInserirIngredienteForm: boolean = false;
  // catgArray: categorias[];
  produtos: produto[];
  ingredArray: ingrediente[];
  dataSaved;
  allProdutos: Observable<produto[]>;
  allIngredientes: ingrediente[] = [];
  allIngredientesSelected: ingrediente[] = [];
  selectIngredient: ingrediente;
  produto = new produto();
  previewProduto: produto = new produto();
  public table;
  estabelecimentoID = new estabelecimento();
  categorias: any;
  ingredientes: any;
  valor: any;
  vector: any;
  @ViewChild('produtoModal', {static: false}) public modal: ModalDirective;
  ngbModalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private categoriaService: CategoriasService,
    private ingredienteServices: IngredienteService,
    private estabelecimentoService: EstabelecimentoService
  ) {

  }

  ngOnInit() {
    const jsonTarefa = window.sessionStorage.getItem('currentUser');
    // Converte este json para objeto
    const user = JSON.parse(jsonTarefa);
    this.produtoForm
      = this.fb.group({
      nome: ['', [Validators.required]],
      preco: ['0', [Validators.required]],
      categoria: ['', [Validators.required]],
      active: [true, [Validators.required]],
      imagem: ['/', [Validators.required]],
      estabelecimento: [null, [Validators.required]],
      selectedIngrediente: [null, [Validators.required]],
      tempoPreparo: ['', [Validators.required]]
    });

    this.estabelecimentoService.getEstabelecimentoById(user.usuario.estabelecimento.id).subscribe((res: any) => {
      this.estabelecimentoID = res;
      // tslint:disable-next-line: no-shadowed-variable
      this.ingredienteServices.listarIngredientes(this.estabelecimentoID.id).subscribe((res: any) => {
        this.ingredArray = res.content;
        this.allIngredientes = res.content;
        // this.allIngredientes.push({enabled: true,  nome: 'Selecionar Ingrediente', id: -1})
        console.log(this.ingredArray);
      });

    });

    this.categoriaService.listarCategorias().subscribe((res: any) => {
      this.categorias = res.content;
    });


    const Myself = this;
    $(document).ready(function () {
      // tslint:disable-next-line: prefer-const
      Myself.table = $('#produtos').DataTable({
        'ajax': {
          // tslint:disable-next-line: max-line-length
          'url': 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/produto/searchByEstabelecimentoID/' + user.usuario.estabelecimento.id,
          'dataSrc': 'content'
        },
        'columnDefs': [{
          'targets': [0, 1, 2, 3, 4, 5, 6],
          'createdCell': function (td, cellData, rowData, row, col) {
            $(td).addClass('p-0');
            if (col !== 1) {
              $(td).addClass('text-center');
            }
            if (col === 3) {
              $(td).addClass('text-right');
            }
          }
        }],
        'columns': [
          {'data': 'id', width: '5%'},
          {'data': 'nome', width: '51%'},
          {'data': 'categoria.descricao', width: '10%'},
          {'data': 'preco', width: '20%'},
          {
            'data': 'active',
            'className': 'status',
            render: function (data, type, row) {
              if (data === true) {
                return '<input class="check" type="checkbox"  disabled checked />';
              } else {
                return '<input class="check" type="checkbox"/>';
              }

            }
            , width: '14%'
          },
          {
            'className': 'button-editar',
            'data': null,
            'defaultContent': '',
            'render': function (data) {
              const active = data.active;
              if (active === true) {
                // tslint:disable-next-line:max-line-length
                return '<button class="btn-editar btn btn-dark"><i class="fa fa-pencil text-white " aria-hidden="true"></i></button>';
              } else {
                // tslint:disable-next-line:max-line-length
                return '<button class="btn-editar btn btn-dark" disabled><i class="fa fa-pencil text-white " aria-hidden="true"></i></button>';
              }

            },
            width: '1%'
          },
          {
            'className': 'button-delete',
            'data': null,
            'defaultContent': '',
            'render': function (data) {
              const active = data.active;
              if (active === true) {
                // tslint:disable-next-line:max-line-length
                return '<button class="btn-deletar btn btn-danger"><i class="fa fa-ban text-white " aria-hidden="true"></i></button>';
              } else {
                return '<button class="btn-deletar btn btn-danger" disabled><i class="fa fa-ban text-white " aria-hidden="true"></i></button>';
              }

            }
            , width: '1%'
          }
        ],
        'responsive': true,
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
        },
      });
      $('#produtos tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
          $(this).removeClass('selected');
        } else {
          Myself.table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        }
      });

      function formatarNumero(n) {
        const num = n.toString();
        let r = '';
        let x = 0;

        for (let i = num.length; i > 0; i--) {
          r += num.substr(i - 1, 1) + (x === 2 && i !== 1 ? '.' : '');
          x = x === 2 ? 0 : x + 1;
        }
        return r.split('').reverse().join('');
      }

      function bs_input_file() {
        $('.input-file').before(
          function () {
            if (!$(this).prev().hasClass('input-ghost')) {
              const element = $('<input type=\'file\' class=\'input-ghost\' style=\'visibility:hidden; height:0\'>');
              element.attr('name', $(this).attr('name'));
              element.change(function () {
                element.next('element').find('input').val((element.val()).toString().split('\\').pop());
              });
              $(this).find('button.btn-choose').click(function () {
                element.click();
              });
              $(this).find('button.btn-reset').click(function () {
                element.val(null);
                $(this).parents('.input-file').find('input').val('');
              });
              $(this).find('input').css('cursor', 'pointer');
              $(this).find('input').mousedown(function () {
                $(this).parents('.input-file').prev().click();
                return false;
              });
              return element;
            }
          }
        );
      }

      $(function () {
        bs_input_file();

      });

      $('#produtos tbody').on('click', '.btn-editar', function () {
        const id = $(this).parent().parent().find('td').eq(0)[0].innerHTML;
        const nome = $(this).parent().parent().find('td').eq(1)[0].innerHTML;
        const status = $(this).parent().parent().find('td').eq(2)[0].innerHTML;
        // console.log(id);
        Myself.onEditproduto(id, nome, status, Myself.modal);
        Myself.loadProduto(id);
      });

      $('#produtos tbody').on('click', '.btn-deletar', function () {
        const id = $(this).parent().parent().find('td').eq(0)[0].innerHTML;
        // console.log(id)
        Myself.deleteProduto(id, false);
      });
      $('#produtos tbody').on('click', '.check', function () {
        const id = $(this).parent().parent().find('td').eq(0)[0].innerHTML;
        Myself.habilitarProduto(id, true);
      });
    });
  }

  habilitarProduto(id, status) {
    const msg = 'Deseja realmente Activar este produto ?';
    Swal.fire({
      title: 'Habilitar Produto',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Activar!'
    }).then((result) => {
      if (result.value) {
        this.produtoService.updateStatusProduto(id, status).subscribe(() => {
          this.dataSaved = true;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'produto Activado com Sucesso!!!',
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

  deleteProduto(id, status) {
    let msg;
    if (status === true) {
      msg = 'Deseja realmente desabilitar este produto ?';
    } else {
      msg = 'Deseja realmente habilitar este produto ?';
    }
    Swal.fire({
      title: 'Eliminar',
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.produtoService.updateStatusProduto(id, status).subscribe(() => {
          this.dataSaved = true;
          Swal.fire(
            'Eiminada!',
            'Produto  Desactivado',
            'success'
          );
          this.table.ajax.reload();
        });

      }
    });
  }

  loadAllprodutos() {
    this.allProdutos = this.produtoService.listarproduto();
  }

  onInsertIngrediente(idProduto: number, idIngrediente: number) {
    console.log(idProduto);
    console.log(idIngrediente);
    this.produtoService.insertIngredienteProduto(idProduto, idIngrediente).subscribe((data: any) => {
      console.log(data);
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const produtoSave = this.produtoForm.value;
    if (this.dataSaved === false) {
      this.popularDados(produtoSave);
      this.produto = this.produtoForm.value;
      console.log(this.produto);
      this.CreateProduto(this.produto);
    } else {
      this.popularDados(produtoSave);
      this.produto = this.produtoForm.value;
      console.log(this.produto);
      this.CreateProduto(this.produto);
    }
  }

  onChangeSelect($event) {
    console.log($event);
    this.selectIngredient = $event;
  }

  adicionarIngredientes() {
    let ctrl = true;
    for (let i = 0; i < this.allIngredientesSelected.length; i++) {
      if (this.allIngredientesSelected[i].id === this.selectIngredient.id) {
        console.log('Elemento existente');
        ctrl = false;
        break;
      }
    }
    console.log(this.allIngredientesSelected.indexOf(this.selectIngredient));
    if (ctrl) {
      this.allIngredientesSelected.push(this.selectIngredient);
      this.clearSelectIngrediente();
      $('#listaIngredientes').append('<li class="list-group-item p-1">' + this.selectIngredient.nome + '</li>');
    }
  }

  // tslint:disable-next-line: no-shadowed-variable
  CreateProduto(produto: produto) {
    if (this.produtoIdUpdate == null) {
      this.produtoService.createProduto(produto).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (produto: any) => {
          this.dataSaved = true;
          this.produtos = produto;
          this.inserirIngrediente(produto.id);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Produto Cadastrado Com Sucesso!!!',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadAllprodutos();
          this.produtoIdUpdate = null;
          this.produtoForm.reset();
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
      produto.id = this.produtoIdUpdate;
      this.produtoService.updateProduto(produto).subscribe(() => {
        this.dataSaved = true;
        this.loadAllprodutos();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'produto alterado com Sucesso!!!',
          showConfirmButton: false,
          timer: 1500
        });
        this.produtoIdUpdate = null;
        this.produtoForm.reset();
        this.closeModal();
        this.table.ajax.reload();
      });
    }
  }


  closeModal() {
    this.modal.hide();
  }


  loadProduto(produtoId: string) {
    // tslint:disable-next-line: no-shadowed-variable
    this.produtoService.getProdutoById(produtoId).subscribe((produto) => {
      this.dataSaved = false;
      this.produtoIdUpdate = produto.id;
      // console.log(this.produtoIdUpdate);
      this.produto = produto;
      // console.log(produto.ingredienteProdutos);
      this.modal.config = this.ngbModalOptions;
      this.modal.show();
      this.popularDados(this.produto);
      this.vector = produto.ingredienteProdutos;
      this.popularIngredientes(produto.ingredienteProdutos);
      const MySelf = this;
      $('#listaIngredientes li span').click(function (e) {
        console.log(e.currentTarget.attributes.getNamedItem('idingrediente').value);
        console.log(produtoId);
        console.log(!e.currentTarget.attributes.getNamedItem('enabled').value);
        Swal.fire({
          title: 'Estás certo disso?',
          text: 'Estás preste a mudar o estado deste Ingrediente.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, alterar!'
        }).then((result) => {
          if (result.value) {
            const idingrediente = Number(e.currentTarget.attributes.getNamedItem('idingrediente').value);
            const enabled = Boolean(e.currentTarget.attributes.getNamedItem('enabled').value);
            MySelf.eliminarIngrediente(Number(produtoId), idingrediente, enabled);
          }
        });

      });
      this.modal.onShow.subscribe(() => {
      });
    });

  }

  inserirIngrediente(produtoID) {
    const MySelf = this;
    this.allIngredientesSelected.forEach(function (valueIngrediente) {
      console.log(valueIngrediente);
      MySelf.onInsertIngrediente(produtoID, Number(valueIngrediente.id));
    });
    this.allIngredientesSelected = [];
  }

  eliminarIngrediente(produtoID: number, ingredienteID: number, status: boolean) {
    this.produtoService.updateStatusIngredienteProduto(produtoID, ingredienteID, !status).subscribe((resposta: any) => {
      console.log(resposta);
    });
  }

  popularDados(data) {
    this.previewProduto = data;
    console.log(this.previewProduto);
    this.produtoForm.get('active').setValue('true');
    this.produtoForm.patchValue({
      active: true,
      imagem: data.imagem,
      nome: data.nome,
      categoria: data.categoria,
      preco: data.preco,
      tempoPreparo: data.tempoPreparo,
      estabelecimento: this.estabelecimentoID
    });
  }

  popularIngredientes(listaIngredientes) {
    console.log(listaIngredientes);
    const MySelf = this;
    listaIngredientes.forEach(function (valorIngrediente: any) {
      // tslint:disable-next-line:max-line-length
      console.log(valorIngrediente);
      $('#listaIngredientes').append('<li class="list-group-item p-1 d-flex justify-content-between align-items-center">' + valorIngrediente.ingrediente.nome + '<span class="badge badge-secondary badge-pill btnRemoveIngrediente" idingrediente="' + valorIngrediente.id + '" enabled="' + valorIngrediente.enabled + '" ><i class="fa fa-trash-o"></i></span></li>');
      MySelf.allIngredientesSelected.push(valorIngrediente.ingrediente);
    });
  }

  popularCategoria(data) {
    console.log(data);
    this.produtoForm.get('active').setValue('true');
    this.produtoForm.patchValue({
      categoria: data,
      estabelecimento: this.estabelecimentoID
    });
  }

  // tslint:disable-next-line: no-shadowed-variable

  onEditproduto(id, nome, status, ModalDirective) {
    // console.log(id, nome, status);
    ModalDirective.show();
  }

  close() {
    $('#listaIngredientes').html('');
    this.allIngredientesSelected = [];
    this.modal.hide();

  }

  onChange(form) {
    console.log(this.categorias[form]);
    this.popularCategoria(this.categorias[form]);
  }

  openModal() {
    this.produtoForm.reset();
    this.previewProduto = new produto();
    console.log(this.previewProduto.ingredienteProdutos == null);
    this.modal.show();
  }

  public fileEvent(event) {
    if (event.target.files.length > 0) {
      const files = event.target.files[0].name;
      this.labelFileUpload = files;
      console.log(files);
    }
  }

  getIngredientes(idProduto) {
    this.produtoService.getProdutoById(idProduto).subscribe((data) => {
      this.ingredientes = data;
    });
  }

  clearSelectIngrediente() {
    this.produtoForm.get('selectedIngrediente').patchValue([]);
  }

}

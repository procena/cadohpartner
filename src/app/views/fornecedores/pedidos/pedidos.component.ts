import {PedidoService} from './../../../_services/pedido.service';
import {AuthenticationService} from './../../../_services/authentication.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective, ModalOptions, BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import 'datatables.net';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {pedido} from '../../../_models/pedido';
import {UserService} from '../../../_services/user.service';
import {produto} from '../../../_models/produto';
import {usuario} from '../../../_models/usuario';
import {Cliente} from '../../../_models/cliente';
import Swal from 'sweetalert2';
import {isObject} from "util";

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  @ViewChild('editModal', {static: false}) public editModal: ModalDirective;
  ngbModalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  public table;
  pedido = new pedido();
  pedidoForm: FormGroup;
  cliente: Cliente = new Cliente();
  clienteSelect: usuario = new usuario();
  itens: any;
  pedidos: any;
  parametro = 'getTodosPedidos';

  checkTodos = true;
  checkPreparo = true;
  private idPedidoSelect: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authentication: AuthenticationService,
    private pedidoService: PedidoService,
    private userService: UserService) {

  }

  ngOnInit() {
    const Myself = this;
    const jsonTarefa = window.sessionStorage.getItem('currentUser');
    const user = JSON.parse(jsonTarefa);

    this.pedidoForm
      = this.fb.group({
      taxaPedido: ['', [Validators.required]],
      dataPedido: ['', [Validators.required]],
      custoTotal: ['', [Validators.required]],
      endereco: this.fb.group({
        municipio: [''],
        bairro: [''],
        rua: [''],
      }),
      // estabelecimento: [null, [Validators.required]],
      obs: ['', [Validators.required]],
      pedidoProdutos: [null, [Validators.required]],
      qtdProdutos: ['', [Validators.required]],
      referencias: ['', [Validators.required]],
      status: ['', [Validators.required]],
      cliente: this.fb.group({
        nome: [''],
        // email: [''],
        telefone: ['']
      }),
      tipoServico: ['', [Validators.required]],
    });
// https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento/8/getPedidoEmPreparo

    $(document).ready(function () {
      console.log(user.token);
      // tslint:disable-next-line: prefer-const
      Myself.table = $('#pedidos').DataTable({
        'ajax': {
          // tslint:disable-next-line: max-line-length
          // 'url': 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento/' + user.usuario.estabelecimento.id + '/getTodosPedidos',
          // tslint:disable-next-line: max-line-length
          'url': 'https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento/' + user.usuario.estabelecimento.id + '/' + Myself.parametro,
          headers: {
            Authorization: user.tokenType + ' ' + user.token
          },
          'dataSrc': 'content'
        },
        'initComplete': function (t, r) {
          this.api().columns().every(function () {
            const column = this;
            const select = $('<select><option value="">Selecionar Todos</option></select>')
              .appendTo($(column.footer()).empty())
              .on('change', function () {
                const val = $.fn.dataTable.util.escapeRegex(
                  String($(this).val())
                );

                column
                  .search(val ? '^' + val + '$' : '', true, false)
                  .draw();
              });

            column.data().unique().sort().each(function (d, j) {
              if (typeof d !== 'object') {
                select.append('<option value="' + d + '">' + d + '</option>');
              }
            });
          });
        },
        'columns': [

          {'data': 'id', width: '5%'},
          {'data': 'custoTotal', width: '20%'},
          {'data': 'dataPedido', width: '30%'},
          {'data': 'status', width: '10%'},
          {'data': 'obs', width: '20%'},
          {
            'className': 'button-view bg-light text-center',
            'data': null,
            'defaultContent': '',
            'render': function () {
              // tslint:disable-next-line:max-line-length
              return '<button class="btn btn-dark"><i class="fa fa-search text-white " aria-hidden="true"> Detalhe</i></button>';
            }
            , width: '2%'
          }
        ],
        'responsive': true,
        'columnDefs': [
          {'className': 'dt-center', 'targets': '_all'},
          {
            'targets': 3,
            'createdCell': function (td, cellData, rowData, row, col) {
              switch (cellData) {
                case 'Cancelado':
                  $(td).append('<i class="fa fa-circle ml-2" style="color: #F39B9B"></i>');
                  break;
                case 'Entregue':
                  $(td).append('<i class="fa fa-circle ml-2" style="color: #A497E5"></i>');
                  break;
                case 'Em preparo':
                  $(td).append('<i class="fa fa-circle ml-2" style="color: #9EF395"></i>');
                  break;
                case 'ABERTO':
                  $(td).append('<i class="fa fa-circle ml-2 font-weight-bold font-3xl shadow-lg" style="color: #e2a356"></i>');
                  break;
                case 'Saiu para entrega':
                  $(td).append('<i class="fa fa-circle ml-2" style="color: #A9E2F3"></i>');
                  break;
              }
            }
          }, {
            'targets': [1, 2],
            'createdCell': function (td, cellData, rowData, row, col) {
              switch (col) {
                case 2:
                  $(td).html(new Date(cellData).toLocaleString());
                  break;
                case 1:
                  $(td).html(Number(cellData).toFixed(2) + ' AOA');
                  break;
              }
            }
          }
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
        },
      });

      $('#pedidos tbody').on('click', 'td.button-view', function () {
        const id = $(this).parent().find('td').eq(0)[0].innerHTML;
        Myself.viewPedido(id, Myself.editModal);
        Myself.loadPedido(id);
      });
    });
  }

  // tslint:disable-next-line:no-shadowed-variable
  viewPedido(id, ModalDirective) {
    ModalDirective.show();
  }

  loadPedido(pedidoId: string) {

    // tslint:disable-next-line: no-shadowed-variable
    this.idPedidoSelect = pedidoId;
    this.pedidoService.getPedidoById(pedidoId).subscribe((returnData) => {
      this.pedido = returnData;
      this.itens = returnData.pedidoProdutos;
      console.log(this.pedido);
      this.editModal.config = this.ngbModalOptions;
      this.editModal.show();
      this.popularDados(this.pedido);
      this.userService.getCliente(returnData.cliente.id)
        .subscribe((dataReturn) => {
          this.clienteSelect = dataReturn;
          this.cliente = dataReturn.cliente;
          console.log(this.cliente);
          this.popularDadosCliente(dataReturn);
          this.editModal.onShow.subscribe(() => {
          });
        });

    });
  }

  popularDados(data) {
    console.log(data.endereco);
    this.pedidoForm.patchValue({
      endereco: {
        municipio: data.endereco.municipio,
        bairro: data.endereco.bairro,
        rua: data.endereco.rua
      },
    });

  }

  popularDadosCliente(dado) {
    console.log(dado);
    this.pedidoForm.patchValue({
      cliente: {
        nome: dado.primeiroNome + ' ' + dado.segundoNome,
        email: dado.username,
        telefone: dado.username
      },

    });
  }

  closeModal() {
    this.editModal.hide();
    this.itens = null;
  }

  cancelarPedido() {
    Swal.fire({
      title: 'Tens a certeza?',
      text: 'Está presta a cancelar este pedido! é uma acção sem volta!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim!'
    }).then((result) => {
      if (result.value) {
        this.pedidoService.deletePedidoById(this.idPedidoSelect).subscribe((returnData) => {
          console.log(returnData);
          Swal.fire(
            'Sucesso!',
            'Pedido foi cancelado com sucesso.',
            'success'
          );
          this.table.ajax.reload();
        });
      }
    });
  }
}

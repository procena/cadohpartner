import { UsuariosEstabelecimentoComponent } from './usuarios-estabelecimento/usuarios-estabelecimento.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { IngredientesComponent } from './ingredientes/ingredientes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstabelecimentoComponent } from './estabelecimento/estabelecimento.component';
import { CategoriaProdutoComponent } from './categoria-produto/categoria-produto.component';




const routes: Routes = [
  {
    path: '',
    data: {
      title: 'fornecedores'
    },
    children: [
      {
        path: '',
        redirectTo: 'fornecedores'
      },
      {
        path: 'estabelecimento',
        component: EstabelecimentoComponent,
        data: {
          title: 'estabelecimento'
        }
      },
      {
        path: 'categoria-produto',
        component: CategoriaProdutoComponent,
        data: {
          title: 'categoria de produtos'
        }
      },
      {
        path: 'ingredientes',
        component: IngredientesComponent,
        data: {
          title: 'categoria de produtos'
        }
      },
      {
        path: 'produtos',
        component: ProdutosComponent,
        data: {
          title: 'listagem dos produtos'
        }
      },
      {
        path: 'pedidos',
        component: PedidosComponent,
        data: {
          title: 'pedidos'
        }
      },
      {
        path: 'usuarios-estabelecimento',
        component: UsuariosEstabelecimentoComponent,
        data: {
          title: 'pedidos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedoresRoutingModule {}

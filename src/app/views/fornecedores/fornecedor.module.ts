import { CategoriasService } from './../../_services/categorias.service';
import { ProdutosComponent } from './produtos/produtos.component';
import { IngredientesComponent } from './ingredientes/ingredientes.component';
// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
// Carousel Component
import { CarouselModule } from 'ngx-bootstrap/carousel';
// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FornecedoresRoutingModule } from './fornecedores-routing.module';
import { EstabelecimentoComponent } from './estabelecimento/estabelecimento.component';
import { CategoriaProdutoComponent } from './categoria-produto/categoria-produto.component';
import { AlertModule, ModalModule } from 'ngx-bootstrap';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosEstabelecimentoComponent } from './usuarios-estabelecimento/usuarios-estabelecimento.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Components Routing


@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    FornecedoresRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    ModalModule,
    AlertModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [CategoriasService],
  declarations: [
    EstabelecimentoComponent,
    CategoriaProdutoComponent,
    IngredientesComponent,
    ProdutosComponent,
    PedidosComponent,
    UsuariosEstabelecimentoComponent
  ]
})
export class FornecedorModule { }

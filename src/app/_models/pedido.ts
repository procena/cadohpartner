import { endereco } from './endereco';
import { estabelecimento } from './estabelecimento';

// tslint:disable-next-line: class-name
export class pedido {
    id: number;
    taxaPedido: number;
    dataPedido: string;
    custoTotal: number;
    endereco: endereco;
    estabelecimento: estabelecimento;
    obs: string;
    pedidoProdutos: number;
    qtdProdutos: number;
    referencias: string;
    status: string;
    cliente: any;
    tipoServico: string;
// tslint:disable-next-line: eofline
}
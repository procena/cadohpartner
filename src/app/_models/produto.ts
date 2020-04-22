import { categorias } from './categorias';
import { estabelecimento } from './estabelecimento';
import { ingrediente } from './ingrediente';
// tslint:disable-next-line: class-name
export class produto {
    id: number;
    active: boolean;
    cadastro: Date;
    dataAlteracao: Date;
    imagem: string;
    nome: string;
    preco: string;
    categoria: categorias;
    estabelecimento: estabelecimento;
    tempoPreparo: string;
    ingredienteProdutos: ingrediente;
}

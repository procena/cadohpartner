import { estabelecimento } from './estabelecimento';
// tslint:disable-next-line: class-name
export class categorias {
    id: String;
    descricao: String;
    estabelecimento = new estabelecimento();
}

import { estabelecimento } from './estabelecimento';
import { permissao } from './permissao';
import {Cliente} from './cliente';

// tslint:disable-next-line: class-name
export class usuario {
    id: number;
    datacadastro: string;
    enabled: boolean;
    genero: string;
    imageUrl: string;
    loginVerified: boolean;
    primeiroNome: string;
    segundoNome: string;
    password: string;
    providerId: string;
    provider: string;
    username: string;
    tipoUsuario: permissao = new permissao();
    estabelecimento: estabelecimento;
    token?: string;
  cliente: Cliente = new Cliente();
    usuario(username, password) {
        this.username = username;
        this.password = password;
    }
}

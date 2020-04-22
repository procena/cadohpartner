import { INavData } from '@coreui/angular';

/*interface NavAttributes {
  [propName: string]: any;
}

interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}

interface NavBadge {
  text: string;
  variant: string;
}

interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export class ModuloInt {
  name: String;
  url: String;
  icon: String;
}
*/

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },

  {
    title: true,
    name: 'MENU PRINCIPAL'
  },
  {
    name: 'Estabelecimento',
    url: '/fornecedores/estabelecimento',
    icon: 'icon-home'
  },
  {
    name: 'Produtos',
    url: '/fornecedores',
    icon: 'icon-social-dropbox',
    children: [
      {
        name: 'Categorias',
        url: '/fornecedores/categoria-produto',
        icon: 'icon-list'
      },
      {
        name: 'Ingredientes',
        url: '/fornecedores/ingredientes',
        icon: 'icon-layers'
      },
      {
        name: 'Lista dos Produtos',
        url: '/fornecedores/produtos',
        icon: 'icon-layers'
      },
    ]
  },
  {
    name: 'Pedidos',
    url: '/fornecedores',
    icon: 'icon-pie-chart',
    children: [
      {
        name: 'Todos os pedidos ',
        url: '/fornecedores/pedidos',
        icon: 'icon-screen-desktop'
      },
      /*{
        name: 'Pedidos do dia',
        url: '/fornecedores/pedidos',
        icon: 'icon-screen-desktop'
      },
      {
        name: 'Pedidos por entregar',
        url: '/fornecedores/pedidos',
        icon: 'icon-screen-desktop'
      },
      {
        name: 'Pedidos em preparo',
        url: '/fornecedores/pedidos',
        icon: 'icon-screen-desktop'
      },
      {
        name: 'Pedidos cancelados',
        url: '/fornecedores/pedidos',
        icon: 'icon-screen-desktop'
      },*/
    ]
  },
  {
    name: 'Sistema',
    url: '/fornecedores',
    icon: 'icon-settings',
    children: [
      {
        name: 'Utilizador',
        url: '/fornecedores/usuarios-estabelecimento',
        icon: 'icon-user-follow'
      },
    ]
  },
];

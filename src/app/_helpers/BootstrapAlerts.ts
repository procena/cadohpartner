import {Injectable} from '@angular/core';
import {NotificationsService} from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class BootstrapAlerts {
  private defaultOption = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  constructor(private _service: NotificationsService) {

  }

  public teste() {
    //console.log('teste');
    this.abrir('teste', 'testando service', 'success');
  }

  public abrir(titulo, conteudo, tipo = 'alert', opcoes = this.defaultOption) {
    switch (tipo) {
      case 'success':
        this._service.success(titulo, conteudo, opcoes);
        break;
        case 'error':
        this._service.error(titulo, conteudo, opcoes);
        break;
      case 'warn':
        this._service.warn(titulo, conteudo, opcoes);
        break;
      case 'info':
        this._service.info(titulo, conteudo, opcoes);
        break;
      case 'alert':
      default:
        this._service.alert(titulo, conteudo, opcoes);
    }
  }

}

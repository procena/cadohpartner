import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstabelecimentoService } from '../../../_services/estabelecimento.service';
import { estabelecimento } from '../../../_models/estabelecimento';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.component.html',
  styleUrls: ['./estabelecimento.component.css'],
  providers: [EstabelecimentoService]
})
export class EstabelecimentoComponent implements OnInit {

  estabelecimento = new estabelecimento();
  estabelecientoForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private service: EstabelecimentoService,
    private formbulider: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit() {


    this.estabelecientoForm
      = this.formbulider.group({
        id: ['', [Validators.required]],
        nome: ['', [Validators.required]],
        sigla: ['', [Validators.required]],
        email: ['', [Validators.required]],
        telefone: ['', [Validators.required]],
        horario: ['', [Validators.required]],
        imagem: ['', [Validators.required]],
        nif: ['', [Validators.required]],
        active: ['', [Validators.required]],
        dataCadastro: ['', [Validators.required]],
        // endereco: ['', [Validators.required]],
        // grupoEstabelecimento: ['', [Validators.required]],
        // redeEstabelecimento: ['', [Validators.required]],
      });

    const jsonTarefa = window.sessionStorage.getItem('currentUser');
    // Converte este json para objeto
    const user = JSON.parse(jsonTarefa);

    // console.log(user.usuario.estabelecimento.id);
    this.getEstabelecimento(user.usuario.estabelecimento.id);

  }


  onFormSubmit() {
    // console.log(this.estabelecimento);
    // console.log(this.estabelecimento);
    // this.popularDados(this.estabelecimento);
    this.procedimento();
    this.updateEstabelecimento(this.estabelecimento); // Updateando...
    this.getEstabelecimento(this.estabelecimento.id);
  }

  procedimento() {
    this.estabelecimento.nome = this.estabelecientoForm.value.nome;
    this.estabelecimento.sigla = this.estabelecientoForm.value.sigla;
    this.estabelecimento.email = this.estabelecientoForm.value.email;
    this.estabelecimento.telefone = this.estabelecientoForm.value.telefone;
    this.estabelecimento.horario = this.estabelecientoForm.value.horario;
    this.estabelecimento.nif = this.estabelecientoForm.value.nif;
  }

  popularDados(data) {
    this.estabelecientoForm.get('id').setValue(data.id);
    this.estabelecientoForm.get('nome').setValue(data.nome);
    this.estabelecientoForm.get('sigla').setValue(data.sigla);
    this.estabelecientoForm.get('email').setValue(data.email);
    // tslint:disable-next-line: max-line-length
    // this.estabelecientoForm.get('endereco').setValue(data.endereco.provincia + ' ' + data.endereco.morada + ' ' + data.endereco.municipio + ' ' + data.endereco.bairro + ' ' + data.endereco.comuna) + ' ' + data.endereco.rua;
    this.estabelecientoForm.get('telefone').setValue(data.telefone);
    this.estabelecientoForm.get('horario').setValue(data.horario);
    this.estabelecientoForm.get('nif').setValue(data.nif);
  }


  getEstabelecimento(id) {
    this.service.getEstabelecimentoById(id)
      .subscribe(dados => {
        this.estabelecimento = dados;
        this.popularDados(dados);
      });
  }

  onSubmit() {
    let header = new HttpHeaders();
    header = header.append('content-type', 'application/json');
    console.log(this.estabelecientoForm.value);
    // if (this.formulario.valid) {
    this.http.put(`https://aw-cadoh-api-kilamba.herokuapp.com/api/v1/estabelecimento`,
      JSON.stringify(this.estabelecientoForm.value), { headers: header })
      .pipe(map(data => { })).
      subscribe(success => {
        Swal.fire(
          'Dados Actualizados com Sucesso!',
          '',
          'success'
        );
      },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao actualizar dados do Cliente',
            text: '',
            footer: '<a href>Enviar informação ao suporte Técnico</a>'
          });
        }
      );

  }



  // tslint:disable-next-line: no-shadowed-variable
  updateEstabelecimento(estabelecimento: estabelecimento) {
    // console.log(estabelecimento);
    this.service.updateEstabelecimento(estabelecimento).subscribe(
      (dataReturn: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Informações actualizadas com sucesso!!!',
          showConfirmButton: false,
          timer: 1500
        });
      },
      (dataReturn: HttpErrorResponse) => {
        Swal.fire({
          position: 'center-start',
          icon: 'error',
          title: '',
          text: dataReturn.error.message,
          footer: '<a href>Contactar o Administrador?</a>'
        });
      }
    );
  }

}

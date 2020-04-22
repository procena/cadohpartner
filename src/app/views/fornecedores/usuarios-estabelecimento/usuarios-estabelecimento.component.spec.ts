import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosEstabelecimentoComponent } from './usuarios-estabelecimento.component';

describe('UsuariosEstabelecimentoComponent', () => {
  let component: UsuariosEstabelecimentoComponent;
  let fixture: ComponentFixture<UsuariosEstabelecimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosEstabelecimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosEstabelecimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

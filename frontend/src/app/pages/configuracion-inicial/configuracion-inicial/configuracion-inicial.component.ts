import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { ConfiguracionService } from '../configuracion.service';

@Component({
  selector: 'app-configuracion-inicial',
  templateUrl: './configuracion-inicial.component.html',
  styleUrls: ['./configuracion-inicial.component.scss'],
})
export class ConfiguracionInicialComponent implements OnInit {
  current = 0;
  total = 3;

  index = 'First-content';
  validateForm!: FormGroup;
  metodo = 'local';
  isLoading = false;
  auth!: any;
  usuariosLdap!: any[];
  usuariosSeleccionados!: any[];
  networksSeleccionados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private configuracionService: ConfiguracionService,
    private messageService: NzMessageService,
    private errorService: ErrorService,
    private modalRef: NzModalRef,
    private authService: AuthService
  ) {
    this.auth = this.authService.getSession();
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [
        '',
        [Validators.required],
      ],
      password: ['', [Validators.required]],
      baseDn: [
        '',
        [Validators.required],
      ],
      port: [389, [Validators.required]],
      timeout: [5, [Validators.required]],
      host: ['', [Validators.required]],
      source: ['ldap', [Validators.required]],
    });
  }

  pre(): void {
    if (this.metodo == 'local' && this.current == 2) {
      this.current = 0;
      this.cdr.detectChanges();
    } else {
      this.current -= 1;
    }
  }

  next(): void {
    if (this.metodo == 'local' && this.current == 0) {
      this.current = this.total-1;
    } else {
      this.validarFormulario();
      if (this.validateForm.valid) {
        if(this.current == 0) {
          this.probarConeccion(true);
        }
        if(this.current > 0) {
          this.current += 1;
        }
        
      }
    }
  }

  done(): void {
    console.log('done');
  }

  validarFormulario() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  probarConeccion(change = false) {
    this.validarFormulario();
    if (this.validateForm.valid) {
      this.usuariosLdap = [];
      this.isLoading = true;
      this.configuracionService
        .probarConexion(
          this.validateForm.controls['userName'].value,
          this.validateForm.controls['password'].value,
          this.validateForm.controls['host'].value,
          this.validateForm.controls['port'].value,
          this.validateForm.controls['baseDn'].value
        )
        .subscribe((data) => {
          this.isLoading = false;
          if (data.success) {
            if (change) {
              this.current += 1;
              this.usuariosLdap = data.usuarios;
              this.cdr.detectChanges();
            } else {
              this.messageService.success(
                'La conexión se ha realizado correctamente'
              );
            }
          } else {
            this.messageService.error(
              'No se pudo establecer la conexión con el servidor seleccionado. Por favor revise que los parámetros introducidos sean correctos '
            );
          }
        });
      this.procesarError();
    }
  }

  onInportedUsers(e: any[]) {
    this.usuariosSeleccionados = e;
  }
  
  onInportedNetworks(e: any[]) {
    this.networksSeleccionados = e;
    console.log(this.networksSeleccionados);
  }

  salvarConfiguracion() {
    let validado = true;
    if (this.metodo != 'local') {
      this.validarFormulario();
      validado = this.validateForm.valid;
    }
    if (validado) {
      this.isLoading = true;
      this.configuracionService
        .salvarConexion({
          username: this.validateForm.controls['userName'].value,
          password: this.validateForm.controls['password'].value,
          host: this.validateForm.controls['host'].value,
          port: this.validateForm.controls['port'].value,
          base_dn: this.validateForm.controls['baseDn'].value,
          source: this.validateForm.controls['source'].value,
          timeout: this.validateForm.controls['timeout'].value,
          usuarios: this.usuariosSeleccionados,
          networks: this.networksSeleccionados
        })
        .subscribe((data) => {
          this.isLoading = false;
          if (data.success) {
            this.messageService.success(
              'La operación se ha realizado correctamente'
            );
            this.cerraModal();
          } else {
            this.messageService.error('Ha ocurrido un error inesperado');
          }
        });
      this.procesarError();
    }
  }

  procesarError() {
    this.errorService.getError().subscribe((e) => {
      if (e) {
        this.isLoading = !e;
      }
    });
  }

  cerraModal() {
    this.modalRef.destroy();
    this.setRealizada();
  }

  cancelarOperacion() {
    this.configuracionService.establecerComoRealizada().subscribe();
    this.cerraModal();
  }

  setRealizada() {
    this.auth.realizada = true;
    this.auth = btoa(JSON.stringify(this.auth));
    this.authService.setSession(this.auth);
    this.cdr.detectChanges();
  }
}

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { PerfilService } from '../perfil.service';


@Component({
  selector: 'app-perfil-form',
  templateUrl: './perfil-form.component.html',
  styleUrls: ['./perfil-form.component.scss']
})
export class PerfilFormComponent implements OnInit{
  @Input() id!: any;
  @Input() permisosEntrada: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  title = "Adicionar Perfil";
  local = true;

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private perfilService: PerfilService, private fb: FormBuilder, 
    private errorService: ErrorService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.id) {
      this.title = 'Editar Perfil'
      this.cargarDatos(this.id);
    } else {
      this.title = 'Adicionar Perfil'
      this.permisos = this.permisosEntrada;
    }
    this.cdr.detectChanges();

  }

  cargarDatos(id: number) {
    this.lodading = true;
    this.perfilService.cargarDatos(id).subscribe(data => {
     
      if (data.success) {
        this.llenarDatosFormulario(data.perfil);
      } else {
        this.messageService.error('Ha ocurrido un error inesperado');
      }
      this.lodading = false;
    })
    this.procesarError();
  }

  crearFormulario() {
    this.formGroup = this.fb.group({
      perfil: [null, [Validators.required]],
    });
  }

  llenarDatosFormulario(data: any) {
    this.formGroup.controls['perfil'].setValue(data.perfil);
    this.local = data.local;
    this.permisos = data.permisos;
    this.cdr.detectChanges();
  }
  
  cerrarModal(status: boolean) {
    this.id = null;
    this.permisos = [];
    this.modalRef.destroy({ data: status });
  }

  procesarError() {
    this.errorService.getError().subscribe(e => {
      if(e) {
        console.log(e);
        this.lodading = !e;
      }
    
    });
  }

  salvarDatos() {
    if (this.id) {
      this.editar(this.id)
    } else {
      this.salvar()
    }
  }

  editar(id: number) {
    this.validarForm();
    if (this.formGroup.valid) {
      this.lodading = true;
      this.perfilService.modificarPerfil({
        id: this.id,
        perfil: this.formGroup.controls['perfil'].value,
        permisos: this.permisos,
      }).subscribe(data => {
        this.lodading = false;
          if(data.success) {
            this.cerrarModal(true);
          } else {
            this.messageService.error(data.message);
          }
      })
    }
    this.procesarError();
  }

  salvar() {
    this.validarForm();
    if (this.formGroup.valid) {
      this.lodading = true;
      this.perfilService.adicionarPerfil({
        id: this.id,
        perfil: this.formGroup.controls['perfil'].value,
        permisos: this.permisos,
      }).subscribe(data => {
        this.lodading = false;
          if(data.success) {
            this.cerrarModal(true);
          } else {
            this.messageService.error(data.message);
          }
      })
    }
    this.procesarError();
  }

  validarForm() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
  }

  onChangePermisos(e:any []) {
    this.permisos = e;
  }
}

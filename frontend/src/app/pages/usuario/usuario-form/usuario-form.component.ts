import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { PerfilService } from '../../perfil/perfil.service';
import { UsuarioService } from '../usuario.service';

export function matchValidator(
  matchTo: string, 
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl): 
  ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo] 
      AbstractControl;
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value === 
      (control.parent?.controls as any)[matchTo].value
      ? null
      : { matching: true };
  };
}
@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit{
  @Input() id!: any;
  @Input() tiendas: any[] = [];
  @Input() permisosEntrada: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  perfiles: any[] = [];
  title = "Adicionar Usuario";
  local = true;

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private usuarioService: UsuarioService, private fb: FormBuilder, 
    private errorService: ErrorService, private cdr: ChangeDetectorRef, private perfilService: PerfilService) { }

  ngOnInit(): void {
    this.perfilService.listarTodosPerfiles().subscribe(data=>{
      console.log(data)
    });
    this.crearFormulario();
    if (this.id) {
      this.title = 'Editar Usuario'
      this.cargarDatos(this.id);
    } else {
      this.title = 'Adicionar Usuario'
      this.permisos = this.permisosEntrada;
    }

    
    this.cdr.detectChanges();

  }

  cargarDatos(id: number) {
    this.lodading = true;
    this.usuarioService.cargarDatos(id).subscribe(data => {
     
      if (data.success) {
        this.llenarDatosFormulario(data.usuario);
      } else {
        this.messageService.error('Ha ocurrido un error inesperado');
      }
      this.lodading = false;
      console.log(this.lodading);
    })
    this.procesarError();
  }

  crearFormulario() {
    
    this.formGroup = this.fb.group({
      nombre: ["", [Validators.required]],
      username: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      perfil: [null, [Validators.required]],
      password: ["", []],
      passwordTwo: ["", [matchValidator('password')]],
      tienda: [""]
    });
  
  }

  llenarDatosFormulario(data: any) {
    this.local = data.local;
    this.crearFormulario();

    this.formGroup.controls['nombre'].setValue(data.nombre);
    this.formGroup.controls['username'].setValue(data.usuario);
    this.formGroup.controls['email'].setValue(data.email);
    this.formGroup.controls['perfil'].setValue(data.perfil);
    this.formGroup.controls['tienda'].setValue(data.tienda);
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
      this.formGroup.controls['password'].removeValidators(Validators.required);
      this.editar(this.id)
    } else {
      this.formGroup.controls['password'].addValidators([Validators.required]);
      this.salvar()
    }
  }

  editar(id: number) {
    this.validarForm();
    if (this.formGroup.valid) {
      this.lodading = true;
      this.usuarioService.modificarUsuario({
        id: this.id,
        nombre: this.formGroup.controls['nombre'].value,
        usuario: this.formGroup.controls['username'].value,
        email: this.formGroup.controls['email'].value,
        perfil: this.formGroup.controls['perfil'].value,
        password: this.formGroup.controls['password'].value,
        tienda: this.formGroup.controls['tienda'].value,
        
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
      this.usuarioService.adicionarUsuario({
        id: this.id,
        nombre: this.formGroup.controls['nombre'].value,
        usuario: this.formGroup.controls['username'].value,
        email: this.formGroup.controls['email'].value,
        perfil: this.formGroup.controls['perfil'].value,
        password: this.formGroup.controls['password'].value,
        tienda: this.formGroup.controls['tienda'].value,
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

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { CategoriaService } from '../categoria.service';

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
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss']
})
export class CategoriaFormComponent implements OnInit{
  @Input() id!: any;
  @Input() permisosEntrada: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  perfiles: any[] = [];
  title = "Adicionar Categoria";
  local = true;

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private categoriaService: CategoriaService, private fb: FormBuilder, 
    private errorService: ErrorService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.id) {
      this.title = 'Editar Categoría'
      this.cargarDatos(this.id);
    } else {
      this.title = 'Adicionar Categoría'
      this.permisos = this.permisosEntrada;
    }
    this.cdr.detectChanges();

  }

  cargarDatos(id: number) {
    this.lodading = true;
    this.categoriaService.cargarDatos(id).subscribe(data => {

      if (data.success) {
        this.llenarDatosFormulario(data.categoria);
      } else {
        this.messageService.error('Ha ocurrido un error inesperado');
      }
      this.lodading = false;
    })
    this.procesarError();
  }

  crearFormulario() {
    this.formGroup = this.fb.group({
      nombre: ["", [Validators.required]],
      descripcion: ["", []],
      estado: ["", [Validators.required]],
    });
  }

  llenarDatosFormulario(data: any) {
    this.local = data.local;
    this.crearFormulario();

    this.formGroup.controls['nombre'].setValue(data.nombre);
    this.formGroup.controls['descripcion'].setValue(data.descripcion);
    this.formGroup.controls['estado'].setValue(data.estado);
    
    this.cdr.detectChanges();
  }
  
  cerrarModal(status: boolean) {
    this.id = null;
    this.modalRef.destroy({ data: status });
  }

  procesarError() {
    this.errorService.getError().subscribe(e => {
      if(e) {
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
      this.categoriaService.modificarCategoria({
        id: this.id,
        nombre: this.formGroup.controls['nombre'].value,
        descripcion: this.formGroup.controls['descripcion'].value,
        estado: this.formGroup.controls['estado'].value,
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
      this.categoriaService.adicionarCategoria({
        id: this.id,
        nombre: this.formGroup.controls['nombre'].value,
        descripcion: this.formGroup.controls['descripcion'].value,
        estado: this.formGroup.controls['estado'].value,
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

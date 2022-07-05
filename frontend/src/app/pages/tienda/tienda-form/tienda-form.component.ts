import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { TiendaService } from '../tienda.service';

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
  selector: 'app-tienda-form',
  templateUrl: './tienda-form.component.html',
  styleUrls: ['./tienda-form.component.scss']
})
export class TiendaFormComponent implements OnInit{
  @Input() id!: any;
  @Input() permisosEntrada: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  perfiles: any[] = [];
  title = "Adicionar Tienda";
  local = true;

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private tiendaService: TiendaService, private fb: FormBuilder, 
    private errorService: ErrorService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.id) {
      this.title = 'Editar Tienda'
      this.cargarDatos(this.id);
    } else {
      this.title = 'Adicionar Tienda'
      this.permisos = this.permisosEntrada;
    }
    this.cdr.detectChanges();

  }

  cargarDatos(id: number) {
    this.lodading = true;
    this.tiendaService.cargarDatos(id).subscribe(data => {

      if (data.success) {
        this.llenarDatosFormulario(data.tienda);
      } else {
        this.messageService.error('Ha ocurrido un error inesperado');
      }
      this.lodading = false;
    })
    this.procesarError();
  }

  crearFormulario() {
    if(!this.local) {
    this.formGroup = this.fb.group({
      nombre: [{value: "", disabled: true}, [Validators.required]],
    });
  }else {
    this.formGroup = this.fb.group({
      nombre: ["", [Validators.required]],
    });
  }
  }

  llenarDatosFormulario(data: any) {
    this.local = data.local;
    this.crearFormulario();

    this.formGroup.controls['nombre'].setValue(data.nombre);
    
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
      this.tiendaService.modificarTienda({
        id: this.id,
        nombre: this.formGroup.controls['nombre'].value,
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
      this.tiendaService.adicionarTienda({
        id: this.id,
        nombre: this.formGroup.controls['nombre'].value,
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

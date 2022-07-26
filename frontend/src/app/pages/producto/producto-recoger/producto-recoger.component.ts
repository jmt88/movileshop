import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { ProductoService } from '../producto.service';

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
  selector: 'app-producto-recoger',
  templateUrl: './producto-recoger.component.html',
  styleUrls: ['./producto-recoger.component.scss']
})
export class ProductoRecogerComponent implements OnInit{
  @Input() id!: any;
  @Input() permisosEntrada: any[] = [];
  @Input() tiendas: any[] = [];
  @Input() producto: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  title = "Recoger Producto";
  local = true;

  login_user: any;

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private productoService: ProductoService, private fb: FormBuilder, private authService: AuthService,
    private errorService: ErrorService, private cdr: ChangeDetectorRef) 
    { 
      this.login_user = this.authService.getSessionUser();
    }

  ngOnInit(): void {
    this.crearFormulario(this.producto);
  }


  crearFormulario(producto_id: any) {
    this.formGroup = this.fb.group({
      producto: [producto_id],
      tienda: ["", [Validators.required]],
      cantidad: ["", [Validators.required]],
    });
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
      this.salvar()
  }

  salvar() {
    this.validarForm();
    if (this.formGroup.valid) {
      this.lodading = true;
      this.productoService.recogerProducto({
        id: this.id,
        producto: this.formGroup.controls['producto'].value,
        tienda: this.formGroup.controls['tienda'].value,
        cantidad: this.formGroup.controls['cantidad'].value,
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

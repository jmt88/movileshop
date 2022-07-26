import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { InventarioService } from '../inventario.service';

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
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.scss']
})
export class InventarioFormComponent implements OnInit{
  @Input() id!: any;
  @Input() precio_venta!: any;
  @Input() existencia!: any;
  @Input() permisosEntrada: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  perfiles: any[] = [];
  title = "Adicionar Inventario";
  local = true;

  formatterDollar = (value: number): string => `$ ${value}`;
  parserDollar = (value: string): string => value.replace('$ ', '');

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private inventarioService: InventarioService, private fb: FormBuilder, 
    private errorService: ErrorService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.crearFormulario();

      this.title = 'Ventas de la tienda'
      this.cargarDatos(this.id);

      this.cdr.detectChanges();
  }

  cargarDatos(id: number) {
    this.llenarDatosFormulario(id);
  }

  crearFormulario() {
    this.formGroup = this.fb.group({
      producto_id: [''],
      cantidad: [0, [Validators.required]],
      valor_total: [0],
    });
  }

  llenarDatosFormulario(id: number) {
    this.crearFormulario();

    this.formGroup.controls['producto_id'].setValue(id);
    
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

  salvarVenta() {
    this.venta(this.id)
  }

  venta(id: number) {
    this.validarForm();
    if(this.formGroup.controls['cantidad'].value > this.existencia) {
      this.messageService.error('La cantidad a vender excede la existencia del inventario');
      this.formGroup.controls['cantidad'].setValue(0);
      return;
    }
    if (this.formGroup.valid) {
      this.lodading = true;
      this.inventarioService.ventaInventario({
        producto_id: this.formGroup.controls['producto_id'].value,
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

  calcularMonto() {
    var cantidad = this.formGroup.controls['cantidad'].value;
    this.formGroup.controls['valor_total'].setValue(this.precio_venta * cantidad);
  }
}

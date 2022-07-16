import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/_core/_auth/auth.service';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { UsuarioService } from '../../usuario/usuario.service';
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
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit{
  @Input() id!: any;
  @Input() permisosEntrada: any[] = [];
  @Input() categorias: any[] = [];

  lodading = false;
  formGroup!: FormGroup;
  permisos: any[] = [];
  title = "Adicionar Producto";
  local = true;

  login_user: any;

  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');
  formatterDollar = (value: number): string => `$ ${value}`;
  parserDollar = (value: string): string => value.replace('$ ', '');

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private productoService: ProductoService, private fb: FormBuilder, private authService: AuthService,
    private errorService: ErrorService, private cdr: ChangeDetectorRef) 
    { 
      this.login_user = this.authService.getSessionUser();
    }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.id) {
      this.title = 'Editar Producto'
      this.cargarDatos(this.id);
    } else {
      this.title = 'Adicionar Producto'
      this.permisos = this.permisosEntrada;
    }
    this.cdr.detectChanges();
  }

  cargarDatos(id: number) {
    this.lodading = true;
    this.productoService.cargarDatos(id).subscribe(data => {

      if (data.success) {
        this.llenarDatosFormulario(data.producto);
      } else {
        this.messageService.error('Ha ocurrido un error inesperado');
      }
      this.lodading = false;
    })
    this.procesarError();
  }

  crearFormulario() {
    this.formGroup = this.fb.group({
      codigo: ["", [Validators.required]],
      nombre: ["", [Validators.required]],
      descripcion: ["", []],
      precio_venta: ["", [Validators.required]],
      precio_compra: ["", [Validators.required]],
      categoria: ["", [Validators.required]],
      cantidad: ["", [Validators.required]],
      existencia: ["", [Validators.required]],
      estado: ["", [Validators.required]],
    });
  }

  llenarDatosFormulario(data: any) {
    this.local = data.local;
    this.crearFormulario();

    this.formGroup.controls['codigo'].setValue(data.codigo);
    this.formGroup.controls['nombre'].setValue(data.nombre);
    this.formGroup.controls['descripcion'].setValue(data.descripcion);
    this.formGroup.controls['precio_venta'].setValue(data.precio_venta);
    this.formGroup.controls['precio_compra'].setValue(data.precio_compra);
    this.formGroup.controls['categoria'].setValue(data.categoria);
    this.formGroup.controls['cantidad'].setValue(data.cantidad);
    this.formGroup.controls['existencia'].setValue(data.existencia);
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
      this.productoService.modificarProducto({
        id: this.id,
        codigo: this.formGroup.controls['codigo'].value,
        nombre: this.formGroup.controls['nombre'].value,
        descripcion: this.formGroup.controls['descripcion'].value,
        precio_venta: this.formGroup.controls['precio_venta'].value,
        precio_compra: this.formGroup.controls['precio_compra'].value,
        categoria: this.formGroup.controls['categoria'].value,
        cantidad: this.formGroup.controls['cantidad'].value,
        existencia: this.formGroup.controls['existencia'].value,
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
      this.productoService.adicionarProducto({
        id: this.id,
        codigo: this.formGroup.controls['codigo'].value,
        nombre: this.formGroup.controls['nombre'].value,
        descripcion: this.formGroup.controls['descripcion'].value,
        precio_venta: this.formGroup.controls['precio_venta'].value,
        precio_compra: this.formGroup.controls['precio_compra'].value,
        categoria: this.formGroup.controls['categoria'].value,
        cantidad: this.formGroup.controls['cantidad'].value,
        existencia: this.formGroup.controls['existencia'].value,
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

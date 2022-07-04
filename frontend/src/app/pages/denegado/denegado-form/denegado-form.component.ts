import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';
import { DenegadoService } from '../denegado.service';


@Component({
  selector: 'app-denegado-form',
  templateUrl: './denegado-form.component.html',
  styleUrls: ['./denegado-form.component.scss']
})
export class DenegadoFormComponent implements OnInit{
  @Input() id!: any;

  lodading = false;
  formGroup!: FormGroup;
  title = "Adicionar Sitio Denegado";
  local = true;

  constructor(private modalRef: NzModalRef, private messageService: NzMessageService, 
    private denegadoService: DenegadoService, private fb: FormBuilder, 
    private errorService: ErrorService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.crearFormulario();
    if (this.id) {
      this.title = 'Editar Sitio Denegado'
      this.cargarDatos(this.id);
    } else {
      this.title = 'Adicionar Denegado'
    }
    this.cdr.detectChanges();

  }

  cargarDatos(id: number) {
    this.lodading = true;
    this.denegadoService.cargarDatos(id).subscribe(data => {
     
      if (data.success) {
        this.llenarDatosFormulario(data.denegados);
      } else {
        this.messageService.error('Ha ocurrido un error inesperado');
      }
      this.lodading = false;
    })
    this.procesarError();
  }

  crearFormulario() {
    this.formGroup = this.fb.group({
      sitio: [null, [Validators.required]],
    });
  }

  llenarDatosFormulario(data: any) {
    this.formGroup.controls['sitio'].setValue(data.sitio);
    this.local = data.local;
    this.cdr.detectChanges();
  }
  
  cerrarModal(status: boolean) {
    this.id = null;
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
      this.denegadoService.modificarDenegado({
        id: this.id,
        sitio: this.formGroup.controls['sitio'].value,
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
      this.denegadoService.adicionarDenegado({
        id: this.id,
        sitio: this.formGroup.controls['sitio'].value,
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
}

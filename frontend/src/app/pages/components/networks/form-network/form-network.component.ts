import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NetworkService } from 'src/app/pages/network/network.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorService } from 'src/app/_core/_interceptors/error.service';

export function ipValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    
    if(regex.test(value)){
      return null
    }
    return {ipInvalid:true};
  } 
}
@Component({
  selector: 'app-form-network',
  templateUrl: './form-network.component.html',
  styleUrls: ['./form-network.component.scss']
})
export class FormNetworkComponent implements OnInit {
  @Input() data!: any;
  @Input() local!: boolean;

  title = 'Adicionar Host'
  formGroup!:FormGroup;
  lodading = false;
  constructor(private modalRef: NzModalRef, private errorService:ErrorService, private fb: FormBuilder, private networkService: NetworkService, private messageService: NzMessageService) { }

  ngOnInit(): void {
    if(this.data &&(this.data.id != "" || this.data.posicion != "") ) {
      this.title = 'Editar Host';
    }
    this.crearForm(this.data);
  }

  crearForm(data:any) {
    if(data) {
      this.formGroup = this.fb.group({
        host: [data.host, [Validators.required, ipValidator()]],
        internet: [data.internet, []]
      });
    }else {
      this.formGroup = this.fb.group({
        host: ['', [Validators.required, ipValidator()]],
        internet: [false, []]
      });
    }
  }
  
  salvarFormulario() {
    let data = {
      id: "",
      host: "",
      internet: "",
      posicion: ""
    }
    this.validarFormulario();
    if(this.formGroup.valid) {
      data.host =this.formGroup.controls['host'].value;
      data.internet = this.formGroup.controls['internet'].value;
    
    if(this.local) {
      if(this.data) {
        data.posicion = this.data.posicion;
      }
      this.cerrarModal(data);
    }else {
      if(this.data && this.data.id) {
        console.log('entra')
        data.id = this.data.id;
      }

        this.salvarForm(data);
    }
  }
  }
  validarFormulario() {
    for (const i in this.formGroup.controls) {
      this.formGroup.controls[i].markAsDirty();
      this.formGroup.controls[i].updateValueAndValidity();
    }
  }

  cerrarModal(data?:any) {
    this.modalRef.destroy({data: data});
  }

  salvarForm(data:any) {
    this.lodading = true;
    if(data.id == "") {
      this.networkService.salvarNetwork(data.host, data.internet).subscribe(data=> {
        this.lodading = false;
        if(data.success) {
          this.modalRef.destroy({data: true});
        }else{
          this.messageService.error(data.message);
        }
      });
    }else {
      this.networkService.editarNetwork(data.id, data.host, data.internet).subscribe(data=> {
        this.lodading = false;
        if(data.success) {
          this.modalRef.destroy({data: true});
        }else{
          this.messageService.error(data.message);
        }
      });
    } 
    this.procesarError();
  }
  procesarError() {
    this.errorService.getError().subscribe(e => {
       if(e) {
         this.lodading = !e;
       }
     });
   }
}

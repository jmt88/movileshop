import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit, AfterViewInit {
  @Input() permisosEntradaPerfil: any [] = [] ;
  @Output() onChangePermisos = new EventEmitter<any[]>();

  permisos: any[] = [];
  checkAll = new Set<number>();
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit(): void {
    this.permisos = this.permisosEntradaPerfil; 
  }
  changePermisos() {
    this.onChangePermisos.emit(this.permisos);
  }

  onCheckAll(posicion:number, checked: boolean) {
    if(checked) {
      this.checkAll.add(posicion);
    }else {
      this.checkAll.delete(posicion);
    }
    this.onCheckedAll(posicion);
    this.onChangePermisos.emit(this.permisos);
  }
  onCheckedAll(posicion:number) {
    if(this.checkAll.has(posicion)) {
      this.permisos[posicion].ver = true;
      this.permisos[posicion].crear = true;
      this.permisos[posicion].modificar = true;
      this.permisos[posicion].eliminar = true;
    } 
    else{
      this.permisos[posicion].ver = false;
      this.permisos[posicion].crear = false;
      this.permisos[posicion].modificar = false;
      this.permisos[posicion].eliminar = false;
    }

    this.cdr.detectChanges();
  }

  onCheck() {
    this.onChangePermisos.emit(this.permisos);
  }

}

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-importacion-usuarios',
  templateUrl: './importacion-usuarios.component.html',
  styleUrls: ['./importacion-usuarios.component.scss'],
})
export class ImportacionUsuariosComponent implements OnInit {
  @Input() usuariosEntrada: any[] = [];
  @Input() importedUsers: any[] = [];
  @Output() onIportedUsers = new EventEmitter<any[]>();
  
  @ViewChild('table', { static: false }) nzTableComponent?: NzTableComponent<any>;

  loading = false;

  setOfCheckedId = new Set<string>();
  checked = false;
  indeterminate = false;
  search: string = '';
  searchResultado: string = '';
  listaAuxiliar: any[] = [];
  listaResultado: any[] = [];
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.listaAuxiliar = this.usuariosEntrada;
    this.listaResultado = this.importedUsers;
    if(this.importedUsers != undefined && this.importedUsers.length >0) {
    this.importedUsers.forEach(data => {
      this.updateCheckedSet(data.username, true);
    });
  }
  }

  buscar() {
    this.listaAuxiliar = this.usuariosEntrada;

    this.listaAuxiliar = this.listaAuxiliar.filter(
      (item: any) => item.nombre.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
    );

    this.cdr.detectChanges();
  }
  
  buscarResultado() {
    this.procesarCambio();

    this.listaResultado = this.listaResultado.filter(
      (item: any) => item.nombre.toLowerCase().indexOf(this.searchResultado.toLowerCase()) !== -1
    );

    this.cdr.detectChanges();
  }
  
  updateCheckedSet(username: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(username);
    } else {
      this.setOfCheckedId.delete(username);
    }
    this.procesarCambio();
  }

  refreshCheckedStatus(): void {
    this.indeterminate =
      this.usuariosEntrada.some(({ username }) => this.setOfCheckedId.has(username)) &&
      !this.checked;
  }

  onItemChecked(username: string, checked: boolean): void {
    this.updateCheckedSet(username, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.usuariosEntrada
      .forEach(({ username }) => this.updateCheckedSet(username, checked));
    this.refreshCheckedStatus();
  }

  procesarCambio() {
    let aux: any[] = this.listaAuxiliar.filter(data=> this.setOfCheckedId.has(data.username));
    this.listaResultado = aux;
    this.cdr.detectChanges();
    this.onIportedUsers.emit(this.listaResultado);
  }

  deleteSelectedUser(username: string){
    this.updateCheckedSet(username, false);
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { InspeccionService } from '../inspeccion.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  historial: any = [];
  searchKey: any[] = [];

  isLoading = false;

  page = 1;
  pageSize = 10;
  lastPage = 1;
  total = 0;
  orderKey = 'fecha';
  orderValue = 'desc';

  fecha!: any;
  hora!: any;
  ip!: any;
  sitio!: any;
  duracion!: any;
  username!: any;
  consumo!: any;
  consumoTotal = 0;

  fechaInicialFiltro!: any;
  fechaFinFiltro!: any;

  filtro = {
    fechainicial: "",
    fechafin: ""
  }

  constructor(private reporteService: InspeccionService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }


  listarReporte() {
    this.isLoading = true;
    this.reporteService.reporteGeneral(this.page, this.pageSize, this.orderKey, this.orderValue, this.searchKey, this.filtro).subscribe(data=>{
      this.isLoading = false;
      if(data.success) {
        this.historial = data.historial;
        this.total = data.pagination.total;
        this.page = data.pagination.page;
        this.pageSize = data.pagination.pageSize;
        this.consumoTotal = data.consumo_total;
      }
    })
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    this.pageSize = pageSize;
    this.page = pageIndex;

    let find = true;
    sort.forEach((element) => {
      if (element.value) {
        find = false;
        this.orderKey = element.key;
        element.value === 'ascend'
          ? (this.orderValue = 'asc')
          : (this.orderValue = 'desc');
      }
    });
    if (find) {
      this.orderKey = 'fecha';
      this.orderValue = 'desc';
    }
    this.listarReporte();
  }

  buscar(value: any) {
    this.searchKey = [];
    if (this.fecha != "") {
      this.searchKey.push(
        {
          key: 'fecha',
          value: this.fecha
        },
      );
    }
    if (this.ip != "") {
      this.searchKey.push(
        {
          key: 'ip',
          value: this.ip
        },
      );
    }

    if (this.sitio != "") {
      this.searchKey.push(
        {
          key: 'sitio',
          value: this.sitio
        },
      );
    }
    if (this.username != "") {
      this.searchKey.push(
        {
          key: 'username',
          value: this.username
        },
      );
    }
    this.listarReporte()
  }

  filtrar() {
    this.listarReporte();
  }
}

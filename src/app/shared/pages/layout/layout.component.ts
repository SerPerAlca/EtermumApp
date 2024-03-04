import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ComunicacionDadoService } from '../../services/comunicacion-dado.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor( private comunicacionDadoServ : ComunicacionDadoService
    ) { }

  ngOnInit() {



  }

  ngAfterViewInit(): void {
    this.comunicacionDadoServ.abrirSidenav$.subscribe(() => {
      this.togglePanelLateral();
    });
  }

  togglePanelLateral() {
      if (this.sidenav) {
        console.log('Abriendo panel lateral');
        this.sidenav.toggle();
      } else {
        console.log('sidenav', this.sidenav);
        console.log('No se puede abrir el panel lateral. sidenav o cubeElement es nulo.');
      }
    }

}

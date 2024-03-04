import { Component, HostListener, OnInit } from '@angular/core';
import { UbicacionesService } from './ubicaciones/services/ubicaciones.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Eternum';

  constructor(private ubicacionesServ: UbicacionesService) {}

  ngOnInit(): void {
    // Iniciar sesión al inicio de la aplicación
    // this.ubicacionesServ.iniciarSesion().subscribe();
  }

   // Llama a cerrarSesion antes de cerrar la aplicación
   @HostListener('window:beforeunload', ['$event'])
   beforeUnloadHandler(event: any): void {
    alert("cerrando Angular")
     this.ubicacionesServ.cerrarSesion();
   }

}

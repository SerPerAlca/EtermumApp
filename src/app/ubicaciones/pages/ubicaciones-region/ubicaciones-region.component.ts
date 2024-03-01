import { Component } from '@angular/core';

@Component({
  selector: 'app-ubicaciones-region',
  templateUrl: './ubicaciones-region.component.html',
  styleUrl: './ubicaciones-region.component.css'
})
export class UbicacionesRegionComponent {

  public imagenMapa : string ='assets/images/itineracion/taberna_boton.png'
  public imagenFlechas : string='assets/images/itineracion/taberna_boton.png'
  ubicacionActual = 'Texto dinámico';


  onClick(direction: string) {
    // Puedes manejar la lógica aquí, por ejemplo, cambiar el texto dinámico
    this.ubicacionActual = `Se hizo clic en la flecha ${direction}`;
  }

}

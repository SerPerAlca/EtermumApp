import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-ubicaciones-region',
  templateUrl: './ubicaciones-region.component.html',
  styleUrl: './ubicaciones-region.component.css'
})
export class UbicacionesRegionComponent {

  public imagenMapa : string ='assets/images/itineracion/taberna_boton.png'
  public imagenFlechas : string='assets/images/itineracion/taberna_boton.png'
  ubicacionActual = 'Texto dinámico';
  // Coordenadas de la región de interés
  regionX1: number = 989;
  regionY1: number = 480;
  regionX2: number = 1032;  // Coordenada X de la esquina inferior derecha
  regionY2: number = 517;  // Coordenada Y de la esquina inferior derecha


  onClick(direction: string) {
    // Puedes manejar la lógica aquí, por ejemplo, cambiar el texto dinámico
    this.ubicacionActual = `Se hizo clic en la flecha ${direction}`;
  }


  




  onImageClick(event: MouseEvent) {
    const imageElement = event.currentTarget as HTMLImageElement;

    // Coordenadas del clic en relación con las dimensiones actuales de la imagen
    const offsetX = event.clientX - imageElement.offsetLeft;
    const offsetY = event.clientY - imageElement.offsetTop;

    console.log("Coordenadas del click. X: ", offsetX, " Y: ", offsetY)

    // Verificar si el clic está dentro de la región de interés
    if (offsetX >= this.regionX1 && offsetX <= this.regionX2 &&
        offsetY >= this.regionY1 && offsetY <= this.regionY2) {
      console.log('Clic dentro de la región de interés!');
    } else {
      console.log('Clic fuera de la región de interés.');
    }
  }

}





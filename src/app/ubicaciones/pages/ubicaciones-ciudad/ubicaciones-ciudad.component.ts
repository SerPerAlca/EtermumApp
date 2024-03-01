import { Component, OnInit } from '@angular/core';
import { Tile } from '../../interfaces/tile-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { LugarLocal, UbicacionLocal } from '../../interfaces/itineracion-interface';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../../shared/services/shared-data.service';

@Component({
  selector: 'ubicaciones-ubicaciones-ciudad',
  templateUrl: './ubicaciones-ciudad.component.html',
  styleUrl: './ubicaciones-ciudad.component.css'
})
export class UbicacionesCiudadComponent implements OnInit {
  ubicacionId: number | undefined;
  ubicacion: UbicacionLocal | undefined;
  tiles: Tile[] = [];


  constructor(
    private route: ActivatedRoute,
    private ubicacionesService: UbicacionesService,
    private router: Router,
    private sharedDataService : SharedDataService,
  ) { }
  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.ubicacionId = +params['id']; // Convierte el parámetro a número
        if (!this.ubicacionId) {
          console.error('ID de ubicación no válido');
          this.router.navigate(['../']); // Redirige a la ruta anterior si el ID no es válido
          return [];
        }
        return this.ubicacionesService.obtenerUbicaciones();
      })
    ).subscribe(
      ubicaciones => {
        if (ubicaciones && ubicaciones.length > 0) {
          console.log('this.ubicacionId', this.ubicacionId);
          // Si la respuesta es un objeto, envuélvelo en un array
          const ubicacionesArray = Array.isArray(ubicaciones) ? ubicaciones : [ubicaciones];
          const ubicacion = ubicacionesArray.find(u => u.id == this.ubicacionId);
          // console.log('Tipo de this.ubicacionId:', typeof this.ubicacionId);
          // console.log('Tipo de ubicacionesArray[0].id:', typeof ubicacionesArray[0].id);
          if (ubicacion) {
            this.ubicacion = ubicacion;
            this.tiles = this.mapLugaresToTiles(ubicacion.lugares);
          } else {
            // Si no se encuentra la ubicación, redirige a la ruta anterior
            this.router.navigate(['../']);
          }
        }
      },
      error => {
        console.error('Error al obtener la ubicación:', error);
      }
    );
  }

// Método para manejar el clic en el botón
entrarLugarButton(tile: Tile): void {
  if (tile.historia !== undefined && this.ubicacion && this.ubicacion.id) {
    const idLugar = tile.id_lugar;

    this.ubicacionesService.actualizarHistoria(this.ubicacion.id, idLugar).subscribe(
      response => {
        if (response !== null) {
          console.log('Respuesta del servidor:', response);

          // Se comprueba si se pasó ya por esa ubicación
          if (response.valorAnterior === false) {

            // Lógica cuando el valor anterior ya era false
            alert("Ya has estado aquí");switchMap

          } else {

            // TODO controlar y enrutar entre escenas principales o de misiones secundarias
            if (tile.pathEscena) {
              // Si existe pathEscena, establecerlo en el servicio
              this.sharedDataService.setPathEscena(tile.pathEscena);
              // Volvemos a la historia
              this.router.navigate(['/layout']);
            }

          }
        } else {
          console.error('Error al actualizar historia:', response);
        }
      },
      error => {
        console.error('Error al actualizar historia:', error);
      }
    );
  }
}

  getBackgroundImageStyle(tile: Tile): string {
    return tile.imageUrl ? `url(${tile.imageUrl})` : '';
  }

  // Función de seguimiento para ngFor
  indexTile(index: number, tile: Tile): string {
    return tile.text;
  }


  // Construimos las tiles para mostrar en la vista
  private mapLugaresToTiles(lugares: LugarLocal[]): Tile[] {
    return lugares.map(lugar => ({
      id_lugar: lugar.id_lugar,
      text: lugar.label,
      cols: 2,
      rows: 3,
      color: 'black',
      imageUrl: lugar.urlImagen,
      historia: lugar.historia,
      pathEscena : lugar.pathEscena
    }));
  }


}



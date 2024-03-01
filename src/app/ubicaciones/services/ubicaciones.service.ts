import { Injectable } from '@angular/core';
import { Ciudad } from '../interfaces/itineracion-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  public ciudadesJSONUrl = 'http://localhost:3000/ciudades'
  private ubicacionesOriginal: Ciudad[] | undefined;
  private ubicacionesActual: Ciudad[] | undefined;

  constructor(
    private http: HttpClient
  ) { }

  // Obtener los datos originales y hacer una copia del json de ubicaciones
  iniciarSesion(): Observable<any[]> {
    return this.http.get<any[]>(this.ciudadesJSONUrl)
      .pipe(
        tap(ubicaciones => {
          this.ubicacionesOriginal = ubicaciones;
          this.ubicacionesActual = [...ubicaciones];
        })
      );
  }

  obtenerUbicaciones(): Observable<any[]> {
    return this.ubicacionesActual ? of(this.ubicacionesActual) : this.http.get<any[]>(this.ciudadesJSONUrl);
  }

  // Restaurar al estado original del json de ubicaciones
  cerrarSesion(): void {
    if (this.ubicacionesOriginal) {
      this.ubicacionesActual = [...this.ubicacionesOriginal];
    }
  }

  obtenerUbicacionCiudad(id: number): Observable<Ciudad | undefined> {
    return this.http.get<Ciudad>(this.ciudadesJSONUrl)
      .pipe(
        map(ciudad => {
          console.log('Ubicación del servidor:', ciudad);
          if (ciudad) {
            // Encuentra la ubicación por ID
            const ubicacion = ciudad.id === id ? ciudad : undefined;
            return ubicacion;
          } else {
            console.error('La respuesta no contiene una ubicación:', ciudad);
            return undefined;
          }
        })
      );
  }

  // Actualizamos la propiedad historia de los lugares, para saber si se ha pasado o no por ese lugar en la historia.
  actualizarHistoria(idUbicacion: number, idLugar: number): Observable<any> {
    const url = `${this.ciudadesJSONUrl}/${idUbicacion}`;

    return this.http.get<Ciudad>(url).pipe(
      switchMap(ciudad => {
        const ubicacion = ciudad.id === idUbicacion ? ciudad : undefined;
        if (ubicacion) {
          const lugar = ubicacion.lugares.find(l => l.id_lugar === idLugar);
          if (lugar) {
            const valorAnterior = lugar.historia; // Guardar el valor anterior
            lugar.historia = false; // Puedes cambiar esto según tus necesidades
            return this.http.put(url, ubicacion).pipe(
              map(response => ({ nuevoValor: lugar.historia, valorAnterior: valorAnterior }))
            );
          }
        }
        return of(null); // Devolver null si no se encuentra la ubicación o el lugar
      })
    );
  }

}

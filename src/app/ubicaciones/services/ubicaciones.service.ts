import { Injectable } from '@angular/core';
import { Ciudad, Region, UbicacionRegional } from '../interfaces/itineracion-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  public ciudadesJSONUrl = 'http://localhost:3000/ciudades'
  public regionJSONpath = 'assets/jsons/itineracion/itineracion.json';
  private ubicacionesOriginal: Ciudad[] | undefined;
  private ubicacionesActual: Ciudad[] | undefined;
  private idRegionActual: number = 1;


  constructor(
    private http: HttpClient
  ) { }

  getRegionActual(): number {
    return this.idRegionActual;
  }

  private getUbicacionById(idUbicacionRegional: number, region : Region): UbicacionRegional | null {
    return region.ubicaciones.find(item => item.id === idUbicacionRegional);
  }

  obtenerDatosDestino(idRegion: number, idUbicacion: number, direccion: string): Observable<any> {
    return this.http.get<any[]>(this.regionJSONpath)
      .pipe(
        map(data => this.procesarJson(idRegion, idUbicacion, direccion, data))
      );
  }

  private procesarJson(idRegion: number, idUbicacion: number, direccion: string, data: any[]): any {
    const region = data.find(item => item.id_region === idRegion);

    if (region) {
      const ubicacionActual: UbicacionRegional = region.ubicaciones.find(item => item.id === idUbicacion);

      if (ubicacionActual) {
        const idDireccion = 'id_' + direccion;
        const distanceDireccion = 'distance_' + direccion;

        if (ubicacionActual[idDireccion] !== null) {
          const id = ubicacionActual[idDireccion];
          const distancia = ubicacionActual[distanceDireccion];
          const ubicacionDestino = this.getUbicacionById(id, region );
          const nombre = ubicacionDestino.nombre;
          const codCiudad = ubicacionDestino.codigo_ciudad !== undefined ? ubicacionDestino.codigo_ciudad : null;
          const descansar = ubicacionDestino.descansar !== undefined ? ubicacionDestino.descansar : null;

          return {
            id: id,
            distancia: distancia,
            nombre: nombre,
            codCiudad: codCiudad,
            descansar : descansar,
          };

        }
      }
    }

    return null;

  }


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

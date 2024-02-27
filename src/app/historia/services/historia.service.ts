import { Injectable } from '@angular/core';
import yaml from 'js-yaml';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, throwError } from 'rxjs';
import { Escena } from '../interfaces/escena.interface';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {

  private historia: any;
  private escenaActual: any;
  private escenaActualSubject: BehaviorSubject<Escena> = new BehaviorSubject<Escena>(null);

  // PATHS
  private urlJsons: string = 'assets/jsons/textos/acto1/capitulo1/';
  private urlImagenes : string = 'assets/images/';

  constructor(private http: HttpClient) { }

  cargarHistoria(rutaArchivo: string, escena: string): Observable<any> {
    // { responseType: 'text' } permite detectar el archivo Yaml como .yml y no como JSON
    return this.http.get(rutaArchivo, { responseType: 'text' }).pipe(
      map((data: any) => {
        try {
          this.historia = yaml.load(data);
          if (!this.historia) {
            throw new Error('Contenido YAML no válido.');
          }
          this.irAEscena(escena);
          return this.historia;
        } catch (error) {
          console.log('Error al cargar fichero YAML', error);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error al cargar el archivo:', error);
        return throwError('No se pudo cargar el archivo YAML.');
      })
    );
  }


  irAEscena(nombreEscena: string): void {
    this.escenaActual = this.obtenerEscena(nombreEscena);
  }

  /* Ej: escena: {
      "texto": "texto_1_1_1.json",
      "audio": "audio_1_1_1_.mp3",
      "imagen": "imagen_1_1_1.png",
      "salida": "escena1_1_2"
    } */
  private obtenerEscena(nombreEscena: string): any {
    const partes = nombreEscena.split('.');
    let escena = this.historia;

    partes.forEach(part => {
      escena = escena[part];
    });

    this.escenaActualSubject.next(escena);
    return escena;
  }

  getEscena$(){
    return this.escenaActualSubject.asObservable();
  }

  obtenerOpcionesEscena(): any {
    return this.escenaActual.opciones;
  }

  avanzarHistoria(): void {
    const salida = this.escenaActual.salida;
    this.irAEscena(salida);
  }

  obtenerTextos(nombreJson: string): Observable<any[]> {
    return (this.http.get<string[]>(this.urlJsons + nombreJson));
  }




}

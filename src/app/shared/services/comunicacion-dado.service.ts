import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionDadoService {

  private resultadoSubject = new Subject<number>();


  private abrirSidenavSource = new Subject<void>();
  abrirSidenav$ = this.abrirSidenavSource.asObservable();

  constructor() { }

  abrirSidenav() {
    this.abrirSidenavSource.next();
  }

  // Función para enviar el resultado del dado a otros componentes
  enviarResultado(resultado: number) {
    this.resultadoSubject.next(resultado);
  }

  // Función que se suscribe y obtiene el valor del dado
  obtenerResultado$() {
    return this.resultadoSubject.asObservable();
  }





}

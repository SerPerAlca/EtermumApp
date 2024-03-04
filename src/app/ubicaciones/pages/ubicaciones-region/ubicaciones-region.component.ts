import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { UbicacionesService } from '../../services/ubicaciones.service';
import { ComunicacionDadoService } from '../../../shared/services/comunicacion-dado.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialog } from '@angular/material/dialog';
import { DialogEntrarRegionalComponent } from '../../components/dialog-entrar-regional/dialog-entrar-regional.component';
import { DialogDescansarRegionalComponent } from '../../components/dialog-descansar-regional/dialog-descansar-regional.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicaciones-region',
  templateUrl: './ubicaciones-region.component.html',
  styleUrl: './ubicaciones-region.component.css'
})
export class UbicacionesRegionComponent implements OnInit{

  public imagenMapa : string ='assets/images/itineracion/taberna_boton.png'
  public imagenFlechas : string='assets/images/itineracion/taberna_boton.png'

  // Datos de la ubicacion actual / ubicacion destino:
  public ubicacionActual = 'Texto dinámico';
  public ubicacionDestino : string = null;
  public idRegion : number = 1;
  public idUbicacion : number = 1;
  public direccion : string = null;
  public distancia: number = null;
  public codigoCiudad : number = null;

  // Condicionantes de la Vista:
  public mostrarInfoDistancia : boolean = true;
  public descanso : boolean = false;
  public llegadoADestino : boolean = false;

  public resultadoDado? : number;



  private destroy$: Subject<void> = new Subject<void>();
  private comunicacionDadoSubscription$ : Subscription = new Subscription();

  constructor(
    private ubicacionesService: UbicacionesService,
    private comunicacionDadoService: ComunicacionDadoService,
    public dialog : MatDialog,
    private router: Router,
    ) { }


  ngOnInit(): void {
    this.ubicacionActual = 'Cielo Negro';
    // Resultado del dado
    this.comunicacionDadoSubscription$ = this.comunicacionDadoService.obtenerResultado$().pipe(
    takeUntil(this.destroy$)

  ).subscribe( resultado => {
    this.resultadoDado = resultado;
    this.calcularDistancia();
  })

  }

  ngOnDestroy() : void {

    this.destroy$.next();
    this.destroy$.complete();
  }


  onClick(direction: string) {
    this.obtenerDestino(this.idRegion, this.idUbicacion, direction);
    this.llegadoADestino = false;
  }

  // Abre o cierra el panel lateral del dado
  toogleDado() {
    // console.log('Intentando abrir dado...');
    this.resultadoDado = null;
    this.comunicacionDadoService.abrirSidenav();
  }


  obtenerDestino (idRegion : number, idUbicacion : number, direccion : string) {
    console.log("direccion: ", direccion, " idUbicacionActual: ", idUbicacion, " idRegion: ", idRegion );
      this.ubicacionesService.obtenerDatosDestino(idRegion, idUbicacion, direccion).pipe(
        takeUntil(this.destroy$)
      ).subscribe(result => {
      if (result) {

        console.log('Resultado llamada: ', result);

        this.ubicacionDestino = result.nombre;
        this.idUbicacion = result.id;
        this.distancia = result.distancia;
        this.codigoCiudad = result.codCiudad;
        this.mostrarInfoDistancia = true;
        this.descanso = result.descansar;

        if(this.distancia > 0){
          this.toogleDado();
        }

      } else {
        alert("No hay camino en esa dirección")
      }
    });
  }

  // Calcula la distancia para llegar al destino.
  calcularDistancia(){
    if( this.resultadoDado !== undefined){
      const recorrido = this.distancia - this.resultadoDado;
      if(recorrido > 0 ){
        this.distancia = recorrido;
      } else {
        this.llegadoADestino = true;
        alert("Has llegado a " + this.ubicacionDestino);
        this.ubicacionActual = this.ubicacionDestino;
        this.mostrarInfoDistancia = false;
        this.toogleDado();
      }
    }
  }

  openDialogEntrar(enterAnimationDuration: string, exitAnimationDuration: string): void {
    // Abre el diálogo y pasa las duraciones de animación
    console.log('open dialogo entrar')
    const dialogRef = this.dialog.open(DialogEntrarRegionalComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

     // Suscripción del diálogo
     dialogRef.afterClosed().subscribe(result => {
      if (result === 'Sí') {
        // Lógica para el caso 'Sí'
        console.log('viajando a ','/ciudad', this.codigoCiudad )
        this.router.navigate(['/ciudad', this.codigoCiudad]);
      } else {
        // Lógica para el caso 'No' o si se cierra el diálogo sin seleccionar nada
        console.log('Usuario seleccionó No o cerró el diálogo');
      }
    });
  }

  openDialogDescansar(enterAnimationDuration: string, exitAnimationDuration: string): void {
    // Abre el diálogo y pasa las duraciones de animación
    const dialogRef = this.dialog.open(DialogDescansarRegionalComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

     // Suscripción del diálogo
     dialogRef.afterClosed().subscribe(result => {
      if (result === 'Sí') {
        // Lógica para el caso 'Sí'
        console.log('Usuario seleccionó Sí');
      } else {
        // Lógica para el caso 'No' o si se cierra el diálogo sin seleccionar nada
        console.log('Usuario seleccionó No o cerró el diálogo');
      }
    });
  }



}





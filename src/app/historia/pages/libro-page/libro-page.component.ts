import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HistoriaService } from '../../services/historia.service';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { TextoItem, TextoRespuesta } from '../../interfaces/texto.interface';
import { Escena } from '../../interfaces/escena.interface';
import { ComunicacionDadoService } from '../../../shared/services/comunicacion-dado.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../shared/services/shared-data.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'historia-libro-page',
  templateUrl: './libro-page.component.html',
  styleUrls: ['./libro-page.css']
})
export class LibroPageComponent implements OnInit {

  // Suscripciones
  private historiaSubscription$: Subscription = new Subscription();
  private textosSubscription$: Subscription = new Subscription();
  private textosRespuestaSubscription$: Subscription = new Subscription();
  private sharedDataSubscription$: Subscription = new Subscription();
  private comunicacionDadoSubscription$ : Subscription = new Subscription();
  private destroy$: Subject<void> = new Subject<void>();

  // Paths:
  private pathEscena: string = 'acto1.capitulo1_1.escena1_1_1';
  private rutaArchivoYaml: string = 'assets/historia_principal.yml';
  public pathImagen: string = 'assets/images/acto1/capitulo1/';

  // Recursos:
  public texto: TextoItem[] = [];
  public textoRespuesta: TextoRespuesta[] = [];
  public imagen: string = '';
  public preguntas: { id: string, textoAccion: string }[] = [];
  private ficheroTexto: string = '';
  public ficheroImagen: string = '';

  // variables
  public opcionesDialogo: boolean = false;
  public opcionesBloqueadas: boolean = false;
  public respuestaObtenida : boolean = false;
  public idOpcion: string = '';
  public resultadoDado? : number;
  public opcionSeleccionada: number | null = null;

  // Estructurales
  private historia: any; // Almacena toda la historia cargada
  public escenaActual?: Escena;// Almacena la escena actual
  private capitulo: string = '';
  private acto: string = '';

  constructor(
    private historiaService: HistoriaService,
    private comunicacionDadoServ : ComunicacionDadoService,
    private router: Router,
    private sharedDataService : SharedDataService,
    ) { }

  ngOnInit(): void {

    // Recuperamos la escena siguiente si venimos de otra vista (itineracion, combate, etc)
    this.sharedDataSubscription$ = this.sharedDataService.getPathEscena$().pipe(
      takeUntil(this.destroy$)
    ).subscribe((pathEscena: string | null) => {
      if (pathEscena) {
        console.log('Nuevo valor de pathEscena:', pathEscena);
        this.pathEscena = pathEscena;
      }
    });

    // La primera vez que cargamos la historia
    this.cargarEscena(this.rutaArchivoYaml, this.pathEscena);

    // Resultado del dado
    this.comunicacionDadoSubscription$ = this.comunicacionDadoServ.obtenerResultado$().pipe(
      takeUntil(this.destroy$)
    ).subscribe( resultado => {
      this.resultadoDado = resultado;
    })

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  // Método que obtiene los recursos a partir del fichero yaml.
  cargarEscena(rutaArchivoYaml: string, pathEscena: string): void {
    this.historiaSubscription$ = this.historiaService.cargarHistoria(rutaArchivoYaml, pathEscena)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((historia) => {
          if (historia !== null) {
            this.obtenerValorDesdeRuta(this.pathEscena, historia);
            return this.historiaService.getEscena$();
          }
          // Si la historia es null retornamos observable vacío
          return [];
        }),
        tap(escena => {
          this.escenaActual = escena;
          if (this.escenaActual?.itineracion) {
            this.router.navigate(['/ciudad', this.escenaActual.itineracion]);
          }
          if (this.escenaActual?.texto !== undefined) this.ficheroTexto = this.escenaActual!.texto;

          if (this.escenaActual?.imagen !== undefined) this.ficheroImagen = `${this.pathImagen}${this.escenaActual?.imagen}`;

          if (this.escenaActual?.opciones !== undefined) this.opcionesDialogo = true;

          if (this.ficheroTexto !== null) this.cargarTextos(this.ficheroTexto);
        })
      )
      .subscribe();
  }

  cargarTextos(nombreFichero: string): void {

    this.textosSubscription$ = this.historiaService.obtenerTextos(nombreFichero).pipe(
      takeUntil(this.destroy$)
    ).subscribe(textos => {
      this.texto = textos
      console.log('Textos: ', this.texto);
    });
  }


  cargarTextoRespuesta(nombreFichero : string): void{
    this.textosRespuestaSubscription$ = this.historiaService.obtenerTextos(nombreFichero).subscribe(textosResp => {
      this.textoRespuesta = textosResp;
      this.respuestaObtenida = true;
    });
  }


  paginaSiguiente(): void {

    this.ficheroTexto = null;
    // Desbloqueamos las opciones de respuesta futuras (si fueron bloqueadas).
    if(this.opcionesBloqueadas) {
      this.opcionesBloqueadas = false;
      this.opcionSeleccionada = null;
    }

    // Sólo ocurre en el caso de que la escena no tenga opciones
    if (this.escenaActual?.salida) {

      let escenaSalida = this.escenaActual?.salida;
      this.pathEscena = this.buildArbolEscena(escenaSalida);

    }

    // Switchear las booleanas
    this.respuestaObtenida = false;
    this.opcionesDialogo = false;

    // Desubscribirse de los observables
    this.historiaSubscription$.unsubscribe();
    this.textosSubscription$.unsubscribe();
    this.textosRespuestaSubscription$.unsubscribe();

    this.cargarEscena(this.rutaArchivoYaml, this.pathEscena);

  }


  buildArbolEscena(escenaSalida: any): any {
    return `${this.acto}.${this.capitulo}.${escenaSalida}`;
  }


  obtenerValoresHistoria(propiedad: string): void {

    if (propiedad.startsWith('acto')) this.acto = propiedad;

    if (propiedad.startsWith('capitulo')) this.capitulo = propiedad;

  }


  obtenerValorDesdeRuta(ruta: string, historia: any): any {

    const propiedades = ruta.split('.');
    let arbolYaml = historia;

    for (const propiedad of propiedades) {

      if (arbolYaml && arbolYaml[propiedad] !== undefined) {
        arbolYaml = arbolYaml[propiedad];
        // Obtenemos los valores de capitulo y episodio
        this.obtenerValoresHistoria(propiedad);
      } else {
        // Manejar casos en los que la propiedad no exista
        throw Error('Propiedad del fichero Yaml no encontrada');
        break;
      }
    }
    /* Nos quedamos con el último nivel del yaml en la escena en curso. EJ:
      {
        "texto": "texto_1_1_1.json",
        "audio": "audio_1_1_1_.mp3",
        "imagen": "imagen_1_1_1.png",
        "salida": "escena1_1_2"
      } */
    return arbolYaml;
  }

  /**
   * Se declara el id number o undefined porque en la interfaz es   opcional este parametro
   */
  mostrarRespuesta(id: number | undefined, opcion: any) : void {

    let escenaSiguiente: Escena | undefined;

    if (this.escenaActual && this.escenaActual.opciones && id !== undefined) {

      const opcionSeleccionada = this.escenaActual.opciones[id];

      if (opcionSeleccionada) {
        this.cargarTextoRespuesta(opcionSeleccionada.texto);
        escenaSiguiente = { ...opcionSeleccionada };

      }
    }

    // TODO no se están inhabilitando correctamente las respuestas
    if (!opcion.opcional) {
      this.pathEscena = this.buildArbolEscena(escenaSiguiente?.salida);
      this.bloquearOpciones(id);
    }

  }

  // Lógica para bloquear las opciones de diálogo
  bloquearOpciones(id : number): void {
    // console.log('Opciones bloqueadas');
    this.opcionesBloqueadas = true;
    this.opcionSeleccionada = id;
  }

}


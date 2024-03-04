import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ComunicacionDadoService } from '../../services/comunicacion-dado.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'shared-dadoLateral',
  templateUrl: './dadoLateral.component.html',
  styleUrls: ['./dadoLateral.component.css']
})
export class DadoLateralComponent implements OnInit {

  public cubeElement?: HTMLElement;
  public resultado : number;
  public animacionTerminada = false;
  @ViewChild('diceCube') diceCube: ElementRef;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor(
              private element: ElementRef,
              private comunicacionDadoServ : ComunicacionDadoService,
              private cdr: ChangeDetectorRef
              ) {  }

  ngOnDestroy(){
    if (this.cubeElement) {
      this.cubeElement.removeEventListener('transitionend', this.handleTransitionEnd);
    }
  }

  // Función para mostrar el resultado del dado cuando termina la animación del mismo.
  handleTransitionEnd(event: Event) {
    if (event.target === this.cubeElement) {
      this.animacionTerminada = true;
      // Enviamos el resultado del dado a otros componentes
      this.comunicacionDadoServ.enviarResultado(this.resultado);
    }
  }

  ngOnInit() {
    this.cubeElement = this.element.nativeElement.querySelector('.cube');
    this.cubeElement.addEventListener('transitionend', this.handleTransitionEnd.bind(this));

  }


  // abrirPanelLateral() {
  //   if (this.sidenav && this.cubeElement) {
  //     console.log('Abriendo panel lateral');
  //     this.sidenav.toggle();
  //   } else {
  //     console.log('sidenav', this.sidenav);
  //     console.log('cubiElement',  this.cubeElement);
  //     console.log('No se puede abrir el panel lateral. sidenav o cubeElement es nulo.');
  //   }
  // }

  lanzarDado(){
    if(this.cubeElement && this.cubeElement != undefined){
      this.animacionTerminada = false;
      this.cubeElement.style.transition = '';
      this.cubeElement.style.transform = `translateY(400px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
      setTimeout(() => {
        this.cubeElement.style.transition = `transform 2s`;
        this.resultado = Math.floor((Math.random() * 6) + 1);
        console.log(`Resultado de la tirada: ${this.resultado}`);

        switch(this.resultado) {
          case 1:
              this.cubeElement.style.transform = `translateY(400px) rotateX(3600deg) rotateY(3600deg) rotateZ(3600deg)`;
              break;
          case 2:
            this.cubeElement.style.transform = `translateY(400px) rotateX(4410deg) rotateY(3600deg) rotateZ(3600deg)`;
              break;
          case 3:
            this.cubeElement.style.transform = `translateY(400px) rotateX(3600deg) rotateY(4410deg) rotateZ(3600deg)`;
              break;
          case 4:
            this.cubeElement.style.transform = `translateY(400px) rotateX(3600deg) rotateY(2430deg) rotateZ(3600deg)`;
              break;
          case 5:
            this.cubeElement.style.transform = `translateY(400px) rotateX(2430deg) rotateY(3600deg) rotateZ(3600deg)`;
              break;
          case 6:
            this.cubeElement.style.transform = `translateY(400px) rotateX(3600deg) rotateY(1980deg) rotateZ(3600deg)`;
              break;
        };
      }, 20);
    }

  }

}

export interface Ubicacion {
  id: number;
  ubicacion: string;
  lugares: Lugar[];
}

export interface Lugar {
  id_lugar : number;
  lugar: string;
  label: string;
  tooltip: string;
  urlImagen : string;
  historia? : boolean;
  pathEscena? : string;
}

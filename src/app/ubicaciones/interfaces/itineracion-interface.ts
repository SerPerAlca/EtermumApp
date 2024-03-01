export interface UbicacionLocal {
  id: number;
  ubicacion: string;
  lugares: LugarLocal[];
}

export interface LugarLocal {
  id_lugar : number;
  lugar: string;
  label: string;
  tooltip: string;
  urlImagen : string;
  historia? : boolean;
  pathEscena? : string;
}

export interface UbicacionRegional {
  id : number,
  nombre : string,
  entrada : boolean,
  id_up : number | null,
  distance_up : number | null,
  id_right : number | null,
  distance_right : number | null,
  id_down : number | null,
  distance_down : number | null,
  id_left : number | null,
  distance_left : number | null
}

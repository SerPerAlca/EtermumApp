export interface Ciudad {
  id: number;
  ubicacion: string;
  lugares: UbicacionLocal[];
}

export interface UbicacionLocal {
  id_lugar : number;
  lugar: string;
  label: string;
  tooltip: string;
  urlImagen : string;
  historia? : boolean;
  pathEscena? : string;
}

export interface Region {
  id_region: number,
  nombre : string,
  ubicaciones : UbicacionRegional[];
}

export interface UbicacionRegional {
  id : number,
  nombre : string,
  entrada : boolean,
  descansar? : boolean;
  codigo_ciudad?: number,
  id_up : number | null,
  distance_up : number | null,
  id_right : number | null,
  distance_right : number | null,
  id_down : number | null,
  distance_down : number | null,
  id_left : number | null,
  distance_left : number | null
}

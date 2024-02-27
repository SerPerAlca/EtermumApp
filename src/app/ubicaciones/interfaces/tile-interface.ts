export interface Tile {
  id_lugar : number;
  color?: string;
  cols: number;
  rows: number;
  text: string;
  imageUrl?: string;
  historia? : boolean;
  pathEscena?: string;
}

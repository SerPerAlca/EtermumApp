export interface Escena {
  texto: string;
  audio: string;
  imagen: string;
  salida?: string;
  opciones?: { [clave: number]: EscenaConSalida };
  itineracion : number;
}

export interface EscenaConSalida extends Escena {
  salida: string;
}

export interface EscenaConOpciones extends Escena {
  opciones: { [clave: number]: EscenaConSalida };
}

export interface Episodio {
  capitulo1_1: {
    escena1_1_1: EscenaConSalida;
    escena1_1_2: EscenaConOpciones;
    escena1_1_4: Escena;
  };
}

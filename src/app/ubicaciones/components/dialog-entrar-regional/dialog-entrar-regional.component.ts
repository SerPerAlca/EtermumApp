import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-entrar-regional',
  templateUrl: './dialog-entrar-regional.component.html',
  styleUrl: './dialog-entrar-regional.component.css'
})
export class DialogEntrarRegionalComponent {

  constructor(public dialogRef: MatDialogRef<DialogEntrarRegionalComponent>) {}

  onNoClick(): void {
    // Cierra el diálogo con resultado 'No'
    this.dialogRef.close('No');
  }

  onYesClick(): void {
    // Cierra el diálogo con resultado 'Sí'
    this.dialogRef.close('Sí');
  }


}

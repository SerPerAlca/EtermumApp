import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-descansar-regional',
  templateUrl: './dialog-descansar-regional.component.html',
  styleUrl: './dialog-descansar-regional.component.css'
})
export class DialogDescansarRegionalComponent {

  constructor(public dialogRef: MatDialogRef<DialogDescansarRegionalComponent>) {}

  onNoClick(): void {
    // Cierra el diálogo con resultado 'No'
    this.dialogRef.close('No');
  }

  onYesClick(): void {
    // Cierra el diálogo con resultado 'Sí'
    this.dialogRef.close('Sí');
  }

}

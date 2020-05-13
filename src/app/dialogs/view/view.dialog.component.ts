import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {Product} from '../../models/product';

@Component({
  selector: 'app-view.dialog',
  templateUrl: '../../dialogs/view/view.dialog.html',
  styleUrls: ['../../dialogs/view/view.dialog.css']
})

export class ViewDialogComponent {
  constructor(public dialogRef: MatDialogRef<ViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Product) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}

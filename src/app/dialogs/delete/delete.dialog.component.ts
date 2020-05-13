import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {DataService} from '../../services/data.service';
import { Product } from '../../models/product';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../../dialogs/delete/delete.dialog.html',
  styleUrls: ['../../dialogs/delete/delete.dialog.css']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, dataService: DataService },
  ) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.data.dataService.deleteIssue(this.data.product.id);
    this.dialogRef.close();
  }
}

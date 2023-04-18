import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TypeService } from 'src/app/services/type.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {
  onAddType = new EventEmitter();
  onEditType = new EventEmitter();
  typeForm:any = FormGroup;
  dialogAction:any = "Agregar";
  action:any = "Agregar";
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private typeService:TypeService,
  public dialogRef:MatDialogRef<TypeComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.typeForm = this.formBuilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Modificar";
      this.typeForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Editar"){
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.typeForm.value;
    var data = {
      name: formData.name
    }
    this.typeService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddType.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  edit(){
    var formData = this.typeForm.value;
    var data = {
      typeId:this.dialogData.data.typeId,
      name: formData.name
    }
    this.typeService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditType.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

}

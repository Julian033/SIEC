import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/services/area.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  onAddArea = new EventEmitter();
  onEditArea = new EventEmitter();
  areaForm:any = FormGroup;
  dialogAction:any = "Agregar";
  action:any = "Agregar";
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private areaService:AreaService,
  public dialogRef:MatDialogRef<AreaComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.areaForm = this.formBuilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Modificar";
      this.areaForm.patchValue(this.dialogData.data);
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
    var formData = this.areaForm.value;
    var data = {
      name: formData.name
    }
    this.areaService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddArea.emit();
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

    var formData = this.areaForm.value;
    var data = {      
      areaId:this.dialogData.data.areaId,
      name: formData.name
    }
    this.areaService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditArea.emit();
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


  delete(){

    var formData = this.areaForm.value;
    var data = {      
      areaId:this.dialogData.data.areaId,
      name: formData.name
    }
    this.areaService.delete(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditArea.emit();
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

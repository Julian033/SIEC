import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsignadoService } from 'src/app/services/asignado.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AreaService } from 'src/app/services/area.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-asignado',
  templateUrl: './asignado.component.html',
  styleUrls: ['./asignado.component.scss']
})
export class AsignadoComponent implements OnInit {

  onAddAsignado = new EventEmitter();
  onEditAsignado = new EventEmitter();
  asignadoForm :any = FormGroup;
  dialogAction:any = "Agregar";
  action:any = "Agregar";
  responseMessage:any;
  areas:any = [];
  users:any = [];


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private asignadoService:AsignadoService,
  private areaService:AreaService,
  private userService:UserService,
  public dialogRef:MatDialogRef<AsignadoComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.asignadoForm = this.formBuilder.group({
      inventory:[null,[Validators.required]],
      userId:[null,[Validators.required]],
      areaId:[null,[Validators.required]],
    })
    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Modificar";
      this.asignadoForm.patchValue(this.dialogData.data);
    }
    this.getArea();

  }
  


  handleSubmit(){
    if(this.dialogAction === 'Editar'){
      this.edit();
    }
    else{
      this.add();
    }
  }
  
  getArea(){
    this.areaService.getArea().subscribe((response:any)=>{
      this.areas = response;
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }

      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  getUsersByArea() {
    const areaId = this.asignadoForm.controls['areaId'].value;
    this.asignadoService.getUsersByArea(areaId).subscribe(
      (response: any) => {
        this.users = response;
      },
      (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
  
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  add(){
    var formData = this.asignadoForm.value;
    var data = {
      inventory:formData.inventory,
      userId:formData.userId,
      areaId:formData.areaId
    }
    this.asignadoService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddAsignado.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
    },(error:any)=>{
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
    var formData = this.asignadoForm.value;

    var data = {
      asignadoId:this.dialogData.data.asignadoId,
      inventory:formData.inventory,
      userId:formData.userId,
      areaId:formData.areaId


    }
    this.asignadoService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditAsignado.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success");

    },(error:any)=>{
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

    var formData = this.asignadoForm.value;
    var data = {      
      asignadoId:this.dialogData.data.asignadoId,
    }
    this.asignadoService.delete(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditAsignado.emit();
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

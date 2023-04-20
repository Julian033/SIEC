import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/services/area.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TypeService } from 'src/app/services/type.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  onAddEquipment = new EventEmitter();
  onEditEquipment = new EventEmitter();
  equipmentForm:any = FormGroup;
  dialogAction:any = "Agregar";
  action:any = "Agregar";
  responseMessage:any;
  areas:any = [];
  types:any = [];
  

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private equipoService:EquipoService,
  public dialogRef:MatDialogRef<EquipmentComponent>,
  private areaService:AreaService,
  private typeService:TypeService,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.equipmentForm = this.formBuilder.group({
      sn:[null,Validators.required],
      inventory:[null,Validators.required],
      monitor:[null,Validators.required],
      keyboard:[null,Validators.required],
      brand:[null,Validators.required],
      model:[null,Validators.required],
      processor:[null,Validators.required],
      generation:[null,Validators.required],
      ram:[null,Validators.required],
      hddssd:[null,Validators.required],
      connection:[null,Validators.required],
      nodetype:[null,Validators.required],
      bandwidth:[null,Validators.required],
      warranty:[null,Validators.required],
      antivirus:[null,Validators.required],
      office:[null,Validators.required],
      guard:[null,Validators.required],
      systemo:[null,Validators.required],
      typeId:[null,Validators.required],
      areaId:[null,Validators.required],
    })

    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Modificar";
      this.equipmentForm.patchValue(this.dialogData.data);

    }
    this.getArea();
    this.getType();

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

  getType(){
    this.typeService.getType().subscribe((response:any)=>{
      this.types = response;
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
 
 
  handleSubmit(){
    if(this.dialogAction === 'Editar'){
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.equipmentForm.value;
    var data = {
      sn:formData.sn,
      inventory:formData.inventory,
      monitor:formData.monitor,
      keyboard:formData.keyboard,
      brand:formData.brand,
      model:formData.model,
      processor:formData.processor,
      generation:formData.generation,
      ram:formData.ram,
      hddssd:formData.hddssd,
      connection:formData.connection,
      nodetype:formData.nodetype,
      bandwidth:formData.bandwidth,
      warranty:formData.warranty,
      antivirus:formData.antivirus,
      office:formData.office,
      guard:formData.guard,
      systemo:formData.systemo,
      typeId:formData.typeId,
      areaId:formData.areaId,
    }
    this.equipoService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddEquipment.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
      console.log(data);
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
    var formData = this.equipmentForm.value;

    var data = {
      sn:formData.sn,
      inventory:formData.inventory,
      monitor:formData.monitor,
      keyboard:formData.keyboard,
      brand:formData.brand,
      model:formData.model,
      processor:formData.processor,
      generation:formData.generation,
      ram:formData.ram,
      hddssd:formData.hddssd,
      connection:formData.connection,
      nodetype:formData.nodetype,
      bandwidth:formData.bandwidth,
      warranty:formData.warranty,
      antivirus:formData.antivirus,
      office:formData.office,
      guard:formData.guard,
      systemo:formData.systemo,
      typeId:formData.typeId,
      areaId:formData.areaId,
      equipoId:this.dialogData.data.equipoId,
    }
    this.equipoService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditEquipment.emit();
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

    var formData = this.equipmentForm.value;
    var data = {      
      equipoId:this.dialogData.data.equipoId,
    }
    this.areaService.delete(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditEquipment.emit();
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

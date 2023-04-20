import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AreaService } from 'src/app/services/area.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  onAddUser = new EventEmitter();
  onEditUser = new EventEmitter();
  userForm:any = FormGroup;
  dialogAction:any ="Agregar";
  action:any = "Agregar";
  responseMessage:any;
  areas:any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private userService:UserService,
  public dialogRef:MatDialogRef<UserComponent>,
  private areaService:AreaService,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,Validators.required],
      password:[null,Validators.required],
      role:[null,Validators.required],
      status:[null,Validators.required],
      areaId:[null,Validators.required],

    })
    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Modificar";
      this.userForm.patchValue(this.dialogData.data);
    }
    this.getArea();
  }

  getArea(){
    this.areaService.getArea().subscribe((response:any)=>{
      this.areas=response;
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
    var formData = this.userForm.value;
    var data ={
      name:formData.name,
      password:formData.password,
      email:formData.email,
      role:formData.role,
      status:formData.status,
      areaId:formData.areaId,
    }

    this.userService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddUser.emit();
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
    var formData = this.userForm.value;
    var data ={
      userId:this.dialogData.data.userId,
      name:formData.name,
      email:formData.email,
      password:formData.password,
      role:formData.role,
      status:formData.status,
      areaId:formData.areaId,
    }

    this.userService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditUser.emit();
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
}

import { Component, Inject,EventEmitter , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SoftwareService } from 'src/app/services/software.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-software',
  templateUrl: './software.component.html',
  styleUrls: ['./software.component.scss']
})
export class SoftwareComponent implements OnInit {
  onEditSoftware = new EventEmitter();
  softwareForm :any = FormGroup;
  dialogAction:any = "Editar";
  action:any = "Editar";
  responseMessage:any;

  constructor(@Inject(MAT_DIALOG_DATA)public dialogData:any,
  private formBuilder:FormBuilder,
  private softwareService:SoftwareService,
  public dialogRef:MatDialogRef<SoftwareComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.softwareForm = this.formBuilder.group({
      antivirus:[null,[Validators.required]],
      office:[null,[Validators.required]],
      systemo:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Editar'){
      this.dialogAction = "Editar";
      this.action = "Modificar";
      this.softwareForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Editar"){
      this.edit();
    }
  }


  edit(){
    var formData = this.softwareForm.value;
    var data = {
      softwareId:this.dialogData.data.softwareId,
      antivirus: formData.antivirus,
      office: formData.office,
      systemo: formData.systemo,
    }
    this.softwareService.updateSoftware(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditSoftware.emit();
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

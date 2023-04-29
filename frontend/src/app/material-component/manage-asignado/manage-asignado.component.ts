import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AsignadoService } from 'src/app/services/asignado.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { AsignadoComponent } from '../dialog/asignado/asignado.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-manage-asignado',
  templateUrl: './manage-asignado.component.html',
  styleUrls: ['./manage-asignado.component.scss']
})
export class ManageAsignadoComponent implements OnInit {

  displayedColumns:string[] = ['inventory','user','area','edit'];
  dataSource:any;
  responseMessage:any;


  constructor(private asignadoService:AsignadoService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.asignadoService.get().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    },(error:any)=>{
      this.ngxService.stop();
       if(error.error?.message){
        this.responseMessage = error.error?.message;
       }
       else{
        this.responseMessage = GlobalConstants.genericError;
       }
       this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Agregar'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(AsignadoComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close(); 
    });
    const sub = dialogRef.componentInstance.onAddAsignado.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }
  
  handleEditAction(values:any){
        const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Editar',
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(AsignadoComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close(); 
    });
    const sub = dialogRef.componentInstance.onEditAsignado.subscribe(
      (response)=>{
        this.tableData();
      }
    )
  }
  

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message:'Eliminar '
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteAsignado(values.asignadoId);
      dialogRef.close();
    })
  }

  deleteAsignado(asignadoId:any){
    this.asignadoService.delete(asignadoId).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
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

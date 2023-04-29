import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EquipoService } from 'src/app/services/equipo.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { EquipmentComponent } from '../dialog/equipment/equipment.component';

@Component({
  selector: 'app-manage-equipment',
  templateUrl: './manage-equipment.component.html',
  styleUrls: ['./manage-equipment.component.scss']
})
export class ManageEquipmentComponent implements OnInit {
 displayedColumns:string[] = ['sn','inventory','brand','model','type','area','edit']
 dataSource:any;
 responseMessage: any;
 pageSizeOptions: number[] = [50, 100, 500, 1000];

 @ViewChild(MatPaginator)
 paginator!: MatPaginator;

  constructor(private equipoService:EquipoService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.equipoService.getEquipment().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
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
     const dialogRef = this.dialog.open(EquipmentComponent,dialogConfig);
     this.router.events.subscribe(()=>{
      dialogRef.close();
     })
     const sub= dialogRef.componentInstance.onAddEquipment.subscribe(
      (response) =>{
        this.tableData();
      }
     )

     
  }

  handleEditAction(value:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Editar',
      data:value
     
     }
     dialogConfig.width = "850px";
     const dialogRef = this.dialog.open(EquipmentComponent,dialogConfig);
     this.router.events.subscribe(()=>{
      dialogRef.close();
     })
     const sub= dialogRef.componentInstance.onEditEquipment.subscribe(
      (response) =>{
        this.tableData();
      }
     )
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Eliminar ' + values.sn
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteEquipment(values.equipoId);
      dialogRef.close();
    })
  }

  deleteEquipment(equipoId:any){
    this.equipoService.delete(equipoId).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"Success");
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

  onChange(status:any,equipoId:any){
    var data = {
      status:status.toString(),
      equipoId:equipoId
    }
    this.equipoService.updateStatus(data).subscribe((response:any)=>{
       this.ngxService.stop();
       this.responseMessage = response?.message;
       this.snackbarService.openSnackBar(this.responseMessage,"Success");
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { CrudService } from '.././crud.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})

export class RegistrarsePage implements OnInit {

  usuarios: any;
  usuario: string;
  password: string;
  usuarioBD : string;
  passwordBD : string;
  login : boolean;
  estaBD : boolean;
  formacion : string;
  laboral : string;

  constructor(private crudService: CrudService, private router: Router, private toastCtrl: ToastController) { }

  ngOnInit() {

    //inicializanos la bandera estaBD a false.
    this.estaBD = false;

    //inicializanos usuario a cadena vacia.
    this.usuario = "";

    //incializamos password.
    this.password = "";

    //asignamos una cadena vacia a laboral y formación.
    this.laboral = "";
    this.formacion = "";

    this.crudService.read_usuario().subscribe(data => {

      this.usuarios = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          usuario: e.payload.doc.data()['usuario'],
          password: e.payload.doc.data()['password'],
          formacion: e.payload.doc.data()['formacion'],
          laboral: e.payload.doc.data()['laboral']
        };
      })
      console.log(this.usuarios);

    });
  }

  estaUsuarioBasededatos(){

    this.estaBD = false;

    this.crudService.read_usuario().subscribe(data => {

      this.usuarios = data.map(e => {

        //asignamos usuario y contraseña
        this.usuarioBD = e.payload.doc.data()['usuario'];


        if(this.usuarioBD == this.usuario){
            this.estaBD = true;
        }
      });

    });

    return this.estaBD;
  }

  async CreateRecord() {

    let record = {};

    //asiganamos estaBD a true si el usuario esta en base de datos, no e.o.c.
    this.estaUsuarioBasededatos();

    if(this.usuario.length==0 || this.password.length==0) {

      const toast = await this.toastCtrl.create({
        message: 'Error, el usuario o la contraseña no pueden estar en blanco.',
        duration: 5000
      });
      toast.present();

    }
    else if(this.usuario.length < 8 || this.password.length < 8){

      const toast = await this.toastCtrl.create({
        message: 'Error, debe tener 8 caracteres como minimo.',
        duration: 5000
      });
      toast.present();

    }
    //si el usuario esta en la base de datos, informar al usuario.
    else if(this.estaUsuarioBasededatos()==true){

      const toast = await this.toastCtrl.create({
        message: 'Error, el usuario ya se encuentra en la base de datos.',
        duration: 5000
      });
      toast.present();

    }
    else{

      //insertamos datos en la base de datos.
      record['usuario'] = this.usuario;
      record['password'] = this.password;
      record['formacion'] = this.formacion;
      record['laboral'] = this.laboral;

      this.crudService.create_usuario(record).then( async resp => {

        const toast = await this.toastCtrl.create({
          message: 'El usuario se ha creado correctamente.',
          duration: 5000
        });
        toast.present();
      })
        .catch(error => {
          console.log(error);
        });
    }
  }


  RemoveRecord(rowID) {
    this.crudService.delete_usuario(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.usuario = record.usuario;
    record.password = record.password;
    record.formacion = record.formacion;
    record.laboral = record.laboral;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['usuario'] = recordRow.usuario;
    record['password'] = recordRow.password;
    record['formacion'] = recordRow.formacion;
    record['laboral'] = recordRow.laboral;
    this.crudService.update_usuario(recordRow.id, record);
    recordRow.isEdit = false;
  }

  Volver(){
    this.router.navigateByUrl('/home');
  }

  IrA(url){
    this.router.navigateByUrl(url);
  }

}

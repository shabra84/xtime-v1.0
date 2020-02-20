import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Router } from '@angular/router';

import { CrudService } from '.././crud.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit{

  usuarios: any;
  usuario: string;
  password: string;
  usuarioBD : string;
  passwordBD : string;
  login : boolean;


  isLoggedIn = false;
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };

  constructor(private fb: Facebook, private router: Router, private crudService: CrudService, private toastCtrl: ToastController) {
 fb.getLoginStatus()
 .then(res => {
   console.log(res.status);
   if (res.status === 'connect') {
     this.isLoggedIn = true;
   } else {
     this.isLoggedIn = false;
   }
 })
 .catch(e => console.log(e));
}

ngOnInit() {
  this.crudService.read_usuario().subscribe(data => {

    this.usuarios = data.map(e => {
      return {
        id: e.payload.doc.id,
        isEdit: false,
        usuario: e.payload.doc.data()['usuario'],
        password: e.payload.doc.data()['password']
      };
    })
    console.log(this.usuarios);

  });
}

/**
*  Iniciar sesión con facebook.
**/
fbLogin() {
  this.fb.login(['public_profile', 'user_friends', 'email'])
    .then(res => {
      if (res.status === 'connected') {
        this.isLoggedIn = true;
        //redirecciona a la página de inicio.
        this.router.navigateByUrl('/principal');

        //this.getUserDetail(res.authResponse.userID);
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log('Error logging into Facebook', e));
}

getUserDetail(userid: any) {
  this.fb.api('/' + userid + '/?fields=id,email,name,picture', ['public_profile'])
    .then(res => {
      console.log(res);
      this.users = res;
    })
    .catch(e => {
      console.log(e);
    });
}


iniciarSesion(usuario: string, password: string) {

  this.login = false;

  this.crudService.read_usuario().subscribe(async data => {

    this.usuarios = data.map(e => {

      //asignamos usuario y contraseña
      this.usuarioBD = e.payload.doc.data()['usuario'];
      this.passwordBD = e.payload.doc.data()['password'];

      //alamcenamos el usuario para usarlo en diferntes vistas.
      localStorage.setItem('usuario',this.usuarioBD);

      //si son iguales usuario y contraseña, entramos en la app.
      if(this.usuarioBD == usuario && this.passwordBD == password){
          this.login = true;
      }
    })

    //si no se ha hecho login, mostramos una tostada con el error.
    if(!this.login){
        try{
          const toast = await this.toastCtrl.create({
            message: 'Usuario y contraseña incorrectos.',
            duration: 5000
          });
          toast.present();
        }
        catch(err){}
    }
    //si hace login, nos redirecciona a la landing page.
    else{
      this.router.navigateByUrl('/principal');
    }
  });

}


logout() {
  this.fb.logout()
    .then( res => this.isLoggedIn = false)
    .catch(e => console.log('Error logout from Facebook', e));
}

IrA(url){
  this.router.navigateByUrl(url);
}
}

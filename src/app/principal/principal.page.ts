import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  usuario : string;

  constructor(private router: Router) { }

  ngOnInit() {

    //asignamos a usuario el nombre tras el exito de iniciar sesión.
    this.usuario = localStorage.getItem('usuario');

  }

  logout(){
    this.router.navigateByUrl('/home');
  }

}

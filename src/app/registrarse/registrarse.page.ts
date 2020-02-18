import { Component, OnInit } from '@angular/core';

import { CrudService } from '.././crud.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})

export class RegistrarsePage implements OnInit {

  usuarios: any;
  usuario: string;
  password: number;

  constructor(private crudService: CrudService) { }

  ngOnInit() {
    this.crudService.read_Students().subscribe(data => {

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

  CreateRecord() {
    let record = {};
    record['usuario'] = this.usuario;
    record['password'] = this.password;
    this.crudService.create_NewStudent(record).then(resp => {
      this.usuario = "";
      this.password = undefined;
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.crudService.delete_Student(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.usuario = record.usuario;
    record.password = record.password;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['usuario'] = recordRow.usuario;
    record['password'] = recordRow.password;
    this.crudService.update_Student(recordRow.id, record);
    recordRow.isEdit = false;
  }


}

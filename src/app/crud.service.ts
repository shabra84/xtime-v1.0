import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(
    private firestore: AngularFirestore
  ) { }


  create_usuario(record) {
    return this.firestore.collection('usuarios').add(record);
  }

  read_usuario() {
    return this.firestore.collection('usuarios').snapshotChanges();
  }

  update_usuario(recordID,record){
    this.firestore.doc('usuarios/' + recordID).update(record);
  }

  delete_usuario(record_id) {
    this.firestore.doc('usuarios/' + record_id).delete();
  }
}

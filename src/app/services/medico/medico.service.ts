import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

import swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos() {
    const url = URL_SERVICIOS + '/medico';

    return this.http.get(url).pipe(
      map( (res: any) => {
        this.totalMedicos = res.total;
        return res.medicos;
      }));

  }

  cargarMedico( id: string) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url).pipe(
      map( (res: any) => res.medico ));
  }

  buscarMedico( termino: string ) {
    // console.log('Termino: ', termino);
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url).pipe(
              map( (res: any) => res.medicos ));

  }

  borrarMedico( id: string ) {
    const url = URL_SERVICIOS + '/medico/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(
              map(
                res => {
                  swal.fire({
                    title: 'Metge borrat!',
                    text: 'Metge eliminat correctament de la base de dades.',
                    icon: 'success'
                  });
                  return true;

              }));

  }

  guardarMedico( medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // estic modificant
      url += '/' + medico._id + '?token=' + this._usuarioService.token;
      return this.http.put(url, medico).pipe(
                map( (res: any) => {
                  swal.fire({
                    title: 'Metge actualitzat!',
                    text: 'S´ha actualitzat el metge: ' + medico.nombre,
                    icon: 'success'
                  });
                  return res.medico;
                }));
    } else {
      // estic creant
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico).pipe(
                map( (res: any) => {
                  swal.fire({
                    title: 'Metge creat!',
                    text: 'S´ha creat el metge: ' + medico.nombre,
                    icon: 'success'
                  });
                  return res.medico;
                }));
    }

  }


}

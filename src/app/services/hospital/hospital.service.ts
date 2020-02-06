import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

import swal from 'sweetalert2';
import { Hospital } from '../../models/hospital.model';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarHospitales() {

    const url = URL_SERVICIOS + '/hospital';

    return this.http.get(url).pipe(
        map( (res: any) => {
          this.totalHospitales = res.total;
          return res.hospitales;
        }));

  }

  obtenerHospital( id:	string ) {

    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get(url).pipe(
        map( (res: any) => res.hospital));

  }

  borrarHospital( id: string ) {

    const url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;

    return this.http.delete(url).pipe(
      map( res => {
        swal.fire(
          'Hospital borrat!',
          'Hospital eliminat correctament de la base de dades.',
          'success'
        );
        return true;
      }));
  }

  crearHospital( nombre: string ) {

    const url = URL_SERVICIOS + '/hospital/?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre}).pipe(
      map( (res: any) => {
        swal.fire({
          title: 'Hospital creat ',
          text: nombre,
          icon: 'success'
        });
        return res.hospital;
      }));

  }

  buscarHospital(	termino:	string ) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get(url).pipe(
              map( (res: any) => res.hospitales ));

  }

  actualizarHospital( hospital: Hospital ) {

    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(
      map( (res: any) =>  {
        swal.fire({
          title: 'Hospital modificat ',
          text: hospital.nombre,
          icon: 'success'
        });
        return res.hospital;
      }));
  }

}

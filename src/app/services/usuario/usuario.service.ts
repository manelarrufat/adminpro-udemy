import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';
import swal from 'sweetalert2';

import { map } from 'rxjs/operators';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;

  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }


  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
            map( (resp: any) => {
              this.guardarStorage(resp.id, resp.token, resp.usuario);

              return true;
            }));

  }

  login( usuario: Usuario, recordar: boolean = false ) {

    const url = URL_SERVICIOS + '/login';

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(url, usuario).pipe(
                map( (res: any) => {
                  this.guardarStorage(res.id, res.token, res.usuario);

                  return true;
                }));

  }

  crearUsuario( usuario: Usuario ) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
                map( (res: any) => {
                  swal.fire({
                    title: 'Usuari creat ',
                    text: usuario.email,
                    icon: 'success'
                  });
                  return res.usuario;
                }));
  }

  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    // console.log('URL: ', url);

    return this.http.put(url, usuario).pipe(
              map( (res: any) => {

                this.guardarStorage(res.usuario._id, this.token, res.usuario);

                swal.fire({
                  title: 'Usuari modificat ',
                  text: usuario.nombre,
                  icon: 'success'
                });

                return true;

              }));

  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
          .then( (res: any) => {
            console.log(res);

            this.usuario.img = res.usuario.img;

            swal.fire({
              title: 'Imatge de l´usuari modificada ',
              text: this.usuario.nombre,
              icon: 'success'
            });

            this.guardarStorage(id, this.token, this.usuario);

          })
          .catch( res => {
            console.log(res);
          });

  }

}

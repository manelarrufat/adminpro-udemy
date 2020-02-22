import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../config/config';
import swal from 'sweetalert2';

import { map, catchError } from 'rxjs/operators';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );


    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');


    this.router.navigate(['/login']);
  }


  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
            map( (resp: any) => {
              this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);

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
                  this.guardarStorage(res.id, res.token, res.usuario, res.menu);
                  return true;
                }),
                catchError( err => {
                  console.log('Status: ', err.status);
                  console.log('Missatge: ', err.error.mensaje);
                  swal.fire({
                    title: 'Error en el login',
                    text: err.error.mensaje,
                    icon: 'error'
                  });
                  return throwError(err);
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
                }),
                catchError( err => {
                  console.log('Status: ', err.status);
                  console.log('Missatge: ', err.error.mensaje);
                  swal.fire({
                    title: err.error.mensaje,
                    text: err.error.errors.message,
                    icon: 'error'
                  });
                  return throwError(err);
                }));
  }

  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    // console.log('URL: ', url);

    return this.http.put(url, usuario).pipe(
              map( (res: any) => {

                if (usuario._id === this.usuario._id) {
                  this.guardarStorage(res.usuario._id, this.token, res.usuario, res.menu);

                }

                swal.fire({
                  title: 'Usuari modificat ',
                  text: usuario.nombre,
                  icon: 'success'
                });

                return true;

              }),
              catchError( err => {
                  console.log('Status: ', err.status);
                  console.log('Missatge: ', err.error.mensaje);
                  swal.fire({
                    title: err.error.mensaje,
                    text: err.error.errors.message,
                    icon: 'error'
                  });
                  return throwError(err);
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

            this.guardarStorage(id, this.token, this.usuario, this.menu);

          })
          .catch( res => {
            console.log(res);
          });

  }

  cargarUsuarios( desde: number = 0 ) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);

  }

  buscarUsuario( termino: string ) {
    // console.log('Termino: ', termino);
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url).pipe(
              map( (res: any) => res.usuarios ));

  }

  borrarUsuario( id: string ) {

    const url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;

    return this.http.delete(url).pipe(
              map( res => {
                swal.fire(
                  'Usuari borrat!',
                  'Usuari eliminat correctament de la base de dades.',
                  'success'
                );
                return true;
              }));

  }

}

import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import swal from 'sweetalert2';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUpladService } from 'src/app/components/modal-upload/modal-uplad.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUpladService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
          .subscribe( (res: any) => this.cargarUsuarios());

    this.cargando = true;

    // Seleccionamos el input en el documento
    const input = document.getElementById('buscaUsuario');

    // En el evento indicado para el elemento seleccionado ejecutamos los pipes y luego el subscribe
    fromEvent(input, 'input')
      .pipe(
        // Tomamos las letras ingresadas en el input
        map((k: KeyboardEvent) => {
            this.cargando = true;
            return k.target['value'];
        }),
        // Seleccionamos un tiempo en milisegundos antes de continuar la ejecución luego de
        // que se presionó la última letra, si hay cambios en el input vuelve a empezar a
        // contar
        debounceTime(1500),
        // Ahora si ejecutamos la busqueda del usuario con el total de letras en el input
        // luego de que se dejara de escribir por 1,5 segundos
      ).subscribe(val => {
        if (val !== '') {
          this._usuarioService.buscarUsuario(val)
            .subscribe( (usuarios: Usuario[]) => {
              this.usuarios = usuarios;
              this.cargando = false;
            });
        } else {
          this.cargarUsuarios();
          return;
        }
      });


  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
          .subscribe( ( res: any ) => {
            console.log(res);
            this.totalRegistros = res.total;
            this.usuarios = res.usuarios;
            this.cargando = false;
          });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;
    console.log('Desde: ', desde);

    if ( desde >= this.totalRegistros || desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  borrarUsuario(usuario: Usuario) {
    console.log(usuario);

    if ( usuario._id === this._usuarioService.usuario._id ) {
      // No ens podem borrar a nosaltres mateixos
      swal.fire({
        title: 'Borrar usuari',
        text: 'No et pots borrar a tú mateix',
        icon: 'error'
      });
      return;
    }

    swal.fire({
      title: 'Estas segur que vols borrar aquest usuari?',
      text: 'Aquesta acció de borrar ' + usuario.nombre + ' no es pot revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'Cancel·lar'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.borrarUsuario (usuario._id )
              .subscribe( borrado => {
                console.log(borrado);
                this.cargarUsuarios();
              });

      }
    });

  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioService.actualizarUsuario(usuario)
            .subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

}

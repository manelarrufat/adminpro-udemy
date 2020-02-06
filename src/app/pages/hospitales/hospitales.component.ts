import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import swal from 'sweetalert2';
import { ModalUpladService } from '../../components/modal-upload/modal-uplad.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUpladService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
          .subscribe( () => this.cargarHospitales() );
  }

  buscarHospital( termino: string ) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
          .subscribe( hospitales => this.hospitales = hospitales);
  }

  cargarHospitales() {
    this._hospitalService.cargarHospitales()
          .subscribe( hospitales => this.hospitales = hospitales );

  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital)
            .subscribe( () => this.cargarHospitales() );
  }

  borrarHospital(hospital: Hospital) {
    this._hospitalService.borrarHospital(hospital._id)
            .subscribe( () => this.cargarHospitales() );
  }

  crearHospital() {

    swal.fire({
      title: 'Crear Hospital',
      text: 'Entra el nom del nou Hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancel·lar',
      confirmButtonText: 'Guardar',

    }).then((valor) => {
      if (!valor || valor.value === '' || valor.value === undefined ) {
        return;
      }
      console.log('Valor.value: ',valor.value);
      this._hospitalService.crearHospital(valor.value)
              .subscribe( () => this.cargarHospitales());
    });
  }

  actualizarImagen(hospital: Hospital) {

    this._modalUploadService.mostrarModal('hospitales', hospital._id);

  }

}

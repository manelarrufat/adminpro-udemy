import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MedicoService, HospitalService } from 'src/app/services/service.index';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUpladService } from '../../components/modal-upload/modal-uplad.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUpladService
  ) {

    activatedRoute.params.subscribe( params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });

  }

  ngOnInit() {
    this._hospitalService.cargarHospitales()
          .subscribe( hospitales => this.hospitales = hospitales);

    this._modalUploadService.notificacion
          .subscribe( res => this.medico.img = res.medico.img );
  }

  cargarMedico(id: string) {
    this._medicoService.cargarMedico(id)
          .subscribe(medico => {
            console.log(medico);
            this.medico = medico;
            this.medico.hospital = medico.hospital._id;
            this.cambioHospital(this.medico.hospital);
          });
  }

  guardarMedico(f: NgForm) {

    console.log(f.valid);
    console.log(f.value);

    if( f.invalid) {
      return;
    }

    this._medicoService.guardarMedico(this.medico)
            .subscribe( medico => {
              this.medico._id = medico._id;
              this.router.navigate(['/medico', medico._id]);
            });

  }

  cambioHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
          .subscribe( hospital =>  this.hospital = hospital );
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}

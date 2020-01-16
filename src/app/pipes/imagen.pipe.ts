import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'usuario'): any {

    // Controlem el cas que no s'hagi definit l'imatge, altrament donava error
    if (img === undefined || img === null) {
      img = '';
    }

    // Si entrem amb el compte de google
    if (img.indexOf('https') >= 0) {
      return img;
    }

    let url = URL_SERVICIOS + '/img';

    if (!img) {
      return url + '/usuarios/xxx';
    }

    switch (tipo) {
      case 'usuario':
        url += '/usuarios/' + img;
        break;

      case 'medico':
        url += '/medicos/' + img;
        break;

      case 'hospital':
        url += '/hospitales/' + img;
        break;

      default:
        console.log('Tipo de imagen no existe: usuarios, medicos, hospitales');
        url += '/usuarios/xxx';
        break;
    }

    return url;
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.regresaObservable()
    .subscribe(
      numero => console.log('Subs: ', numero),
      error => console.error('Error en el observable: ', error),
      () => console.log('El observador terminó.')
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La pàgina es tancarà');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {

    return new Observable( (observer: Subscriber<any>) => {

      let contador = 0;

      const intervalo = setInterval( () => {

        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // if ( contador === 6 ) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   // clearInterval(intervalo);
        //   observer.error('Sucorru!!!');
        // }

      }, 1000 );

    }).pipe(
      map( resp => resp.valor ),
      filter( ( valor, index ) => {
        if ( (valor % 2) === 1 ) {
          // numero senar
          return true;
        } else {
          // numero parell
          return false;
        }

      })
    );

  }

}

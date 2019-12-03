import { Component, OnInit, Input } from '@angular/core';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})
export class GraficoDonaComponent implements OnInit {

  @Input() chartData: MultiDataSet = [];
  @Input() chartLabels: Label[] = [];
  @Input() chartType: ChartType;

  constructor() { }

  ngOnInit() {
  }

}

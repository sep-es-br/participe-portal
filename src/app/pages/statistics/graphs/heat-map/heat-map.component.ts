import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap';
import 'heatmap.js';
import 'heatmap.js/plugins/leaflet-heatmap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHeatMapLocation } from 'src/app/shared/interfaces/IStatisticsDashboardData';
import { ResponsiveService } from 'src/app/shared/services/responsive.service';


@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit, OnDestroy, OnChanges {

  @Input() locations: IHeatMapLocation[];
  @Input() center: {lat: number; lng: number};
  @Input() zoom: number;

  responsive: boolean;
  $destroy = new Subject();
  heatmapLayer: HeatmapOverlay;

  constructor(
    private responsiveSrv: ResponsiveService,
  ) {
    this.responsiveSrv.observable.pipe(takeUntil(this.$destroy)).subscribe(value => {
      this.responsive = value;
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.locations && changes.locations.currentValue) {
      if (this.locations && this.heatmapLayer) {
        await this.calculateCounts();
        const mapData = {
          max: 1,
          data: this.locations.filter( local => local.count > 0)
        };
        this.heatmapLayer.setData(mapData);
      }
    }
  }

  async ngOnInit() {
    await this.loadHeatMap();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  async loadHeatMap() {
    await this.calculateCounts();
    const mapData = {
      max: 1,
      data: this.locations.filter( local => local.count > 0)
    };
    const mapLink =
      '<a href="https://openstreetmap.org">OpenStreetMap</a>';


    const baseLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; ' + mapLink + ' Contributors',
      maxZoom: 20,

    });

    const cfg = {
      radius: 0.05,
      minOpacity: 0.5,
      maxOpacity: 1,
      scaleRadius: true,
      useLocalExtrema: false,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count',
      // gradient: {
      //  '.5': 'blue',
      //  '.8': 'red',
      //  '.95': 'white'
      // },
    };
    this.heatmapLayer = new HeatmapOverlay(cfg);
    const map = new L.Map('map', {
      center: new L.LatLng(this.center.lat, this.center.lng),
      boxZoom: true,
      zoom: this.zoom,
      layers: [baseLayer, this.heatmapLayer]
    });
    this.heatmapLayer.setData(mapData);
  }

  async calculateCounts() {
    const counts = this.locations.map( local => local.count);
    const maxCount = counts.reduce( (a, b) => {
      return Math.max(a, b);
    });
    if (maxCount > 0) {
      this.locations.forEach( local => local.count = (local.count / maxCount));
    }
  }

}


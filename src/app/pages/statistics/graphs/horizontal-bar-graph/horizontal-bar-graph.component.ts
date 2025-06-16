import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHorizontalBarChartItem } from 'src/app/shared/interfaces/IStatisticsDashboardData';
import { ResponsiveService } from 'src/app/shared/services/responsive.service';
import { ColorService } from 'src/app/shared/services/color.service';

@Component({
  selector: 'app-horizontal-bar-graph',
  templateUrl: './horizontal-bar-graph.component.html',
  styleUrls: ['./horizontal-bar-graph.component.scss']
})
export class HorizontalBarGraphComponent implements OnInit, OnDestroy, OnChanges {

  @Input() chartData: IHorizontalBarChartItem[];

  height: number;
  labels: string[];
  data;
  config: any;
  color = 'rgb(245, 134, 52)';
  plugins;
  responsive: boolean;
  $destroy = new Subject();
  align: string;
  anchor: string;
  labelColor: string;

  @Output() graphClicked = new EventEmitter();

  constructor(
    private responsiveSrv: ResponsiveService,
    private colorService: ColorService,
  ) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.chartData && changes.chartData.currentValue) {
      this.data = undefined;
      this.config = undefined;
      this.plugins = undefined;
      this.height = undefined;
      await this.loadData();
      await this.loadConfig();
      await this.loadPlugins();
    }
  }

  async ngOnInit() {
    this.responsiveSrv.observable.pipe(takeUntil(this.$destroy)).subscribe(async (value) => {
      this.responsive = value;
      this.align = this.responsive ? 'end' : 'end';
      this.anchor = this.responsive ? 'center' : 'end';
      this.labelColor = this.colorService.getCssVariableValue('--card-font-color')
      this.data = undefined;
      this.config = undefined;
      this.plugins = undefined;
      this.height = undefined;
      await this.loadData();
      await this.loadConfig();
      await this.loadPlugins();
    });
    Chart.defaults.borderColor = 'rgba(0, 0, 0, 0)';
    Chart.register(ChartDataLabels);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  async loadConfig() {
    const data = this.chartData && this.chartData.map(item => item.quantity);
    const maxData = data.reduce( (a, b) => {
      return Math.max(a, b);
    });
    this.config = {
      maintainAspectRatio: false,
      events: ['click'],
      indexAxis: 'y',
      onClick: (e, item) => this.graphClicked.next(item),
      plugins: {
        legend: false,
        datalabels: {
          align: this.align,
          anchor: this.anchor,
          clamp: 'true',
          barThickness: 'flex',
          color: this.labelColor,
          display(context) {
            return context.dataset.data[context.dataIndex] > 0;
          },
          font: {
            size: this.responsive ? 10 : 10,
          },
          formatter: Math.round
        }
      },
      title: {
        display: false,
      },
      tooltips: {
        enabled: false
      },
      scales: {
        x: {
          offset: true,
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            beginAtZero: true,
            display: false,
            max: maxData * 1.15,
          }
        },
        y: {
          gridLines: {
            display: false
          },
          ticks: {
            callback: (label) => {
              label = this.chartData[label].description
              const maxValue = this.responsive ? 15 : 20;
              if (/\s/.test(label) && label.length > maxValue) {
                return label.substring(0, maxValue) + '...';
              } else {
                return label;
              }
            },
            fontSize: this.responsive ? 10 : 10,
            color: this.labelColor,
          },
          offset: true
        },
      },
      datasets: {
        bar: {
          barThickness: 15
        }
      }
    };
    this.height = (data.length * 60) < 100 ? 100 : (data.length * 60);
  }

  get chartHeight() {
    const barCount = this.chartData.length || 1;
    const heightPerBar = 25;
    return `${barCount * heightPerBar}px`;
  }

  realoadConfig() {
    this.loadConfig();
    return this.config;
  }

  async loadData() {
    this.labels = this.chartData && this.chartData.map(item => item.description.toUpperCase());
    this.data = {
      labels: this.labels,
      datasets: [{
        data: this.chartData.map(item => item.quantity),
        barPercentage: 0.9,
        categoryPercentage: 0.8,
        onClick: (e, item) => this.graphClicked.next(item),
        datalabels: {
          align: this.align,
          anchor: this.anchor,
          clamp: 'true',
          barThickness: 'flex',
          color: this.labelColor,
          display(context) {
            return context.dataset.data[context.dataIndex] > 0;
          },
          font: {
            size: this.responsive ? 12 : 12
          },
          formatter: Math.round,
        },
      }],
    };
  }

  async loadPlugins() {
    const gradientLenght = this.responsive ? 200 : 400;
    Chart.defaults.plugins.tooltip.enabled = false;
    this.plugins = [{
      beforeDatasetDraw: (chart) => {
        const chartInstance = chart;
        const ctx = chartInstance.ctx;
        const chartArea = chartInstance.chartArea;
        const data = chart.config.data;
        const gradient = ctx.createLinearGradient(0, 0, gradientLenght, 0);
        gradient.addColorStop(0, '#00a198');
        gradient.addColorStop(1, '#00a198');
        data.datasets.forEach((dataset, i) => {
          const meta = chartInstance.getDatasetMeta(i);
          meta.data.forEach((bar) => {
            bar.options.backgroundColor = this.colorService.getCssVariableValue('--accent-color');
            bar.options.borderColor = this.colorService.getCssVariableValue('--accent-color');
          });
        });
      }
    }];
  }

}

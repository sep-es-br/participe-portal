export interface IStatisticsDashboardData {
  participants: number;
  proposals: number;
  highlights: number;
  counties: number;
  microregionChart?: IHorizontalBarChartItem[];
  heatMapChart?: IHeatMapLocation[];
  strategicAreaChart?: IHorizontalBarChartItem[];
}

export interface IHorizontalBarChartItem {
  id: number;
  description: string;
  quantity: number;
  lat?: number;
  lng?: number;
}

export interface IHeatMapLocation {
  lat: number;
  lng: number;
  count: number;
}
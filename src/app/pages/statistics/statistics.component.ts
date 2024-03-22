import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelectItem, SelectItemGroup} from 'primeng/api';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IConference} from 'src/app/shared/interfaces/IConference';
import {IHorizontalBarChartItem, IStatisticsDashboardData} from 'src/app/shared/interfaces/IStatisticsDashboardData';
import {ConferenceService} from 'src/app/shared/services/conference.service';
import {MeetingService} from 'src/app/shared/services/meeting.service';
import {ResponsiveService} from 'src/app/shared/services/responsive.service';
import {StatisticsDashboardService} from 'src/app/shared/services/statistics.dashboard.service';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {StructureItemService} from 'src/app/shared/services/structure-item.service';

interface IItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {

  filters = {
    selectedResult: 'HIGHLIGHTS',
    selectedOrigin: '',
    selectedMeeting: []
  };
  showMicroregionChart = true;
  showStrategicAreaChart = true;
  conference: IConference;
  conferenceOptions: SelectItem[];
  originOptions: SelectItem[];
  meetingListOptions: SelectItem[];
  resultOptions: SelectItem[];
  microregionChartAgroupOptions: SelectItem[];
  chartDisplayOptions: SelectItemGroup[];
  microregionChartAgroupSelected: number;
  microregionChartDisplaySelected: string = 'VALUE_DESC';
  strategicAreaChartDisplaySelected: string = 'VALUE_DESC';
  barRegionSelecteds: IHorizontalBarChartItem[] = [];
  barStrategicAreaSelecteds: IHorizontalBarChartItem[] = [];
  dashboardData: IStatisticsDashboardData;
  chartsTitleSelected: string;
  microregionAgroupLocalityTypeSelected: IItem;
  strategicAreaChartStructureLevels: { id: number; name: string }[] = [];
  itemStructureSelected: { id: number; name: string };
  heatMapCenter = { lat: -19.510200002162634, lng: -41.05759854916905 };
  responsive: boolean;
  $destroy = new Subject();
  heatmapZoom = 8;
  arrowLeftIcon = faArrowLeft;
  dashboardDataResponse: IStatisticsDashboardData;

  constructor(
    private conferenceSrv: ConferenceService,
    private meetingSrv: MeetingService,
    private dashboardSrv: StatisticsDashboardService,
    private responsiveSrv: ResponsiveService,
    private structureSrv: StructureItemService
  ) {
  }

  async ngOnInit() {
    this.loadListOptions();
    this.responsiveSrv.observable.pipe(takeUntil(this.$destroy)).subscribe(value => {
      this.responsive = value;
    });
    await this.loadConference();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  loadListOptions() {
    this.resultOptions = [
      { label: 'Participantes', value: 'PARTICIPANTS' },
      { label: 'Destaques', value: 'HIGHLIGHTS' },
      { label: 'Propostas', value: 'PROPOSALS' }
    ];
    this.originOptions = [
      { label: 'Todas', value: '' },
      { label: 'Remota', value: 'REMOTE' },
      { label: 'Presencial', value: 'PRESENTIAL' }
    ];
    this.chartDisplayOptions = [
      {
        label: 'Valor',
        items: [
          { label: 'Top 5', value: 'TOP_FIVE' },
          { label: 'Top 10', value: 'TOP_TEN' },
          { label: 'Decrescente', value: 'VALUE_DESC' },
          { label: 'Crescente', value: 'VALUE_ASC' }
        ]
      },
      {
        label: 'Alfabética',
        items: [
          { label: 'Decrescente', value: 'ALPHABETIC_DESC' },
          { label: 'Crescente', value: 'ALPHABETIC_ASC' }
        ]
      },
    ];
  }

  async loadConference() {
    const result = await this.conferenceSrv.GetById(this.conferenceSrv.ConferenceActiveId);
    if (result.success) {
      this.conference = result.data;
      this.setChartsTitle();
      this.clearBarChartSelecteds();
      await this.loadMeetingsByConferenceSelected();
      await this.loadRegionStructureConference();
      await this.loadStructurePlanItemsConference();
      await this.loadCharts();
    }
  }

  async loadRegionStructureConference() {
    if (this.filters.selectedResult === 'HIGHLIGHTS') {
      await this.loadLocalityCitizenItems();
    } else {
      await this.loadRegionalizationItems();
    }
  }

  clearBarChartSelecteds() {
    this.barRegionSelecteds = [];
    this.barStrategicAreaSelecteds = [];
  }

  async loadRegionalizationItems() {
    const localityTypeRegionalizationConference = this.checkRegionalization();
    if (localityTypeRegionalizationConference) {
      const result = await this.dashboardSrv.getAllTypeLocalityFromParents(
        this.conference.plan.domain.id,
        localityTypeRegionalizationConference.id
      );
      if (result.success && result.data.length > 0) {
        const localityTypeRegionalizationLevels = result.data;
        this.microregionChartAgroupOptions = localityTypeRegionalizationLevels.map(item => ({
          label: item.name,
          value: item.id
        }));
        this.microregionChartAgroupSelected = this.microregionChartAgroupOptions[0].value;
        this.microregionAgroupLocalityTypeSelected = {
          id: this.microregionChartAgroupOptions[0].value, name: this.microregionChartAgroupOptions[0].label
        };
        this.barRegionSelecteds = [];
        this.barStrategicAreaSelecteds = [];
        await this.handleMicroregionChartAgroupClicked();
      }
    } else {
      this.microregionChartAgroupOptions = [];
      this.microregionChartAgroupSelected = null;
      this.microregionAgroupLocalityTypeSelected = undefined;
      await this.handleMicroregionChartAgroupClicked();
    }
  }

  async loadChartsSelectedResult() {
    await this.clearFilters(false);
    await this.loadRegionStructureConference();
  }

  async handleOriginSelected() {
    this.filters.selectedMeeting = null;
    await this.loadCharts();
  }

  checkRegionalization() {
    const plan = this.conference.plan;
    if (plan && plan.structure) {
      if (plan.structure.regionalization) {
        return plan.localitytype;
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  async loadLocalityCitizenItems() {
    const result = await this.dashboardSrv.getAllTypeLocalityFromParents(
      this.conference.plan.domain.id,
      this.conference.localityType.id
    );
    if (result.success && result.data.length > 0) {
      const typeLocalityCitizenParents = result.data;
      this.microregionChartAgroupOptions = typeLocalityCitizenParents.map(item => ({
        label: item.name,
        value: item.id
      }));
      this.microregionChartAgroupSelected = this.microregionChartAgroupOptions[0].value;
      this.microregionAgroupLocalityTypeSelected = {
        id: this.microregionChartAgroupOptions[0].value, name: this.microregionChartAgroupOptions[0].label
      };
    }
    if (this.itemStructureSelected && this.microregionChartAgroupSelected) { await this.loadCharts(); }
  }

  async loadStructurePlanItemsConference() {
    const plan = this.conference.plan;

    if (plan.structure.hasPlan) {
      const result = await this.structureSrv.listStructureItems(plan.structure.id);
      this.strategicAreaChartStructureLevels = result.success && result.data;
      if (this.strategicAreaChartStructureLevels && this.strategicAreaChartStructureLevels.length > 0) {
        this.itemStructureSelected = this.strategicAreaChartStructureLevels[0];
      }
    }
  }

  async loadMeetingsByConferenceSelected() {
    const result = await this.meetingSrv.getAllMeetingByConferenceCombo(this.conference.id);
    if (result && result.data && result.data.content && result.data.content.length > 0) {
      this.meetingListOptions = result.data.content.filter( m => m.typeMeetingEnum !== 'VIRTUAL').map(meeting => ({
        label: meeting.name,
        value: meeting.id
      }));
      this.filters.selectedMeeting = null;
    }
  }

  validateOriginSelectedPresential() {
    return !(this.filters.selectedOrigin && this.filters.selectedOrigin === 'PRESENTIAL');
  }

  async clearFilters(clearResult = true) {
    this.filters = {
      ...this.filters,
      selectedOrigin: '',
      selectedMeeting: []
    };
    if (clearResult) {
      this.filters.selectedResult = 'HIGHLIGHTS';
    }
    this.microregionChartAgroupSelected = this.microregionChartAgroupOptions[0].value;
    this.microregionAgroupLocalityTypeSelected = {
      id: this.microregionChartAgroupOptions[0].value, name: this.microregionChartAgroupOptions[0].label
    };
    this.microregionChartDisplaySelected = 'VALUE_DESC';
    this.strategicAreaChartDisplaySelected = 'VALUE_DESC';
    this.showMicroregionChart = true;
    this.showStrategicAreaChart = true;
    this.itemStructureSelected = this.strategicAreaChartStructureLevels[0];
    this.clearBarChartSelecteds();
    this.setChartsTitle();
    this.dashboardData = undefined;
    this.dashboardDataResponse = undefined;
    if (clearResult) {
      await this.loadCharts();
    }
  }

  setChartsTitle() {
    const title = this.resultOptions.find(item => item.value === this.filters.selectedResult);
    this.chartsTitleSelected = title.label;
  }

  async handleMicroregionChartAgroupClicked() {
    const optionSelected = this.microregionChartAgroupOptions &&
      this.microregionChartAgroupOptions.find(item => item.value === this.microregionChartAgroupSelected);
    this.microregionAgroupLocalityTypeSelected = optionSelected && { id: optionSelected.value, name: optionSelected.label };
    await this.loadCharts();
  }

  async handleDisplayModeMicroregionChartChange() {
    if (this.dashboardDataResponse.microregionChart && this.dashboardDataResponse.microregionChart.length > 0) {
      switch (this.microregionChartDisplaySelected) {
        case 'VALUE_DESC':
          const microregionChartDataOrderedDesc = Array.from(this.dashboardDataResponse.microregionChart);
          this.dashboardData.microregionChart = microregionChartDataOrderedDesc.sort((a, b) => a.quantity > b.quantity ? -1 : 1);
          break;
        case 'VALUE_ASC':
          const microregionChartDataOrderedAsc = Array.from(this.dashboardDataResponse.microregionChart);
          this.dashboardData.microregionChart = microregionChartDataOrderedAsc.sort((a, b) => a.quantity > b.quantity ? 1 : -1);
          break;
        case 'ALPHABETIC_DESC':
          const microregionChartDataOrderedAlphaDesc = Array.from(this.dashboardDataResponse.microregionChart);

          this.dashboardData.microregionChart = microregionChartDataOrderedAlphaDesc.sort((a, b) => {
            const x = a.description.toUpperCase();
            const y = b.description.toUpperCase();
            return y.localeCompare(x, 'pt');
          });

          break;
        case 'ALPHABETIC_ASC':
          const microregionChartDataOrderedAlphaAsc = Array.from(this.dashboardDataResponse.microregionChart);
          this.dashboardData.microregionChart = microregionChartDataOrderedAlphaAsc.sort((a, b) => {
            const x = a.description.toUpperCase();
            const y = b.description.toUpperCase();
            return x.localeCompare(y, 'pt');
          });
          break;
        case 'TOP_FIVE':
          const microregionChartDataOrderedTopFive = Array.from(this.dashboardDataResponse.microregionChart);
          const microregionTopFive = microregionChartDataOrderedTopFive.sort((a, b) => a.quantity > b.quantity ? -1 : 1);
          this.dashboardData.microregionChart = microregionTopFive.filter((item, index) => index >= 0 && index < 5);
          break;
        case 'TOP_TEN':
          const microregionChartDataOrderedTopTen = Array.from(this.dashboardDataResponse.microregionChart);
          const microregionTopTen = microregionChartDataOrderedTopTen.sort((a, b) => a.quantity > b.quantity ? -1 : 1);
          this.dashboardData.microregionChart = microregionTopTen.filter((item, index) => index >= 0 && index < 10);
          break;
        default:
          break;
      }
    }
  }

  handleDisplayModeStrategicAreaChartChange() {
    if (this.dashboardDataResponse.strategicAreaChart && this.dashboardDataResponse.strategicAreaChart.length > 0) {
      switch (this.strategicAreaChartDisplaySelected) {
        case 'VALUE_DESC':
          const strategicAreaChartDataOrderedDesc = Array.from(this.dashboardDataResponse.strategicAreaChart);
          this.dashboardData.strategicAreaChart = strategicAreaChartDataOrderedDesc.sort((a, b) => a.quantity > b.quantity ? -1 : 1);
          break;
        case 'VALUE_ASC':
          const strategicAreaChartDataOrderedAsc = Array.from(this.dashboardDataResponse.strategicAreaChart);
          this.dashboardData.strategicAreaChart = strategicAreaChartDataOrderedAsc.sort((a, b) => a.quantity > b.quantity ? 1 : -1);
          break;
        case 'ALPHABETIC_DESC':
          const strategicAreaChartDataOrderedAlphaDesc = Array.from(this.dashboardDataResponse.strategicAreaChart);
          this.dashboardData.strategicAreaChart = strategicAreaChartDataOrderedAlphaDesc.sort((a, b) => {
            const x = a.description.toUpperCase();
            const y = b.description.toUpperCase();
            return y.localeCompare(x, 'pt');
          });
          break;
        case 'ALPHABETIC_ASC':
          const strategicAreaChartDataOrderedAlphaAsc = Array.from(this.dashboardDataResponse.strategicAreaChart);
          this.dashboardData.strategicAreaChart = strategicAreaChartDataOrderedAlphaAsc.sort((a, b) => {
            const x = a.description.toUpperCase();
            const y = b.description.toUpperCase();
            return x.localeCompare(y, 'pt');
          });
          break;
        case 'TOP_FIVE':
          const strategicAreaChartDataOrderedTopFive = Array.from(this.dashboardDataResponse.strategicAreaChart);
          const strategicAreaTopFive = strategicAreaChartDataOrderedTopFive.sort((a, b) => a.quantity > b.quantity ? -1 : 1);
          this.dashboardData.strategicAreaChart = strategicAreaTopFive.filter((item, index) => index >= 0 && index < 5);
          break;
        case 'TOP_TEN':
          const strategicAreaChartDataOrderedTopTen = Array.from(this.dashboardDataResponse.strategicAreaChart);
          const strategicAreaTopTen = strategicAreaChartDataOrderedTopTen.sort((a, b) => a.quantity > b.quantity ? -1 : 1);
          this.dashboardData.strategicAreaChart = strategicAreaTopTen.filter((item, index) => index >= 0 && index < 10);
          break;
        default:
          break;
      }
    }
  }

  async loadCharts() {
    const barRegionSelected = this.barRegionSelecteds.length > 0 ? this.barRegionSelecteds[this.barRegionSelecteds.length - 1].id : null;
    const barStrategicAreaSelected = (this.barStrategicAreaSelecteds && this.barStrategicAreaSelecteds.length) > 0 ?
      this.barStrategicAreaSelecteds[this.barStrategicAreaSelecteds.length - 1].id : null;
    const result = await this.dashboardSrv.getDashboardData(
      this.conference.id,
      this.filters.selectedResult,
      this.filters.selectedOrigin,
      this.filters.selectedMeeting,
      this.microregionChartAgroupSelected,
      barRegionSelected,
      !this.showMicroregionChart,
      this.itemStructureSelected.id,
      barStrategicAreaSelected,
      !this.showStrategicAreaChart
    );
    if (result.success) {
      this.dashboardDataResponse = Object.assign({}, result.data);
      this.dashboardData = Object.assign({}, result.data);
      await this.handleDisplayModeMicroregionChartChange();
      this.handleDisplayModeStrategicAreaChartChange();
    }
  }

  async handleStrategicAreaChartClicked(event) {
    const selectedIndex = (Array.isArray(event) && event.length > 0) ? event[0]._index : undefined;
    if (selectedIndex >= 0) {
      const indexStructureItemSelected =
        this.strategicAreaChartStructureLevels.findIndex(item => item.id === this.itemStructureSelected.id);
      if (indexStructureItemSelected > -1) {
        if (indexStructureItemSelected === this.strategicAreaChartStructureLevels.length - 1) {
          this.showStrategicAreaChart = false;
          if (this.barStrategicAreaSelecteds.length > 0) {
            this.barStrategicAreaSelecteds.push(this.dashboardData.strategicAreaChart[selectedIndex]);
          } else {
            this.barStrategicAreaSelecteds = [this.dashboardData.strategicAreaChart[selectedIndex]];
          }
        } else {
          if (this.barStrategicAreaSelecteds.length > 0) {
            this.barStrategicAreaSelecteds.push(this.dashboardData.strategicAreaChart[selectedIndex]);
          } else {
            this.barStrategicAreaSelecteds = [this.dashboardData.strategicAreaChart[selectedIndex]];
          }
          this.itemStructureSelected = this.strategicAreaChartStructureLevels[indexStructureItemSelected + 1];
        }
      }
      await this.loadCharts();
      if (!this.showMicroregionChart) {
        this.dashboardData.microregionChart = undefined;
      }
      if (!this.showStrategicAreaChart) {
        this.dashboardData.strategicAreaChart = undefined;
      }
    }

  }

  async handleMicroregionChartClicked(event) {
    const selectedIndex = (Array.isArray(event) && event.length > 0) ? event[0]._index : undefined;
    if (selectedIndex >= 0) {
      const indexGroupSelected =
        this.microregionChartAgroupOptions.findIndex(option => option.value === this.microregionChartAgroupSelected);
      if (indexGroupSelected > -1) {
        if (indexGroupSelected === this.microregionChartAgroupOptions.length - 1) {
          this.showMicroregionChart = false;
          if (this.barRegionSelecteds.length > 0) {
            this.barRegionSelecteds.push(this.dashboardData.microregionChart[selectedIndex]);
          } else {
            this.barRegionSelecteds = [this.dashboardData.microregionChart[selectedIndex]];
          }
        } else {
          if (this.barRegionSelecteds.length > 0) {
            this.barRegionSelecteds.push(this.dashboardData.microregionChart[selectedIndex]);
          } else {
            this.barRegionSelecteds = [this.dashboardData.microregionChart[selectedIndex]];
          }
          this.microregionChartAgroupSelected = this.microregionChartAgroupOptions[indexGroupSelected + 1].value;
          this.microregionAgroupLocalityTypeSelected = {
            id: this.microregionChartAgroupOptions[indexGroupSelected + 1].value,
            name: this.microregionChartAgroupOptions[indexGroupSelected + 1].label
          };
        }
      }
      await this.loadCharts();
      if (!this.showMicroregionChart) {
        this.dashboardData.microregionChart = undefined;
      }
      if (!this.showStrategicAreaChart) {
        this.dashboardData.strategicAreaChart = undefined;
      }
    }
  }

  async handleBackRegionChartClicked() {
    const indexRegionGroupBar = this.microregionChartAgroupOptions.findIndex(item => item.value === this.microregionChartAgroupSelected);
    if (indexRegionGroupBar > -1) {
      if (this.showMicroregionChart) {
        this.microregionChartAgroupSelected = (indexRegionGroupBar > 0) ?
          this.microregionChartAgroupOptions[indexRegionGroupBar - 1].value :
          this.microregionChartAgroupOptions[indexRegionGroupBar].value;
        this.microregionAgroupLocalityTypeSelected = (indexRegionGroupBar > 0) ? {
          id: this.microregionChartAgroupOptions[indexRegionGroupBar - 1].value,
          name: this.microregionChartAgroupOptions[indexRegionGroupBar - 1].label
        } : {
          id: this.microregionChartAgroupOptions[indexRegionGroupBar].value,
          name: this.microregionChartAgroupOptions[indexRegionGroupBar].label
        };
        this.barRegionSelecteds.pop();
      } else {
        this.showMicroregionChart = true;
        this.barRegionSelecteds.pop();
      }
    }
    await this.loadCharts();
    if (!this.showMicroregionChart) {
      this.dashboardData.microregionChart = undefined;
    }
    if (!this.showStrategicAreaChart) {
      this.dashboardData.strategicAreaChart = undefined;
    }
  }

  async handleBackStrategicAreaChartClicked() {
    const indexStructureItemLevel = this.strategicAreaChartStructureLevels.findIndex(item => item.id === this.itemStructureSelected.id);
    if (indexStructureItemLevel > -1) {
      if (this.showStrategicAreaChart) {
        this.itemStructureSelected = (indexStructureItemLevel > 0) ? this.strategicAreaChartStructureLevels[indexStructureItemLevel - 1] :
          this.strategicAreaChartStructureLevels[indexStructureItemLevel];
        this.barStrategicAreaSelecteds.pop();
      } else {
        this.showStrategicAreaChart = true;
        this.barStrategicAreaSelecteds.pop();
      }
    }
    await this.loadCharts();
    if (!this.showMicroregionChart) {
      this.dashboardData.microregionChart = undefined;
    }
    if (!this.showStrategicAreaChart) {
      this.dashboardData.strategicAreaChart = undefined;
    }
  }

}

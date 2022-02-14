import { HttpRequestInterceptorModule } from './shared/interceptors/http-request.interceptor.module';
import { InputMessageComponent } from './components/input-message/input-message.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ListboxModule } from 'primeng/listbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { MultiSelectModule } from 'primeng/multiselect';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MenuModule} from 'primeng/menu';
import { LoginComponent } from './pages/login/login.component';
import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';
import { TemplateComponent } from './components/template/template.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { RecaptchaModule } from 'ng-recaptcha';
import { HomeComponent } from './pages/home/home.component';
import { ConferenceMapComponent } from './pages/conference-map/conference-map.component';
import { FooterComponent } from './components/footer/footer.component';
import { StrategicAreaComponent } from './pages/strategic-area/strategic-area.component';
import { ConferenceStepsComponent } from './pages/conference-steps/conference-steps.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { ProposalsComponent } from './pages/proposals/proposals.component';

import { ModalComponent } from './components/modal/modal.component';
import { HowItWorksSlimComponent } from './pages/how-it-works-slim/how-it-works-slim.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ParticipationsComponent } from './pages/participations/participations.component';
import { PreOpeningComponent } from './pages/pre-opening/pre-opening.component';
import { PostClosureComponent } from './pages/post-closure/post-closure.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { HeatMapComponent } from './pages/statistics/graphs/heat-map/heat-map.component';
import { HorizontalBarGraphComponent } from './pages/statistics/graphs/horizontal-bar-graph/horizontal-bar-graph.component';
import { StartComponent } from './pages/start/start.component';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { TriStateCheckboxModule } from 'primeng/components/tristatecheckbox/tristatecheckbox';

registerLocaleData(localePtBr);

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    CompleteProfileComponent,
    TemplateComponent,
    HeaderComponent,
    MenuComponent,
    BreadcrumbComponent,
    InputMessageComponent,
    HomeComponent,
    ConferenceMapComponent,
    FooterComponent,
    StrategicAreaComponent,
    HowItWorksComponent,
    HowItWorksSlimComponent,
    ProposalsComponent,
    ConferenceStepsComponent,
    ModalComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ParticipationsComponent,
    PreOpeningComponent,
    PostClosureComponent,
    ProfileComponent,
    StatisticsComponent,
    HeatMapComponent,
    HorizontalBarGraphComponent,
  ],
  imports: [
    FontAwesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    ListboxModule,
    DialogModule,
    ToastModule,
    ReactiveFormsModule,
    HttpRequestInterceptorModule,
    FormsModule,
    RecaptchaModule,
    TooltipModule,
    DropdownModule,
    ChartModule,
    MultiSelectModule,
    MenuModule,
    TriStateCheckboxModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    JwtHelperService,
    { provide: LOCALE_ID, useValue: "pt" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

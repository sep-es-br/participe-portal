import { HttpRequestInterceptorModule } from './shared/interceptors/http-request.interceptor.module';
import { InputMessageComponent } from './components/input-message/input-message.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
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

import { LoginComponent } from './pages/login/login.component';
import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';
import { TemplateComponent } from './components/template/template.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { HomeComponent } from './pages/home/home.component';
import { ConferenceMapComponent } from './pages/conference-map/conference-map.component';
import { FooterComponent } from './components/footer/footer.component';
import { StrategicAreaComponent } from './pages/strategic-area/strategic-area.component';
import { ConferenceStepsComponent } from './pages/conference-steps/conference-steps.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { ProposalsComponent } from './pages/proposals/proposals.component';

import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
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
    ProposalsComponent,
    ConferenceStepsComponent,
    HowItWorksComponent,
    ModalComponent
  ],
  imports: [
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
    FormsModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

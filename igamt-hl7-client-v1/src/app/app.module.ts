import {NgModule, ErrorHandler} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {AlertModule} from 'ngx-bootstrap';
import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ColorPickerModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import {SelectItemGroup} from 'primeng/api';

import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OrganizationChartModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';

import {KeyFilterModule} from 'primeng/keyfilter';
import {MessageModule} from 'primeng/message';

import { TreeTableModule } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy, CommonModule, APP_BASE_HREF} from '@angular/common';
import { DocumentationComponent } from './documentation/documentation.component';
import {WorkspaceService} from './service/workspace/workspace.service';
import {IndexedDbService} from './service/indexed-db/indexed-db.service';
import {AppRoutes} from './app.routes';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {GeneralConfigurationService} from './service/general-configuration/general-configuration.service';

// import {ProfileComponentsService} from './service/profilecomponents/profilecomponents.service';
import {AuthService} from './login/auth.service';
import {AuthGuard} from './login/auth-guard.service';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './requestInterceptor';
import {UserService} from './service/userService/user.service';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {NotFoundComponent} from './common/404/404.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { TreeModule } from 'angular-tree-component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {BreadcrumbService} from './breadcrumb.service';
import {SectionsService} from './service/sections/sections.service';

import {TableOptionsService} from './service/configuration/table-options/table-options.service';
// import {NgDragDropModule} from 'ng-drag-drop';
import { ResetPasswordRequestComponent } from './reset-password/reset-password-request/reset-password-request.component';
import { ResetPasswordConfirmComponent } from './reset-password/reset-password-confirm/reset-password-confirm.component';
import {ResetPasswordService} from "./reset-password/reset-password.service";
import {ExportFontService} from "./service/configuration/export-font/export-font.service";
import { ErrorComponent } from './error/error.component';
import {ErrorResolver} from "./error/error.resolver";
import {ErrorService} from "./error/error.service";
import { CrossReferenceComponent } from './common/cross-reference/cross-reference.component';
import {MessageService} from "primeng/components/common/messageservice";
import {BlockUIModule} from 'primeng/blockui';
import {ProgressHandlerService} from "./service/progress-handler.service";
import {GrowlModule} from 'primeng/growl';
import {GlobalErrorHandler} from "./utils/client-error-handler";
import {RoutingStateService} from "./url/routing-state.service";
import {ClientErrorHandlerService} from "./utils/client-error-handler.service";
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from "primeng/components/confirmdialog/confirmdialog";
import { DialogWrapperComponent } from './dialog-wrapper/dialog-wrapper.component';
import {ReportService} from "./dialog-wrapper/report.service";
import {DisplayService} from "./display/display.service";
import { ElementLabelComponent } from './common/element-label/element-label.component';
import { ValuesetDeltaColComponent } from './common/tree-table/valueset/valueset-delta-col/valueset-delta-col.component';
import { DeltaHeaderComponent } from './common/delta/delta-header/delta-header.component';

@NgModule({
    imports: [
        BrowserModule,
        TreeModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,

ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        SharedModule,
        ContextMenuModule,
        DataGridModule,
        DataListModule,
        DataScrollerModule,
        DataTableModule,
        DialogModule,
        DragDropModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        KeyFilterModule,
        GMapModule,
        GrowlModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        BlockUIModule,
        ListboxModule,
        MegaMenuModule,
        MessageModule,
        MenuModule,
        MenubarModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScheduleModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        ProgressSpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeTableModule,
        CommonModule,
        ReactiveFormsModule,
      OrganizationChartModule,

        AlertModule.forRoot()

    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppComponent,
        HomeComponent,
        AboutComponent,
        DocumentationComponent,
        AppMenuComponent,
        AppTopBarComponent,
        AppFooterComponent,
        NotFoundComponent,
        LoginComponent,
        RegisterComponent,
        DocumentationComponent,
        AppBreadcrumbComponent,
        ResetPasswordRequestComponent,
        ResetPasswordConfirmComponent,
        ErrorComponent,
        DialogWrapperComponent
    ], providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
        WorkspaceService,
        ErrorResolver,
        ErrorService,
        GlobalErrorHandler,
        ResetPasswordService,
        GeneralConfigurationService,
        IndexedDbService,
        SectionsService,
        AuthService,
        AuthGuard,
        UserService,
        BreadcrumbService,
        TableOptionsService,
        ExportFontService,
        MessageService,
        ProgressHandlerService,
        RoutingStateService,
        ClientErrorHandlerService,
        ConfirmationService,
        ReportService,
    DisplayService
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }

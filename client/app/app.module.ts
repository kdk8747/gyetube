import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { GroupComponent, ProceedingComponent, ProceedingWritingFrameComponent } from './group';
import { PolicyComponent, PolicyWritingFrameComponent, PolicyChangesetComponent } from './group';

import { ActivityService, PolicyService, PolicyChangesetService, ProceedingService, ReceiptService, UserService } from './_services';

import { AppRoutingModule }     from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    GroupComponent,
    ProceedingComponent,
    ProceedingWritingFrameComponent,
    PolicyComponent,
    PolicyWritingFrameComponent,
    PolicyChangesetComponent
  ],
  providers: [
    ActivityService,
    PolicyService,
    PolicyChangesetService,
    ProceedingService,
    ReceiptService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
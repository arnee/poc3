import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { ACL_POLICY_CONTENT_TOKEN, AclModule } from '@itmp/acl/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

const POLICY_CONTENT = `
# hide the machine's sun button
*, weather/machine/sun,, view, deny

# hide the back to Normal Button
*, weather/machine/normal,, view, deny

# Oh this rule has the effect, that the "back to normal" button is disabled
# this works through a manual canEdit$ query on the service
# there is no template directive for this
*, weather/machine/normal,, edit, deny

# Oh we can reveal a monster that fits the dramatic weather
## *, monster-machine,, view, allow
## *, monster-machine/monster-type,, edit, allow
## *, monster-machine/monster-name,, edit, allow


# as everything is allowed by default let's sneak in some rules
# to stage our example
*, monster-machine,, view, deny
*, monster-machine/monster-type,, edit, deny
*, monster-machine/monster-name,, edit, deny

*, *,, view, allow
*, *,, edit, allow
`
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NdbxIconModule,
    AclModule,
    NoopAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: ACL_POLICY_CONTENT_TOKEN,
      useValue: POLICY_CONTENT
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

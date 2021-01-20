import { Component, Inject, OnDestroy } from '@angular/core';
import { AclService } from '@itmp/acl/angular';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { autoFormBindingFactory } from '@itmp/acl/form-support';

enum WEATHER {
  SUN = "☀️️️",
  RAIN = "🌧️️",
  STORM = "⛈️️",
  SNOW = "🌨☃️️️"
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
    :host {
        display: block;
        max-width: 400px;
        font-size: 120%;
        padding: 10px;
    }
    .emoji {
        font-size: 100px;
        line-height: 100px;
        display: block;
    }
  `]
})
export class AppComponent implements OnDestroy{
  title = 'acl-basic-usage';

  sun = WEATHER.SUN
  rain = WEATHER.RAIN
  storm = WEATHER.STORM
  snow = WEATHER.SNOW
  isWeatherResetDisabled$: Observable<boolean>

  myMonsterForm: FormGroup;
  formSubscription: Subscription;

  constructor(@Inject(AclService) private aclService: AclService) {
    /**
     * That's how you can manually query for a value. We use this observable to forward
     * it easily to a button we want to control through ACL.
     * For Angular Reactive Forms you can use a specialized helper demonstrated in "createFormAndBindToAcl()"
     */
    this.isWeatherResetDisabled$ = this.aclService.canEdit$('weather/machine/normal').pipe(map(value => !value))

    this.createFormAndBindToAcl();
  }

  /**
   *
   */
  createFormAndBindToAcl() {
    /**
     * Let's create a reactive form which will be used in the template
     * This form is not magically available through ACL. Neither the involved
     * FormControls nor the matching template parts.
     *
     * That's why you have to do two things as a developer
     * 1) Create a binding function with autoFormBindingFactory()
     * which you can use to bind any FormGroup to ACL.
     *
     * The paths of the FormGroup like monsterMachine.monsterType will be translated
     * into an appropriate acl key "monster-type/monster-type" for all form controls.
     * Form Groups itself are ignored byt incorporated in the entire path building (like monsterMachine here).
     *
     * Once bound you can enable or disable FormControls with matching ACL rules:
     * *, monster-machine/monster-type,, edit, deny
     *
     * You can also remove the controls:
     * *, monster-machine/monster-type,, view, deny
     *
     * but for this you need to tag the template part with the identical key "monster-type/monster-type".
     * Either implicit through the aclTag hierarchy (like here in the template) or by passing the full path. In
     * both variants you need to be aware what ACL resources are created by the binding factory.
     *
     * That's the relevant code where you can see that aclTag always appears near the formGroup or formControl
     * name assignments to ensure if the control is removed (view denied) that the template is also removed. Otherwise
     * it will throw an error as the given formControl is not available anymore. Try this by remo
     * ```
     *    <div formGroupName="monsterMachine" *aclTag="'monster-machine'">
     *    <select *aclTag="'monster-type'"
     *    <input  *aclTag="'monster-name'" formControlName="monsterName"
     * ```
     *
     *
     *
     * This is a shortcoming induced by the way ReactiveForms works in two worlds (Code & Template)
     * and we have currently no way of tackling it with automation.
     */
    this.myMonsterForm = new FormGroup({
      monsterMachine: new FormGroup({
        monsterType: new FormControl(),
        monsterName: new FormControl()
      })
    })

    const formBindingFn = autoFormBindingFactory()
    const formBinding = formBindingFn(this.aclService, this.myMonsterForm)

    /**
     * Subscribe to start the binding processing.
     * this will automatically create resource names from the form group hierarchy
     * in this case monster-machine/monster-name & monster-machine/monster-type (camelcase to cash-case)
     */
    this.formSubscription = formBinding.stream$.pipe().subscribe()
  }

  makeSun() {
    this.sun =WEATHER.SUN
    this.rain = WEATHER.SUN
    this.storm = WEATHER.SUN
    this.snow = WEATHER.SUN
  }

  reset () {
    this.sun =WEATHER.SUN
    this.rain = WEATHER.RAIN
    this.storm = WEATHER.STORM
    this.snow = WEATHER.SNOW
  }
  get monsterType() {
    return this.myMonsterForm.value.monsterMachine?.monsterType;
  }

  get monsterName() {
    return this.myMonsterForm.value.monsterMachine?.monsterName;
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }
}

import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from "@angular/core";

import { CommonModule } from "@angular/common";

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from "@angular/forms";

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";

import { Question } from "../../../../models/question.model";
import { QuestionType } from "../../../../models/question-type.enum";

import { QuestionValidatorService } from "../../../../services/question-validator.service";

import { KPhoneComponent } from "src/app/shared/keh-ui/k-phone/k-phone.component";
import { KAddressComponent } from "src/app/shared/keh-ui/k-address/k-address.component";
import { KLocationComponent } from "src/app/shared/keh-ui/k-location/k-location.component";
import { KMapComponent } from "src/app/shared/keh-ui/k-map/k-map.component";
import { KPasswordComponent } from "src/app/shared/keh-ui/k-password/k-password.component";
import { KUrlComponent } from "src/app/shared/keh-ui/k-url/k-url.component";
import { KColorComponent } from "src/app/shared/keh-ui/k-color/k-color.component";
import { KRangeComponent } from "src/app/shared/keh-ui/k-range/k-range.component";
import { KHiddenComponent } from "src/app/shared/keh-ui/k-hidden/k-hidden.component";
import { KDividerComponent } from "src/app/shared/keh-ui/k-divider/k-divider.component";
import { KHtmlComponent } from "src/app/shared/keh-ui/k-html/k-html.component";
import { KLabelComponent } from "src/app/shared/keh-ui/k-label/k-label.component";
import { KEmailComponent } from "src/app/shared/keh-ui/k-email/k-email.component";
import { KTitleComponent } from "src/app/shared/keh-ui/k-title/k-title.component";
import { KSectionComponent } from "src/app/shared/keh-ui/k-section/k-section.component";
import { KParagraphComponent } from "src/app/shared/keh-ui/k-paragraph/k-paragraph.component";
import { KTextComponent } from "src/app/shared/keh-ui/k-text/k-text.component";
import { KTextareaComponent } from "src/app/shared/keh-ui/k-textarea/k-textarea.component";
import { KNumberComponent } from "src/app/shared/keh-ui/k-number/k-number.component";
import { KDateComponent } from "src/app/shared/keh-ui/k-date/k-date.component";
import { KTimeComponent } from "src/app/shared/keh-ui/k-time/k-time.component";
import { KDatetimeComponent } from "src/app/shared/keh-ui/k-datetime/k-datetime.component";
import { KSelectComponent } from "src/app/shared/keh-ui/k-select/k-select.component";
import { KRadioComponent } from "src/app/shared/keh-ui/k-radio/k-radio.component";
import { KCheckboxComponent } from "src/app/shared/keh-ui/k-checkbox/k-checkbox.component";
import { KSwitchComponent } from "src/app/shared/keh-ui/k-switch/k-switch.component";
import { KFileComponent } from "src/app/shared/keh-ui/k-file/k-file.component";
import { KImageComponent } from "src/app/shared/keh-ui/k-image/k-image.component";
import { KSignatureComponent } from "src/app/shared/keh-ui/k-signature/k-signature.component";
import { KRatingComponent } from "src/app/shared/keh-ui/k-rating/k-rating.component";
import { KScaleComponent } from "src/app/shared/keh-ui/k-scale/k-scale.component";
import { KQrComponent } from "src/app/shared/keh-ui/k-qr/k-qr.component";
import { KBarcodeComponent } from "src/app/shared/keh-ui/k-barcode/k-barcode.component";

@Component({
  selector: "app-preview-renderer",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,

    KPhoneComponent,
    KAddressComponent,
    KLocationComponent,
    KMapComponent,
    KPasswordComponent,
    KUrlComponent,
    KColorComponent,
    KRangeComponent,
    KHiddenComponent,
    KDividerComponent,
    KHtmlComponent,
    KLabelComponent,

    KEmailComponent,

    KTitleComponent,
    KSectionComponent,
    KParagraphComponent,

    KTextComponent,
    KTextareaComponent,
    KNumberComponent,

    KDateComponent,
    KTimeComponent,
    KDatetimeComponent,

    KSelectComponent,
    KRadioComponent,
    KCheckboxComponent,
    KSwitchComponent,

    KFileComponent,
    KImageComponent,
    KSignatureComponent,

    KRatingComponent,
    KScaleComponent,

    KQrComponent,
    KBarcodeComponent
  ],
  templateUrl: "./preview-renderer.component.html",
  styleUrl: "./preview-renderer.component.scss"
})
export class PreviewRendererComponent implements OnInit, OnChanges {

  @Input({ required: true })
  Question!: Question;

  @Input()
  control: FormControl = new FormControl();

  QuestionType = QuestionType;

  value: any = "";
  errorMessage: string | null = null;

  constructor(
    private validator: QuestionValidatorService
  ) {}

  ngOnInit(): void {
    this.ensureControl();
    this.value = this.Question?.defaultValue ?? "";
  }

  ngOnChanges(): void {

    this.ensureControl();

    this.value =
      this.control.value ??
      this.Question.defaultValue ??
      "";

    if (this.Question.disabled) {

      this.control.disable({
        emitEvent:false
      });

    }
    else {

      this.control.enable({
        emitEvent:false
      });

    }
  }

  private ensureControl(): void {
    if (!this.control) {
      this.control = new FormControl();
    }
  }



  onValueChange(value:any){
    this.value=value;
    this.control.setValue(value);
    this.validate(value);
  }


  onBlur(): void {
    this.validate(this.value);
  }

  validate(value: any): void {
    if (!this.Question) {
      return;
    }

    const result = this.validator.validate(
      this.Question,
      value
    );

    this.errorMessage = result.valid
      ? null
      : result.message ?? null;
  }

  get minScale() {
    return this.Question.minScale ?? 1;
  }

  get maxScale() {
    return this.Question.maxScale ?? 10;
  }

  get step() {
    return this.Question.step ?? 1;
  }

  get defaultValue() {
    return this.Question.defaultValue ?? null;
  }

  isReadonly() {
    return this.Question.readOnly === true;
  }

  isRequired() {
    return this.Question.required === true;
  }

  getRatingStars() {
    const max = this.Question.maxScale ?? 5;

    return Array(max)
      .fill(0)
      .map((_, index) => index + 1);
  }

}
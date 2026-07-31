import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Question
} from 'src/app/features/forms/models/question.model';



@Component({

  selector:'app-k-map',

  standalone:true,

  imports:[

    CommonModule

  ],

  templateUrl:'./k-map.component.html',

  styleUrl:'./k-map.component.scss'

})
export class KMapComponent {


  @Input({required:true})
  Question!: Question;





  get latitude():number {


    return (

      this.Question?.defaultValue?.latitude ??

      this.Question?.latitude ??

      -18.8792

    );


  }







  get longitude():number {


    return (

      this.Question?.defaultValue?.longitude ??

      this.Question?.longitude ??

      47.5079

    );


  }







  get zoom():number {


    return (

      this.Question?.zoom ??

      13

    );


  }







  get provider():string {


    return (

      this.Question?.mapProvider ??

      'openstreetmap'

    );


  }







  openMap():void {


    const url =


      `https://www.openstreetmap.org/?mlat=${this.latitude}` +

      `&mlon=${this.longitude}` +

      `#map=${this.zoom}/${this.latitude}/${this.longitude}`;



    window.open(

      url,

      this.Question.openInNewTab === false

        ? '_self'

        : '_blank'

    );


  }


}
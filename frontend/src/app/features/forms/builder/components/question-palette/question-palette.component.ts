import {
  Component,
  EventEmitter,
  Output,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';

import { QuestionType } from '../../../models/question-type.enum';


@Component({

  selector: 'app-question-palette',

  standalone:true,

  imports:[

    CommonModule,

    MatIconModule,

    MatTooltipModule,
    
    QuestionPaletteComponent

  ],

  templateUrl:'./question-palette.component.html',

  styleUrl:'./question-palette.component.scss'

})
export class QuestionPaletteComponent {


  @Output()
  questionAdded =
    new EventEmitter<QuestionType>();


  isOpen = false;



  questionGroups = [

    {
      label:'Basic',

      items:[

        {
          type:QuestionType.TEXT,
          label:'Text',
          icon:'short_text'
        },

        {
          type:QuestionType.TEXTAREA,
          label:'Textarea',
          icon:'notes'
        },

        {
          type:QuestionType.NUMBER,
          label:'Number',
          icon:'pin'
        },

        {
          type:QuestionType.SELECT,
          label:'Select',
          icon:'arrow_drop_down_circle'
        },

        {
          type:QuestionType.RADIO,
          label:'Radio',
          icon:'radio_button_checked'
        },

        {
          type:QuestionType.CHECKBOX,
          label:'Checkbox',
          icon:'check_box'
        },

        {
          type:QuestionType.SWITCH,
          label:'Switch',
          icon:'toggle_on'
        }

      ]

    },



    {
      label:'Structure',

      items:[

        {
          type:QuestionType.TITLE,
          label:'Title',
          icon:'title'
        },

        {
          type:QuestionType.SECTION,
          label:'Section',
          icon:'view_agenda'
        },

        {
          type:QuestionType.PARAGRAPH,
          label:'Paragraph',
          icon:'article'
        }

      ]

    },



    {
      label:'Contact',

      items:[

        {
          type:QuestionType.EMAIL,
          label:'Email',
          icon:'email'
        },

        {
          type:QuestionType.PHONE,
          label:'Phone',
          icon:'phone'
        }

      ]

    },



    {
      label:'Date & Time',

      items:[

        {
          type:QuestionType.DATE,
          label:'Date',
          icon:'calendar_today'
        },

        {
          type:QuestionType.TIME,
          label:'Time',
          icon:'schedule'
        },

        {
          type:QuestionType.DATETIME,
          label:'DateTime',
          icon:'event'
        }

      ]

    },



    {
      label:'Advanced',

      items:[

        {
          type:QuestionType.FILE,
          label:'File',
          icon:'upload_file'
        },

        {
          type:QuestionType.IMAGE,
          label:'Image',
          icon:'image'
        },

        {
          type:QuestionType.QR,
          label:'QR Code',
          icon:'qr_code'
        }

      ]

    }


  ];





  toggleMenu(){

    this.isOpen = !this.isOpen;

  }





  closeMenu(){

    this.isOpen = false;

  }





  addQuestion(type:QuestionType){

    this.questionAdded.emit(type);

    this.closeMenu();

  }





  @HostListener(
    'document:click',
    ['$event']
  )

  clickOutside(event:MouseEvent){


    const target =
      event.target as HTMLElement;



    if(
      !target.closest('.palette')
    ){

      this.closeMenu();

    }


  }



}
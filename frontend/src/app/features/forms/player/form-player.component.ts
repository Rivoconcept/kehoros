import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({

selector:'app-form-player',

standalone:true,

imports:[
 CommonModule
],

template:`

<div class="page">

<h1>
Questionnaire
</h1>

<p>
Répondre au formulaire attribué
</p>

</div>

`

})
export class FormPlayerComponent {


}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({

selector:'app-assignment',

standalone:true,

imports:[
 CommonModule
],

template:`

<div class="page">

<h1>
Attribution des formulaires
</h1>

<p>
Affecter un Questionnaire aux collaborateurs
</p>

</div>

`

})
export class AssignmentComponent {


}
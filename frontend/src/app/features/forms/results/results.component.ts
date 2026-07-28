import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({

selector:'app-results',

standalone:true,

imports:[
 CommonModule
],

template:`

<div class="page">

<h1>
Résultats
</h1>

<p>
Analyse des réponses
</p>

</div>

`

})
export class ResultsComponent {


}
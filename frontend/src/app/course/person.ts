

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-person',
  standalone: true,
  templateUrl: './person.html',
  imports: [FormsModule]
})
export class Person {
  name = 'Robert';

  message = "Salut"

  count = 0

  buttonDisabled = false


  incrementCount() {
    this.count++;
  }

  logKey(event: KeyboardEvent) {
    this.name = event.key
  }

    //   Control flow

    a = 10
    b = 10

    family = [
        {id: 1, name: "Jean", age: "18"},
        {id: 2, name: "Ben", age: "36"},
        {id: 3, name: "Chris", age: "20"},
    ]

    // signals concept
    res = signal(0)

    constructor() {
        setTimeout(() => (this.res.set(30)), 2000)
    } 

    quantity = signal(1)
    price =  signal(10)

    total = computed(() => this.quantity() * this.price())
        
}


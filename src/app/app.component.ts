import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Quiz';
  preguntas: any[] = [];
  indiceActual = 0;
  respuestaSelecionada = '';
  puntuacion = 0;
  respuestas: any[] = [];
  quizTerminado = false;
  Formulario = false;
  PantallaP = true;

  tiempo: number = 10; // segundos por pregunta
intervalo: any;

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.http.get<any>('preguntas.json')
    .subscribe(data => {
      console.log(data);
      this.preguntas = data;
    });
  }
  seleccionarRespuesta(opcion: string){
    this.respuestaSelecionada = opcion;
    console.log("Seleccionó:", opcion);
  }
  
  inicio(){
    this.PantallaP = false;
    this.Formulario = true;
    this.iniciarTemporizador();
    }
  
  iniciarTemporizador() {
  this.intervalo = setInterval(() => {
    this.tiempo--;

    if (this.tiempo === 0) {
      this.siguientePregunta();
    }

  }, 1000);
  }

  detenerTemporizador() {
  clearInterval(this.intervalo);
  }

  siguientePregunta(){
    this.detenerTemporizador();
    if(this.indiceActual < this.preguntas.length - 1){
      
      this.indiceActual++;
    } else {
      console.log('¡Has completado el quiz!');
      console.log('Puntuación final:', this.puntuacion);
      this.Formulario = false;
      this.quizTerminado = true;
    }
    this.verificarRespuesta();
    console.log(this.indiceActual);
    this.tiempo = 10; // reinicia tiempo
    this.iniciarTemporizador();
  }
    
  verificarRespuesta(){
      if(this.respuestaSelecionada === this.preguntas[this.indiceActual-1].respuestaCorrecta){
        this.puntuacion++;
        console.log('¡Respuesta correcta!');
      }
      else if(!this.respuestaSelecionada){
        this.respuestaSelecionada = '';
        console.log('la respuesta selccionada es vacia');
      }
      else{
        console.log('Respuesta incorrecta. Inténtalo de nuevo.');
      }

      this.respuestas.push(this.respuestaSelecionada);
      this.respuestaSelecionada = '';
    }
}  

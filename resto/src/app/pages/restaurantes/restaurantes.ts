import { Component, OnInit } from '@angular/core';
import { restaurante } from '../../models/restaurante';
import { restauranteService } from '../../services/restauranteService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurantes.html',
  styleUrl: './restaurantes.css',
})
export class Restaurantes implements OnInit {
  restaurantes: restaurante[] = [];
  modelo: Partial<restaurante> = {};
  mostrarformulario = false;

  constructor(private serviciorestaurante: restauranteService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.restaurantes = this.serviciorestaurante.getAll();
    this.modelo = {};
    this.mostrarformulario = false;
  }

  abrirformulario() {
    this.modelo = {};
    this.mostrarformulario = true;
  }

  cerrarformulario() {
    this.modelo = {};
    this.mostrarformulario = false;
  }

  guardar() {
    if (!this.modelo.nombre || !this.modelo.nombre.toString().trim()) return;
    const nombre = this.modelo.nombre.toString().trim();
    if (this.modelo.id) {
      this.serviciorestaurante.update({ id: this.modelo.id as number, nombre });
    } else {
      this.serviciorestaurante.create(nombre);
    }
    this.cargar();
  }

  editar(r: restaurante) {
    this.modelo = { id: r.id, nombre: r.nombre };
    this.mostrarformulario = true;
  }

  eliminar(id: number) {
    if (!confirm('Eliminar restaurante?')) return;
    const ok = this.serviciorestaurante.delete(id);
    if (!ok) {
      alert('No se puede eliminar el restaurante porque tiene zonas asociadas');
      return;
    }
    this.cargar();
  }
}

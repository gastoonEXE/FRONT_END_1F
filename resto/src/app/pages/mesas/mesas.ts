import { Component, OnInit } from '@angular/core';
import { mesa } from '../../models/mesa';
import { mesaService } from '../../services/mesaService';
import { zona } from '../../models/zona';
import { zonaService } from '../../services/zonaService';
import { restaurante } from '../../models/restaurante';
import { restauranteService } from '../../services/restauranteService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas.html',
  styleUrl: './mesas.css',
})
export class Mesas implements OnInit {
  mesas: mesa[] = [];
  modelo: Partial<mesa> = {};
  listazonas: zona[] = [];
  listarestaurantes: restaurante[] = [];
  seleccionrestaurante: number | undefined;
  mostrarformulario = false;

  constructor(
    private serviciomesa: mesaService,
    private serviciozona: zonaService,
    private serviciorestaurante: restauranteService
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.mesas = this.serviciomesa.obtenerTodos();
    this.listazonas = this.serviciozona.obtenerTodos();
    this.listarestaurantes = this.serviciorestaurante.getAll();
    this.modelo = {};
    this.seleccionrestaurante = undefined;
    this.mostrarformulario = false;
  }

  abrirformulario() {
    this.modelo = {};
    this.seleccionrestaurante = undefined;
    this.mostrarformulario = true;
  }

  cerrarformulario() {
    this.modelo = {};
    this.seleccionrestaurante = undefined;
    this.mostrarformulario = false;
  }

  guardar() {
    if (!this.modelo.numero) return;
    if (!this.modelo.capacidad) return;
    if (!this.modelo.zona_id) return;
    const numero = Number(this.modelo.numero);
    const capacidad = Number(this.modelo.capacidad);
    const zona_id = Number(this.modelo.zona_id);
    if (this.modelo.id) {
      this.serviciomesa.actualizar({ id: this.modelo.id as number, numero, capacidad, zona_id });
    } else {
      this.serviciomesa.crear(numero, capacidad, zona_id);
    }
    this.cargar();
  }

  editar(m: mesa) {
    this.modelo = { id: m.id, numero: m.numero, capacidad: m.capacidad, zona_id: m.zona_id };
    const z = this.listazonas.find((x) => x.id === m.zona_id);
    this.seleccionrestaurante = z ? z.restaurante_id : undefined;
    this.mostrarformulario = true;
  }

  eliminar(id: number) {
    if (!confirm('Eliminar mesa?')) return;
    this.serviciomesa.eliminar(id);
    this.cargar();
  }

  zonas_por_restaurante(id?: number) {
    if (!id) return [] as zona[];
    return this.listazonas.filter((z) => z.restaurante_id === Number(id));
  }

  obtener_nombre_restaurante_por_zona(zona_id: number) {
    const z = this.listazonas.find((x) => x.id === zona_id);
    if (!z) return '';
    const r = this.listarestaurantes.find((x) => x.id === z.restaurante_id);
    return r ? r.nombre : '';
  }

  obtener_nombre_zona(zona_id: number) {
    const z = this.listazonas.find((x) => x.id === zona_id);
    return z ? z.nombre : '';
  }
}

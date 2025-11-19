import { Component, OnInit } from '@angular/core';
import { zona } from '../../models/zona';
import { zonaService } from '../../services/zonaService';
import { restaurante } from '../../models/restaurante';
import { restauranteService } from '../../services/restauranteService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { horario } from '../../models/horario';
import { horarioService } from '../../services/horarioService';

@Component({
  selector: 'app-zonas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zonas.html',
  styleUrl: './zonas.css',
})
export class Zonas implements OnInit {
  zonas: zona[] = [];
  modelo: Partial<zona> = {};
  listarestaurantes: restaurante[] = [];
  mostrarformulario = false;

  // horarios
  horarios: horario[] = [];
  modelohorario: Partial<horario> = {};
  mostrarhorarios = false;
  zonaseleccionada = undefined as number | undefined;

  constructor(
    private serviciozona: zonaService,
    private serviciorestaurante: restauranteService,
    private serviciohorario: horarioService
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.zonas = this.serviciozona.obtenerTodos();
    this.listarestaurantes = this.serviciorestaurante.getAll();
    this.modelo = {};
    this.mostrarformulario = false;
  }

  abrirformulario() {
    this.modelo = {};
    this.mostrarformulario = true;
  }

  // horarios por zona
  abrirhorarios(z: zona) {
    this.zonaseleccionada = z.id;
    this.cargarhorarios();
    this.mostrarhorarios = true;
  }

  cerrarhorarios() {
    this.zonaseleccionada = undefined;
    this.horarios = [];
    this.modelohorario = {};
    this.mostrarhorarios = false;
  }

  cargarhorarios() {
    if (!this.zonaseleccionada) {
      this.horarios = [];
      return;
    }
    this.horarios = this.serviciohorario.obtenerPorZona(this.zonaseleccionada);
    this.modelohorario = {};
  }

  cerrarformulario() {
    this.modelo = {};
    this.mostrarformulario = false;
  }

  guardar() {
    if (!this.modelo.nombre || !this.modelo.nombre.toString().trim()) return;
    if (!this.modelo.restaurante_id) return;
    const nombre = this.modelo.nombre.toString().trim();
    const restaurante_id = Number(this.modelo.restaurante_id);
    if (this.modelo.id) {
      this.serviciozona.actualizar({ id: this.modelo.id as number, nombre, restaurante_id });
    } else {
      this.serviciozona.crear(nombre, restaurante_id);
    }
    this.cargar();
  }

  editar(z: zona) {
    this.modelo = { id: z.id, nombre: z.nombre, restaurante_id: z.restaurante_id };
    this.mostrarformulario = true;
  }

  eliminar(id: number) {
    if (!confirm('Eliminar zona?')) return;
    const ok = this.serviciozona.eliminar(id);
    if (!ok) {
      alert('No se puede eliminar la zona porque tiene mesas asignadas');
      return;
    }
    this.cargar();
  }

  obtener_nombre_restaurante(id: number) {
    const r = this.listarestaurantes.find((x) => x.id === id);
    return r ? r.nombre : '';
  }

  obtener_nombre_zona(id?: number) {
    if (!id) return '';
    const z = this.zonas.find((x) => x.id === id);
    return z ? z.nombre : '';
  }

  // CRUD horarios
  guardarhorario() {
    if (
      this.modelohorario.hora === undefined ||
      this.modelohorario.hora === null ||
      !this.zonaseleccionada
    )
      return;
    // aceptar entero 0-23 o string 'HH'/'HH:MM', convertir a 'HH:00'
    const raw = this.modelohorario.hora;
    let hora_str = '';
    if (typeof raw === 'number') {
      const hnum = raw;
      if (!Number.isInteger(hnum) || hnum < 0 || hnum > 23) {
        alert('Hora inválida; debe ser un entero entre 0 y 23');
        return;
      }
      hora_str = String(hnum).padStart(2, '0') + ':00';
    } else {
      const s = raw.toString().trim();
      if (s.indexOf(':') >= 0) {
        const partes = s.split(':');
        if (partes.length < 1) {
          alert('Formato de hora inválido');
          return;
        }
        const hnum = Number(partes[0]);
        const minutos = partes.length > 1 ? partes[1] : '00';
        if (isNaN(hnum) || hnum < 0 || hnum > 23) {
          alert('Hora inválida');
          return;
        }
        if (minutos !== '00') {
          alert('Los horarios deben ser en punto (ej. 17:00, 18:00) sin minutos');
          return;
        }
        hora_str = String(hnum).padStart(2, '0') + ':00';
      } else {
        const hnum = Number(s);
        if (isNaN(hnum) || !Number.isInteger(hnum) || hnum < 0 || hnum > 23) {
          alert('Hora inválida; debe ser un entero entre 0 y 23');
          return;
        }
        hora_str = String(hnum).padStart(2, '0') + ':00';
      }
    }
    const zona_id = Number(this.zonaseleccionada);
    if (this.modelohorario.id) {
      this.serviciohorario.actualizar({
        id: this.modelohorario.id as number,
        hora: hora_str,
        zona_id,
      });
    } else {
      this.serviciohorario.crear(hora_str, zona_id);
    }
    this.cargarhorarios();
  }

  editarhorario(h: horario) {
    // convertir hora 'HH:MM' a entero HH para el input
    const partes = h.hora.split(':');
    const hnum = partes.length ? Number(partes[0]) : undefined;
    this.modelohorario = { id: h.id, hora: hnum, zona_id: h.zona_id } as Partial<horario>;
  }

  eliminarhorario(id: number) {
    if (!confirm('Eliminar horario?')) return;
    this.serviciohorario.eliminar(id);
    this.cargarhorarios();
  }
}

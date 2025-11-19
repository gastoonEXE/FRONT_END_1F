import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { restaurante } from '../../models/restaurante';
import { zona } from '../../models/zona';
import { mesa } from '../../models/mesa';
import { reserva } from '../../models/reserva';
import { restauranteService } from '../../services/restauranteService';
import { zonaService } from '../../services/zonaService';
import { mesaService } from '../../services/mesaService';
import { horarioService } from '../../services/horarioService';
import { reservaService } from '../../services/reservaService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-reserva.html',
  styleUrl: './crear-reserva.css',
})
export class CrearReserva implements OnInit {
  listado_restaurantes: restaurante[] = [];
  listado_zonas: zona[] = [];
  listado_mesas: mesa[] = [];
  horarios_disponibles: { id: number; hora: string }[] = [];

  fecha_minima_permitida: string = '';

  datos_formulario: any = {
    restaurante_seleccionado: null,
    zona_seleccionada: null,
    fecha_reserva: '',
    hora_seleccionada: '',
    personas_cantidad: 1,
    cliente_nombre: '',
    cliente_apellido: '',
    cliente_telefono: '',
  };

  constructor(
    private servicio_restaurantes: restauranteService,
    private servicio_zonas: zonaService,
    private servicio_mesas: mesaService,
    private servicio_horarios: horarioService,
    private servicio_reservas: reservaService,
    private navegador: Router
  ) {}

  ngOnInit() {
    this.inicializar_datos();
    this.establecer_fecha_minima();
  }

  establecer_fecha_minima() {
    const dia_actual = new Date();
    const year = dia_actual.getFullYear();
    const mes = String(dia_actual.getMonth() + 1).padStart(2, '0');
    const dia = String(dia_actual.getDate()).padStart(2, '0');
    this.fecha_minima_permitida = `${year}-${mes}-${dia}`;
  }

  verificar_fecha_valida(fecha_texto: string): boolean {
    if (!fecha_texto) return false;
    const fecha_seleccionada = new Date(fecha_texto + 'T00:00:00');
    const dia_hoy = new Date();
    dia_hoy.setHours(0, 0, 0, 0);
    return fecha_seleccionada >= dia_hoy;
  }

  inicializar_datos() {
    this.listado_restaurantes = this.servicio_restaurantes.getAll();
    this.listado_zonas = this.servicio_zonas.obtenerTodos();
    this.listado_mesas = this.servicio_mesas.obtenerTodos();
    this.horarios_disponibles = [];
  }

  cuando_selecciona_restaurante() {
    this.listado_zonas = this.servicio_zonas
      .obtenerTodos()
      .filter(
        (z: zona) => z.restaurante_id === Number(this.datos_formulario.restaurante_seleccionado)
      );
    this.datos_formulario.zona_seleccionada = null;
    this.horarios_disponibles = [];
  }

  cuando_selecciona_zona() {
    if (!this.datos_formulario.zona_seleccionada) return;
    this.horarios_disponibles = this.servicio_horarios
      .obtenerPorZona(Number(this.datos_formulario.zona_seleccionada))
      .map((h) => ({ id: h.id, hora: h.hora }));
  }

  encontrar_mesa_disponible(): mesa | null {
    const identificador_zona = Number(this.datos_formulario.zona_seleccionada);
    const fecha_elegida = this.datos_formulario.fecha_reserva;
    const hora_elegida = this.datos_formulario.hora_seleccionada;
    const numero_personas = Number(this.datos_formulario.personas_cantidad) || 1;

    const mesas_de_zona = this.servicio_mesas
      .obtenerTodos()
      .filter((m) => m.zona_id === identificador_zona);
    const reservas_mismo_momento = this.servicio_reservas
      .obtenerTodos()
      .filter((r) => r.fecha === fecha_elegida && r.hora === hora_elegida);
    const ids_mesas_ocupadas = reservas_mismo_momento.map((r) => r.idMesaAsignada);

    const mesas_libres = mesas_de_zona.filter(
      (m) => !ids_mesas_ocupadas.includes(m.id) && m.capacidad >= numero_personas
    );

    if (!mesas_libres.length) return null;

    mesas_libres.sort((a, b) => a.capacidad - b.capacidad);
    return mesas_libres[0];
  }

  procesar_confirmacion() {
    if (
      !this.datos_formulario.restaurante_seleccionado ||
      !this.datos_formulario.zona_seleccionada
    ) {
      alert('Por favor seleccione restaurante y zona');
      return;
    }
    if (!this.datos_formulario.fecha_reserva || !this.datos_formulario.hora_seleccionada) {
      alert('Por favor seleccione fecha y horario');
      return;
    }

    if (!this.verificar_fecha_valida(this.datos_formulario.fecha_reserva)) {
      alert('No se pueden hacer reservas en fechas pasadas. Seleccione una fecha actual o futura.');
      return;
    }

    const numero_personas_validar = Number(this.datos_formulario.personas_cantidad);
    if (!numero_personas_validar || numero_personas_validar < 1) {
      alert('La reserva debe ser para al menos una persona. Ingrese una cantidad válida.');
      return;
    }

    if (
      !this.datos_formulario.cliente_nombre ||
      !this.datos_formulario.cliente_apellido ||
      !this.datos_formulario.cliente_telefono
    ) {
      alert('Por favor complete los datos del cliente');
      return;
    }

    const mesa_asignada = this.encontrar_mesa_disponible();
    if (!mesa_asignada) {
      alert('No se encontraron mesas disponibles para el horario seleccionado');
      return;
    }

    this.servicio_reservas.crear(
      this.datos_formulario.fecha_reserva,
      this.datos_formulario.hora_seleccionada,
      Number(this.datos_formulario.personas_cantidad),
      mesa_asignada.id,
      this.datos_formulario.cliente_nombre,
      this.datos_formulario.cliente_apellido,
      this.datos_formulario.cliente_telefono
    );

    alert('Reserva confirmada exitosamente. Mesa número: ' + mesa_asignada.numero);
    this.navegador.navigate(['/reservas']);
  }
}

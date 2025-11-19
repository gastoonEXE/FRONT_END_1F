import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { restaurante } from '../../models/restaurante';
import { zona } from '../../models/zona';
import { mesa } from '../../models/mesa';
import { reserva } from '../../models/reserva';
import { restauranteService } from '../../services/restauranteService';
import { zonaService } from '../../services/zonaService';
import { mesaService } from '../../services/mesaService';
import { reservaService } from '../../services/reservaService';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas implements OnInit {
  lista_restaurantes: restaurante[] = [];
  lista_zonas: zona[] = [];
  lista_mesas: mesa[] = [];
  todas_reservas: reserva[] = [];
  reservas_filtradas: reserva[] = [];

  filtro_restaurante: number | null = null;
  filtro_zona: number | null = null;
  filtro_fecha: string = '';

  zonas_para_filtro: zona[] = [];

  constructor(
    private servicio_restaurantes: restauranteService,
    private servicio_zonas: zonaService,
    private servicio_mesas: mesaService,
    private servicio_reservas: reservaService
  ) {}

  ngOnInit() {
    this.inicializar_datos();
  }

  inicializar_datos() {
    this.lista_restaurantes = this.servicio_restaurantes.getAll();
    this.lista_zonas = this.servicio_zonas.obtenerTodos();
    this.lista_mesas = this.servicio_mesas.obtenerTodos();
    this.todas_reservas = this.servicio_reservas.obtenerTodos();
    this.reservas_filtradas = [...this.todas_reservas];
    this.zonas_para_filtro = [...this.lista_zonas];
  }

  obtener_numero_mesa(identificador_mesa: number): string {
    const mesa_encontrada = this.lista_mesas.find((x) => x.id === identificador_mesa);
    return mesa_encontrada ? mesa_encontrada.numero.toString() : '—';
  }

  obtener_nombre_zona(identificador_zona: number): string {
    const zona_encontrada = this.lista_zonas.find((x) => x.id === identificador_zona);
    if (!zona_encontrada) return '—';
    return zona_encontrada.nombre;
  }

  obtener_nombre_restaurante(identificador_restaurante: number): string {
    const restaurante_encontrado = this.lista_restaurantes.find(
      (x) => x.id === identificador_restaurante
    );
    return restaurante_encontrado ? restaurante_encontrado.nombre : '—';
  }

  obtener_restaurante_por_zona(identificador_zona: number): number | null {
    const zona_encontrada = this.lista_zonas.find((z) => z.id === identificador_zona);
    return zona_encontrada ? zona_encontrada.restaurante_id : null;
  }

  obtener_zona_por_mesa(identificador_mesa: number): number | null {
    const mesa_encontrada = this.lista_mesas.find((m) => m.id === identificador_mesa);
    return mesa_encontrada ? mesa_encontrada.zona_id : null;
  }

  cuando_cambia_filtro_restaurante() {
    if (this.filtro_restaurante) {
      this.zonas_para_filtro = this.lista_zonas.filter(
        (z) => z.restaurante_id === this.filtro_restaurante
      );
    } else {
      this.zonas_para_filtro = [...this.lista_zonas];
    }
    this.filtro_zona = null;
    this.ejecutar_filtros();
  }

  ejecutar_filtros() {
    let resultado_temporal = [...this.todas_reservas];

    if (this.filtro_restaurante) {
      resultado_temporal = resultado_temporal.filter((reserva_item) => {
        const zona_de_mesa = this.obtener_zona_por_mesa(reserva_item.idMesaAsignada);
        if (!zona_de_mesa) return false;
        const restaurante_de_zona = this.obtener_restaurante_por_zona(zona_de_mesa);
        return restaurante_de_zona === this.filtro_restaurante;
      });
    }

    if (this.filtro_zona) {
      resultado_temporal = resultado_temporal.filter((reserva_item) => {
        const zona_de_mesa = this.obtener_zona_por_mesa(reserva_item.idMesaAsignada);
        return zona_de_mesa === this.filtro_zona;
      });
    }

    if (this.filtro_fecha) {
      resultado_temporal = resultado_temporal.filter(
        (reserva_item) => reserva_item.fecha === this.filtro_fecha
      );
    }

    this.reservas_filtradas = resultado_temporal;
  }

  limpiar_filtros() {
    this.filtro_restaurante = null;
    this.filtro_zona = null;
    this.filtro_fecha = '';
    this.zonas_para_filtro = [...this.lista_zonas];
    this.reservas_filtradas = [...this.todas_reservas];
  }

  borrar_reserva(identificador: number) {
    if (!confirm('¿Eliminar esta reserva?')) return;
    const operacion_exitosa = this.servicio_reservas.eliminar(identificador);
    if (!operacion_exitosa) {
      alert('No se pudo eliminar la reserva');
      return;
    }
    this.inicializar_datos();
    this.ejecutar_filtros();
  }
}

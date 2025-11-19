import { Injectable } from '@angular/core';
import { reserva } from '../models/reserva';

@Injectable({ providedIn: 'root' })
export class reservaService {
  private clave = 'reservas_v1';

  private leer(): reserva[] {
    const bruto = localStorage.getItem(this.clave);
    return bruto ? (JSON.parse(bruto) as reserva[]) : [];
  }

  private escribir(items: reserva[]) {
    localStorage.setItem(this.clave, JSON.stringify(items));
  }

  obtenerTodos(): reserva[] {
    return this.leer();
  }

  obtenerPorId(id: number): reserva | undefined {
    return this.leer().find((r) => r.id === id);
  }

  crear(
    fecha: string,
    hora: string,
    cantidadPersonas: number,
    idMesaAsignada: number,
    nombre: string,
    apellido: string,
    telefono: string
  ): reserva {
    const lista = this.leer();
    const id = lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
    const nueva: reserva = {
      id,
      fecha,
      hora,
      cantidadPersonas,
      idMesaAsignada,
      nombre,
      apellido,
      telefono,
    };
    lista.push(nueva);
    this.escribir(lista);
    return nueva;
  }

  eliminar(id: number): boolean {
    const lista = this.leer();
    const filtrada = lista.filter((i) => i.id !== id);
    if (filtrada.length === lista.length) return false;
    this.escribir(filtrada);
    return true;
  }
}

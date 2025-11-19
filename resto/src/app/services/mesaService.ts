import { Injectable } from '@angular/core';
import { mesa } from '../models/mesa';

@Injectable({ providedIn: 'root' })
export class mesaService {
  private clave = 'mesas_v1';

  private leer(): mesa[] {
    const bruto = localStorage.getItem(this.clave);
    return bruto ? (JSON.parse(bruto) as mesa[]) : [];
  }

  private escribir(items: mesa[]) {
    localStorage.setItem(this.clave, JSON.stringify(items));
  }

  obtenerTodos(): mesa[] {
    return this.leer();
  }

  obtenerPorId(id: number): mesa | undefined {
    return this.leer().find((m) => m.id === id);
  }

  crear(numero: number, capacidad: number, zona_id: number): mesa {
    const lista = this.leer();
    const id = lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
    const nueva: mesa = { id, numero, capacidad, zona_id };
    lista.push(nueva);
    this.escribir(lista);
    return nueva;
  }

  actualizar(actualizada: mesa): boolean {
    const lista = this.leer();
    const idx = lista.findIndex((i) => i.id === actualizada.id);
    if (idx === -1) return false;
    lista[idx] = actualizada;
    this.escribir(lista);
    return true;
  }

  eliminar(id: number): boolean {
    const lista = this.leer();
    const filtrada = lista.filter((i) => i.id !== id);
    if (filtrada.length === lista.length) return false;
    this.escribir(filtrada);
    return true;
  }
}

import { Injectable } from '@angular/core';
import { horario } from '../models/horario';

@Injectable({ providedIn: 'root' })
export class horarioService {
  private clave = 'horarios_v1';

  private leer(): horario[] {
    const bruto = localStorage.getItem(this.clave);
    return bruto ? (JSON.parse(bruto) as horario[]) : [];
  }

  private escribir(items: horario[]) {
    localStorage.setItem(this.clave, JSON.stringify(items));
  }

  obtenerTodos(): horario[] {
    return this.leer();
  }

  obtenerPorId(id: number): horario | undefined {
    return this.leer().find((h) => h.id === id);
  }

  obtenerPorZona(zona_id: number): horario[] {
    return this.leer().filter((h) => h.zona_id === zona_id);
  }

  crear(hora: string, zona_id: number): horario {
    const lista = this.leer();
    const id = lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
    const nuevo: horario = { id, hora, zona_id };
    lista.push(nuevo);
    this.escribir(lista);
    return nuevo;
  }

  actualizar(actualizado: horario): boolean {
    const lista = this.leer();
    const idx = lista.findIndex((i) => i.id === actualizado.id);
    if (idx === -1) return false;
    lista[idx] = actualizado;
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

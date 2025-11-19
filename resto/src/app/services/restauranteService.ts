import { Injectable } from '@angular/core';
import { restaurante } from '../models/restaurante';
import { zonaService } from './zonaService';

@Injectable({ providedIn: 'root' })
export class restauranteService {
  constructor(private serviciozona: zonaService) {}
  private key = 'restaurantes_v1';

  private read(): restaurante[] {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as restaurante[]) : [];
  }

  private write(items: restaurante[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  getAll(): restaurante[] {
    return this.read();
  }

  getById(id: number): restaurante | undefined {
    return this.read().find((r) => r.id === id);
  }

  create(nombre: string): restaurante {
    const items = this.read();
    const id = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const r: restaurante = { id, nombre };
    items.push(r);
    this.write(items);
    return r;
  }

  update(updated: restaurante): boolean {
    const items = this.read();
    const idx = items.findIndex((i) => i.id === updated.id);
    if (idx === -1) return false;
    items[idx] = updated;
    this.write(items);
    return true;
  }

  delete(id: number): boolean {
    // impedir eliminar restaurante si existen zonas asociadas
    const zonas = this.serviciozona.obtenerTodos();
    const tieneZonas = zonas.some((z) => z.restaurante_id === id);
    if (tieneZonas) return false;

    const items = this.read();
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    this.write(filtered);
    return true;
  }
}

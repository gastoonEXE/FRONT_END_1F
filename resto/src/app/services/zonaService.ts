import { Injectable } from '@angular/core';
import { zona } from '../models/zona';
import { mesaService } from './mesaService';
import { horarioService } from './horarioService';

@Injectable({ providedIn: 'root' })
export class zonaService {
  constructor(private serviciomesa: mesaService, private serviciohorario: horarioService) {}
  private clave = 'zonas_v1';

  private leer(): zona[] {
    const bruto = localStorage.getItem(this.clave);
    return bruto ? (JSON.parse(bruto) as zona[]) : [];
  }

  private escribir(items: zona[]) {
    localStorage.setItem(this.clave, JSON.stringify(items));
  }

  obtenerTodos(): zona[] {
    return this.leer();
  }

  obtenerPorId(id: number): zona | undefined {
    return this.leer().find((z) => z.id === id);
  }

  crear(nombre: string, restaurante_id: number): zona {
    const lista = this.leer();
    const id = lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
    const nueva: zona = { id, nombre, restaurante_id };
    lista.push(nueva);
    this.escribir(lista);
    return nueva;
  }

  actualizar(actualizada: zona): boolean {
    const lista = this.leer();
    const idx = lista.findIndex((i) => i.id === actualizada.id);
    if (idx === -1) return false;
    lista[idx] = actualizada;
    this.escribir(lista);
    return true;
  }

  eliminar(id: number): boolean {
    // impedir eliminar zona si existen mesas asignadas
    const mesas = this.serviciomesa.obtenerTodos();
    const tieneMesas = mesas.some((m) => m.zona_id === id);
    if (tieneMesas) return false;

    // eliminar todos los horarios asociados a la zona
    const horarios = this.serviciohorario.obtenerPorZona(id);
    horarios.forEach((h) => this.serviciohorario.eliminar(h.id));

    const lista = this.leer();
    const filtrada = lista.filter((i) => i.id !== id);
    if (filtrada.length === lista.length) return false;
    this.escribir(filtrada);
    return true;
  }
}

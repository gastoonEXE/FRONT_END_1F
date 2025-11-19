import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Restaurantes } from './pages/restaurantes/restaurantes';
import { Zonas } from './pages/zonas/zonas';
import { Mesas } from './pages/mesas/mesas';
import { Reservas } from './pages/reservas/reservas';
import { CrearReserva } from './pages/crear-reserva/crear-reserva';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'restaurantes',
    component: Restaurantes,
  },
  {
    path: 'zonas',
    component: Zonas,
  },
  {
    path: 'mesas',
    component: Mesas,
  },
  {
    path: 'reservas/crear',
    component: CrearReserva,
  },
  {
    path: 'reservas',
    component: Reservas,
  },
];

// import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';

// @Component({
//   selector: 'app-inicio',
//   imports: [],
//   standalone: true,
//   templateUrl: './inicio.html',
//   styleUrls: ['./inicio.css'],
// })
// export class Inicio {
//   @ViewChild('scroller') scroller!: ElementRef
//   @ViewChild('seccionMenu') seccionMenu!: ElementRef
//   @ViewChild('servicios') servicios!: ElementRef
//   @ViewChild('quienesSomos') quienesSomos!: ElementRef

  
//   itemsArray: number[] = [];
//   activeIndex = 0;

//   ngAfterViewInit() {
//     setTimeout(() => {
//       this.contarItems()
//     }, 100);
//   }

//   contarItems() {
//     const container = this.scroller.nativeElement

//     this.itemsArray = new Array(container.children.length).fill(0)
//   }

//   onScroll(event: Event) {
//     const container = this.scroller.nativeElement
//     const scrollPosition = container.scrollLeft;
    
//     // Estrategia: "Busca la carta cuya posición (offsetLeft) esté más cerca del scroll actual"
//     let masCercanoIndex = 0;
//     let menorDistancia = Number.MAX_VALUE;

//     // Convertimos la lista de hijos a un array real para recorrerlo
//     const cartas = Array.from(container.children) as HTMLElement[];

//     cartas.forEach((carta, index) => {
//       // offsetLeft es la distancia física de la carta al borde izquierdo del contenedor
//       // Math.abs calcula la distancia absoluta (sin negativos)
//       const distancia = Math.abs(carta.offsetLeft - scrollPosition);

//       if (distancia < menorDistancia) {
//         menorDistancia = distancia;
//         masCercanoIndex = index;
//       }
//     });

//     // Solo actualizamos si cambió para no forzar a Angular
//     if (this.activeIndex !== masCercanoIndex) {
//       this.activeIndex = masCercanoIndex;
//     }
//   }
//   scrollToMenu() {
//     if (this.seccionMenu) {
//       this.seccionMenu.nativeElement.scrollIntoView({ 
//         behavior: 'smooth', 
//         block: 'start'      
//       });
//     }
//   }

//   scrollTo(){
//     console.log('scroooooooll')
//   }

//   moverCarrusel(direccion: number) {
//     const container = this.scroller.nativeElement;
//     const card = container.children[0] as HTMLElement; // Tomamos la primera carta como referencia
    
//     if (!card) return;

//     // Calculamos el ancho real + el gap real sin adivinar
//     const cardWidth = card.offsetWidth; 
//     // Truco: La diferencia entre la posición de la carta 2 y la carta 1 es el "paso" exacto
//     const nextCard = container.children[1] as HTMLElement;
//     const stride = nextCard ? (nextCard.offsetLeft - card.offsetLeft) : (cardWidth + 16);

//     container.scrollBy({ left: stride * direccion, behavior: 'smooth' });
//   }

//   irAlSlide(index: number) {
//     // 1. Actualizamos el puntito rojo YA (para feedback instantáneo)
//     this.activeIndex = index;

//     const container = this.scroller.nativeElement;
//     const cartaObjetivo = container.children[index] as HTMLElement;

//     if (cartaObjetivo) {
//       // 2. Le decimos al contenedor: "Scrollea hasta donde empieza esta carta exacta"
//       container.scrollTo({
//         left: cartaObjetivo.offsetLeft,
//         behavior: 'smooth'
//       });
//     }
//   }

//   irAWhatsApp(mensaje : string) {
//     const telefono = '5491143996647';
    
//     // encodeURIComponent cambia los espacios por %20 y caracteres raros automáticamente
//     const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    
//     window.open(url, '_blank');
//   }

//   scrollToServicios(){
//     if (this.servicios) {
//       this.servicios.nativeElement.scrollIntoView({ 
//         behavior: 'smooth', 
//         block: 'start'      
//       });
//     }
//   }
//   scrollToHistoria(){
//     const element = this.quienesSomos?.nativeElement;
  
//     if (element) {
//       const offset = 50; // Aquí pones los píxeles que quieras restar
//       const bodyRect = document.body.getBoundingClientRect().top;
//       const elementRect = element.getBoundingClientRect().top;
      
//       // Cálculo de posición absoluta menos el offset
//       const elementPosition = elementRect - bodyRect;
//       const offsetPosition = elementPosition - offset;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: 'smooth'
//       });
//     }
//   }

// }

// ===================================================
// ROLLING HOUSE PANCHERIA — home.component.ts
// ===================================================
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ── INTERFACES ──────────────────────────────────────

export interface EventType {
  icon: string;
  title: string;
  desc: string;
}
 
export interface EventInclude {
  icon: string;
  text: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  featured?: boolean;
  spicy?: boolean;
  newItem?: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Pillar {
  icon: string;
  title: string;
  desc: string;
}

// ── COMPONENTE ───────────────────────────────────────
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class Inicio implements OnInit, OnDestroy {

  // ── REFS PARA CURSOR ──────────────────────────────
  @ViewChild('cursor') cursorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorFollower') followerRef!: ElementRef<HTMLDivElement>;

  private followerX = 0;
  private followerY = 0;
  private mouseX = 0;
  private mouseY = 0;
  private rafId: number = 0;

  whatsappUrl: string = 'https://wa.me/5491143996647?text=Hola%20Rolling%20House!%20Me%20interesa%20contratar%20el%20servicio%20para%20un%20evento%20privado%20%F0%9F%8C%AD';

  // ── ESTADO ────────────────────────────────────────
  activeCategory: string = 'todos';
  menuOpen: boolean = false;
  currentYear: number = new Date().getFullYear();

   eventTypes: EventType[] = [
    {
      icon: '🎂',
      title: 'CUMPLEAÑOS',
      desc: 'Sorprendé a tus invitados con el puesto Rolling en tu fiesta. Ideal para todo tipo de cumpleaños.',
    },
    {
      icon: '🥳',
      title: 'FIESTAS Y CASAMIENTOS',
      desc: 'Una estación de panchos gourmet que rompe con lo clásico. El hit de cualquier recepción.',
    },
    {
      icon: '💼',
      title: 'EVENTOS CORPORATIVOS',
      desc: 'Almuerzos, after office, lanzamientos. Le ponemos onda gastronómica a tus eventos de empresa.',
    },
  ];
 
  eventIncludes: EventInclude[] = [
    { icon: '🚚', text: 'Puesto móvil propio' },
    { icon: '🌭', text: 'Menú personalizable' },
    { icon: '👨‍🍳', text: 'Equipo de cocina' },
    { icon: '🧀', text: 'Salsas de autor' },
    { icon: '📦', text: 'Packaging incluido' },
    { icon: '✅', text: 'Sin costo de traslado (a consultar)' },
  ];

  // ── MARQUEE ───────────────────────────────────────
  marqueeItems: string[] = [
    'Pancho Clásico',
    'Cebolla Crunchy',
    'Queso Fundido',
    'Salsa Rolling',
    'Cheddar Especial',
    'Mostaza Artesanal',
    'Chimichurri House',
    'Crispy Onion',
  ];

  marqueeItems2: string[] = [
    'Hecho con ❤️',
    'Sin gluten disponible',
    'Ingredientes frescos',
    'Salsas propias',
    'Combos para 2',
    'Delivery disponible',
    'Abierto los fines',
  ];

  // ── CATEGORÍAS ────────────────────────────────────
  categories: Category[] = [
    { id: 'todos',    name: 'Todos',    icon: '🌭' },
    { id: 'panchos',  name: 'Panchos',  icon: '⭐' },
    { id: 'extras',   name: 'Extras',   icon: '🧀' },
    { id: 'postres',  name: 'Postres',  icon: '🍓' },
    { id: 'bebidas',  name: 'Bebidas',  icon: '🥤' },
  ];

  // ── MENÚ ─────────────────────────────────────────
  allMenuItems: MenuItem[] = [
  // ── PANCHOS ─────────────────────────────────────
    {
      id: 1,
      name: 'ARGENTO',
      description: 'Pancito de papa, salchicha ahumada asada con piel, ChimiMayo (mayo a base de chimichurri) o mayo clásica, papas fritas picadas de snack. Con nachos con cheddar o salsa picante.',
      price: 0,
      category: 'panchos',
      featured: true,
      tags: ['papas fritas', 'nachos'],
    },
    {
      id: 2,
      name: 'CLÁSICO',
      description: 'Pancito de papa, salchicha ahumada asada sin piel, aderezo el que más te guste (mayo, ketchup, mostaza). Adicional cheddar y papas pai. Con nachos con cheddar o salsa picante.',
      price: 0,
      category: 'panchos',
      tags: ['clásico', 'personalizable'],
    },
    {
      id: 3,
      name: 'DOBLE CHEDDAR',
      description: 'Pancito de papa, salchicha ahumada asada sin piel, cheddar extra.',
      price: 0,
      category: 'panchos',
      featured: true,
      tags: ['cheddar', 'sin piel'],
    },
    {
      id: 4,
      name: 'AMERICANO',
      description: 'Pancito de papa, salchicha ahumada asada con piel, cheddar, panceta ahumada en cubos, cebolla caramelizada. Con nachos con cheddar o salsa picante.',
      price: 0,
      category: 'panchos',
      tags: ['panceta', 'cebolla caramelizada'],
    },
    {
      id: 5,
      name: 'MEXICANO',
      description: 'Pancito de papa, salchicha ahumada asada con piel, salsa de tomate, ají picante (PU. Pario), nachos picados arriba. Con nachos con cheddar o salsa picante.',
      price: 0,
      category: 'panchos',
      spicy: true,
      tags: ['picante', 'nachos'],
    },
    {
      id: 6,
      name: 'GERMANO',
      description: 'Pancito de papa, salchicha ahumada asada con piel, mostaza especial hecha a base de pepinos (Relish) dulzona, una delicatessen. Chucrut. Con nachos con cheddar o salsa picante.',
      price: 0,
      category: 'panchos',
      tags: ['relish', 'chucrut', 'delicatessen'],
    },
    // ── EXTRAS ──────────────────────────────────────
    {
      id: 7,
      name: 'NACHOS',
      description: 'Con cheddar o salsa picante, o ChimiMayo.',
      price: 0,
      category: 'extras',
      tags: ['cheddar', 'salsa picante'],
    },
    // ── POSTRE ──────────────────────────────────────
    {
      id: 8,
      name: 'FRANUI',
      description: 'Consultá stock en caja. Los que saben, saben.',
      price: 0,
      category: 'postres',
      tags: ['chocolate', 'frambuesas'],
    },
    // ── BEBIDAS ─────────────────────────────────────
    {
      id: 9,
      name: 'PARA TOMAR',
      description: 'Gaseosas, agua, agua saborizada.',
      price: 0,
      category: 'bebidas',
      tags: ['gaseosa', 'agua'],
    },
  ];

  get filteredItems(): MenuItem[] {
    if (this.activeCategory === 'todos') return this.allMenuItems;
    return this.allMenuItems.filter(i => i.category === this.activeCategory);
  }

  // ── PILARES ───────────────────────────────────────
  pillars: Pillar[] = [
    {
      icon: '🌾',
      title: 'INGREDIENTES REALES',
      desc: 'Nada de porquerías. Cada ingrediente es elegido con cuidado para que el sabor hable por sí solo.',
    },
    {
      icon: '🧑‍🍳',
      title: 'HECHO AL MOMENTO',
      desc: 'No hay nada pre-armado esperándote. Tu pancho se prepara cuando lo pedís.',
    },
    {
      icon: '🔥',
      title: 'SALSAS DE AUTOR',
      desc: 'Las salsas son la firma de Rolling House. Recetas propias que no vas a encontrar en otro lado.',
    },
    {
      icon: '❤️',
      title: 'PASIÓN PURA',
      desc: 'Somos una panchería que nació del amor por la comida callejera bien hecha. Sin vueltas.',
    },
  ];

  // ── MÉTODOS ───────────────────────────────────────

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  setCategory(id: string): void {
    this.activeCategory = id;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // ── CURSOR PERSONALIZADO ──────────────────────────
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    const cursor = this.cursorRef?.nativeElement;
    if (cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    }
  }

  private animateFollower(): void {
    this.followerX += (this.mouseX - this.followerX) * 0.12;
    this.followerY += (this.mouseY - this.followerY) * 0.12;

    const follower = this.followerRef?.nativeElement;
    if (follower) {
      follower.style.left = this.followerX + 'px';
      follower.style.top  = this.followerY + 'px';
    }
    this.rafId = requestAnimationFrame(() => this.animateFollower());
  }

  // ── SCROLL REVEAL ─────────────────────────────────
  private setupScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.pillar, .menu-card, .about-text, .info-block').forEach(el => {
      observer.observe(el);
    });
  }



  // ── LIFECYCLE ─────────────────────────────────────
  ngOnInit(): void {
    this.animateFollower();
    setTimeout(() => this.setupScrollReveal(), 300);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }
}
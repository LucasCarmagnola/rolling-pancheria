import { Component, ElementRef, viewChild, ViewChild } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [],
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class Inicio {
  @ViewChild('scroller') scroller!: ElementRef
  @ViewChild('seccionMenu') seccionMenu!: ElementRef
  @ViewChild('servicios') servicios!: ElementRef
  @ViewChild('quienesSomos') quienesSomos!: ElementRef

  
  itemsArray: number[] = [];
  activeIndex = 0;

  ngAfterViewInit() {
    setTimeout(() => {
      this.contarItems()
    }, 100);
  }

  contarItems() {
    const container = this.scroller.nativeElement

    this.itemsArray = new Array(container.children.length).fill(0)
  }

  onScroll(event: Event) {
    const container = this.scroller.nativeElement
    const scrollPosition = container.scrollLeft;
    
    // Estrategia: "Busca la carta cuya posición (offsetLeft) esté más cerca del scroll actual"
    let masCercanoIndex = 0;
    let menorDistancia = Number.MAX_VALUE;

    // Convertimos la lista de hijos a un array real para recorrerlo
    const cartas = Array.from(container.children) as HTMLElement[];

    cartas.forEach((carta, index) => {
      // offsetLeft es la distancia física de la carta al borde izquierdo del contenedor
      // Math.abs calcula la distancia absoluta (sin negativos)
      const distancia = Math.abs(carta.offsetLeft - scrollPosition);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        masCercanoIndex = index;
      }
    });

    // Solo actualizamos si cambió para no forzar a Angular
    if (this.activeIndex !== masCercanoIndex) {
      this.activeIndex = masCercanoIndex;
    }
  }
  scrollToMenu() {
    if (this.seccionMenu) {
      this.seccionMenu.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'      
      });
    }
  }

  scrollTo(){
    console.log('scroooooooll')
  }

  moverCarrusel(direccion: number) {
    const container = this.scroller.nativeElement;
    const card = container.children[0] as HTMLElement; // Tomamos la primera carta como referencia
    
    if (!card) return;

    // Calculamos el ancho real + el gap real sin adivinar
    const cardWidth = card.offsetWidth; 
    // Truco: La diferencia entre la posición de la carta 2 y la carta 1 es el "paso" exacto
    const nextCard = container.children[1] as HTMLElement;
    const stride = nextCard ? (nextCard.offsetLeft - card.offsetLeft) : (cardWidth + 16);

    container.scrollBy({ left: stride * direccion, behavior: 'smooth' });
  }

  irAlSlide(index: number) {
    // 1. Actualizamos el puntito rojo YA (para feedback instantáneo)
    this.activeIndex = index;

    const container = this.scroller.nativeElement;
    const cartaObjetivo = container.children[index] as HTMLElement;

    if (cartaObjetivo) {
      // 2. Le decimos al contenedor: "Scrollea hasta donde empieza esta carta exacta"
      container.scrollTo({
        left: cartaObjetivo.offsetLeft,
        behavior: 'smooth'
      });
    }
  }

  irAWhatsApp(mensaje : string) {
    const telefono = '5491143996647';
    
    // encodeURIComponent cambia los espacios por %20 y caracteres raros automáticamente
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
  }

  scrollToServicios(){
    if (this.servicios) {
      this.servicios.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'      
      });
    }
  }
  scrollToHistoria(){
    const element = this.quienesSomos?.nativeElement;
  
    if (element) {
      const offset = 50; // Aquí pones los píxeles que quieras restar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      
      // Cálculo de posición absoluta menos el offset
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

}

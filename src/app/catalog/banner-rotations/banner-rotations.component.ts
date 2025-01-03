import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bot-banner-rotations',
  templateUrl: './banner-rotations.component.html',
  styleUrl: './banner-rotations.component.css'
})
export class BannerRotationsComponent implements OnInit  {
  backgroundColor: string = '';
  banners = [
    {
      title: 'Venda mais com nossa plataforma!',
      description: 'Cadastre seus produtos e alcance novos clientes todos os dias.',
      buttonText: 'Começar agora',
      backgroundImage: 'url("https://source.unsplash.com/800x300/?sales,shop")'
    },
    {
      title: 'Aumente suas vendas hoje!',
      description: 'Oferecemos ferramentas para potencializar seu negócio online.',
      buttonText: 'Saiba mais',
      backgroundImage: 'url("https://source.unsplash.com/800x300/?business,ecommerce")'
    },
    {
      title: 'Tenha um e-commerce de sucesso!',
      description: 'Simplificamos a gestão de vendas e pagamentos para você.',
      buttonText: 'Cadastre-se já',
      backgroundImage: 'url("https://source.unsplash.com/800x300/?marketing,shop")'
    }
  ];

  currentIndex = 0;

  ngOnInit(): void {
    // Gera uma cor aleatória ao inicializar o componente
    this.backgroundColor = this.getRandomBackgroundColor();
  }

  getRandomBackgroundColor(): string {
    const baseColors = [
      '#FFB6C1', // Light Pink
      '#FF69B4', // Hot Pink
      '#FFD700', // Gold
      '#FFA07A', // Light Salmon
      '#98FB98', // Pale Green
      '#AFEEEE', // Pale Turquoise
      '#D8BFD8', // Thistle
      '#FFFACD'  // Lemon Chiffon
    ];
    const randomIndex = Math.floor(Math.random() * baseColors.length);
    return baseColors[randomIndex];
  }

  nextBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  previousBanner() {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }
}

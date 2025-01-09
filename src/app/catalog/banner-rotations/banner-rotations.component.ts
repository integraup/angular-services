import { Component, OnInit } from '@angular/core';
import { UnsplashService } from '@catalog/unsplash.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bot-banner-rotations',
  templateUrl: './banner-rotations.component.html',
  styleUrl: './banner-rotations.component.css'
})
export class BannerRotationsComponent implements OnInit  {
  backgroundColor: string = '';
  opacityValue = '1';
  query: string[] = [
    'video game',
    'gaming setup',
    'gaming console',
    'game controller',
    'virtual reality',
    'gaming chair',
    'esports',
    'game studio',
    'game development',
    'gaming lifestyle',
    'gamer',
    'game graphics',
    'indie games',
    'video game characters',
    'gaming event',
    'retro gaming',
    'gaming accessories',
    'game merchandise',
    'gaming culture',
    'gaming community'
  ];

  // query: string[] = [
  //   'ecommerce website',
  //   'online store',
  //   'product display',
  //   'shopping cart',
  //   'payment gateway',
  //   'product showcase',
  //   'retail shopping',
  //   'digital marketing',
  //   'advertisement',
  //   'storefront',
  //   'online payment',
  //   'fashion store',
  //   'electronic gadgets',
  //   'shopping online',
  //   'shopping experience',
  //   'store display',
  //   'brand identity',
  //   'product photography',
  //   'ecommerce branding',
  //   'social media marketing'
  // ];
  banners = [
    {
      title: 'Venda mais com nossa plataforma!',
      description: 'Cadastre seus produtos e alcance novos clientes todos os dias.',
      buttonText: 'Começar agora',
      backgroundImage: 'url("https://source.unsplash.com/800x600/?airplane")'
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

  constructor(private unsplashService: UnsplashService, private router: Router){

  }

  ngOnInit(): void {
    // Gera uma cor aleatória ao inicializar o componente
    this.backgroundColor = this.getRandomBackgroundColor();
 this.banners.map((m, k) => {

  const randomQuery = this.query[Math.floor(Math.random() * this.query.length)];

  this.unsplashService.searchPhotos(randomQuery).subscribe((response) => {
    m.backgroundImage = response.results[0].urls.full;
  });

 })



  }

  getRandomBackgroundColor(): string {
    const baseColors = [
     'rgba(255, 182, 193, 0.3)', // Light Pink
  'rgba(255, 105, 180, 0.3)', // Hot Pink
  'rgba(255, 215, 0, 0.3)',   // Gold
  'rgba(255, 160, 122, 0.3)', // Light Salmon
  'rgba(152, 251, 152, 0.3)', // Pale Green
  'rgba(175, 238, 238, 0.3)', // Pale Turquoise
  'rgba(216, 191, 216, 0.3)', // Thistle
  'rgba(255, 250, 205, 0.3)'  // Lemon Chiffon
    ];
    const randomIndex = Math.floor(Math.random() * baseColors.length);
    return baseColors[randomIndex];
  }

  navigateToSeller(): void {
    this.router.navigate(['/squad/account-squad/SELLER']);
  }

  nextBanner() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  previousBanner() {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }
}

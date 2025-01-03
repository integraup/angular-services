import { Component } from '@angular/core';
import { Category, CategoryService } from '@catalog/category.service';
import { NotificationService } from '@core/notification.service';
import { FirebaseAuthService } from '@shared/oauth/firebase-auth.service';

@Component({
  selector: 'bot-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  categories: Category[] = [];
  emailSalles: string;
  selectedCategory: Category = { name: '', description: '', emailSalles: '' };
  newCategory: Category = { name: '', description: '', emailSalles: '' }; // Categoria para criação
  isEditing: boolean = false; // Flag para identificar edição

  constructor(private categoryService: CategoryService,
              private notificationService: NotificationService,
              private firebaseAuthService: FirebaseAuthService) {}

  ngOnInit(): void {
    this.firebaseAuthService.currentUser$.subscribe(user => {
      if (user?.email) {
        this.emailSalles = user.email; // Captura o email do usuário logado
        this.loadCategories(this.emailSalles);
      }
    });
  }

  // Carregar todas as categorias
  loadCategories(emailSalles: string): void {
    this.categoryService.getCategories(emailSalles).subscribe(
      (categories) => (this.categories = categories),
      (error) => console.error('Erro ao carregar categorias:', error)
    );
  }

  // Adicionar uma nova categoria
  addCategory(): void {
    const trimmedName = this.selectedCategory.name.trim();
    if (!trimmedName) {
      alert('O nome da categoria é obrigatório.');
      return;
    }

    const trimmeDescription = this.selectedCategory.description.trim();
    if (!trimmeDescription) {
      alert('O nome da categoria é obrigatório.');
      return;
    }

    this.newCategory.name = trimmedName;
    this.newCategory.description = trimmeDescription;
    this.newCategory.emailSalles = this.emailSalles;

    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (category) => {
        this.categories.push(category); // Adicionar a nova categoria à lista
        this.newCategory = { name: '', description: '', emailSalles: '' }; // Reset do formulário
        console.log('Categoria adicionada com sucesso:', category);
      },
      error: (error) => {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao adicionar categoria. Por favor, tente novamente.');
      }
    });
  }

  // Selecionar categoria para edição
  editCategory(category: Category): void {
    this.selectedCategory = JSON.parse(JSON.stringify(category)); // Cópia profunda para edição
    console.log('Categoria selecionada para edição:', this.selectedCategory);
    this.isEditing = true;
  }

  // Salvar alterações de uma categoria
  updateCategory(): void {
    if (this.selectedCategory && this.selectedCategory.id) {
      console.log('Categoria selecionada para updateCategory:', this.selectedCategory);
      this.categoryService.updateCategory(this.selectedCategory.id, this.selectedCategory).subscribe(
        (updatedCategory) => {
          const index = this.categories.findIndex((c) => c.id === updatedCategory.id);
          if (index !== -1) this.categories[index] = updatedCategory;
          this.cancelEdit(); // Finaliza edição
        },
        (error) => console.error('Erro ao atualizar categoria:', error)
      );
    }
  }

  // Cancelar edição
  cancelEdit(): void {
    this.selectedCategory = { name: '', description: '', emailSalles: '' }; // Reset do formulário de edição
    this.isEditing = false;
  }

  // Excluir uma categoria
  deleteCategory(categoryId: string): void {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        () => {
          this.categories = this.categories.filter((category) => category.id !== categoryId);
        },
        (error) => console.error('Erro ao excluir categoria:', error)
      );
    }
  }
}

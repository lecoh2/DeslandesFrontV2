import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AccessService } from '../../../../core/services/access.service';
import { AuthHelper } from '../../../../core/helpers/auth.helper';

@Component({
  selector: 'app-siderbar',
  standalone: false,
  templateUrl: './siderbar.html',
  styleUrl: './siderbar.css'
})
export class Siderbar implements OnInit {

  private authHelper = inject(AuthHelper);

  nomeUsuario: string = '';
  usuarioLogado: any;

  constructor(
    public access: AccessService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.usuarioLogado = this.authHelper.get();

    this.nomeUsuario =
      this.usuarioLogado?.nomeUsuario ??
      'Usuário';
  }

  logout(): void {

    const confirmar = confirm(
      `Deseja realmente sair do sistema, ${this.nomeUsuario}?`
    );

    if (!confirmar) {
      return;
    }

    // Remove os dados do usuário autenticado
    this.authHelper.remove();

    // Redireciona para a tela de login
    this.router.navigate(['/login/autenticar-usuario']);
  }
}
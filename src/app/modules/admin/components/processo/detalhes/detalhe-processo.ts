import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessoService } from '../../../../../core/services/processo.service';


@Component({
  selector: 'app-detalhe-processo',
  templateUrl: './detalhe-processo.html',
  standalone:false,
  styleUrls: ['./detalhe-processo.css']
})
export class DetalheProcesso implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private processoService = inject(ProcessoService);

  carregando = false;
  processo: any = null;

  id!: string;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.carregar();
  }

carregar() {
  this.carregando = true;

  this.processoService.ObterProcessoPorId(this.id).subscribe({
    next: (res) => {

      console.log('🔥 PROCESSO BACKEND:', res); // 👈 AQUI

      this.processo = res;
      this.carregando = false;
    },
    error: () => {
      this.processo = null;
      this.carregando = false;
    }
  });
}

  voltar() {
    this.router.navigate(['/admin/consultar-processo']);
  }

}
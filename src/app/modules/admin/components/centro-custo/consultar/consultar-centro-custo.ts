import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { CentroCustoService } from '../../../../../core/services/centro-custo.service';
import { CentroCustoResponse } from '../../../../../core/models/centro-custo/centro-custo-response';


@Component({
    selector: 'app-consultar-centro-custo',
    standalone: false,
    templateUrl: './consultar-centro-custo.html',
    styleUrl: './consultar-centro-custo.css'
})
export class ConsultarCentroCusto implements OnInit {

    displayedColumns: string[] = [
        'nome',
        'descricao',
        'ativo',
        'acoes'
    ];

    dataSource = new MatTableDataSource<CentroCustoResponse>([]);
    consulta: CentroCustoResponse[] = [];

    totalRegistros = 0;
    paginaAtual = 1;
    tamanhoPagina = 10;
    totalPaginas = 1;
    paginasVisiveis: number[] = [];

    carregando = false;
    filtro = '';

    mensagemErro: string[] = [];
    mensagemSucesso: string[] = [];

    private centroCustoService = inject(CentroCustoService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.carregarCentroCustos();
    }

    aplicarFiltro() {
        this.paginaAtual = 1;
        this.carregarCentroCustos();
    }

    carregarCentroCustos() {


        this.carregando = true;
        this.mensagemErro = [];

        this.centroCustoService
            .consultarCentroCustoPaginado(
                this.paginaAtual,
                this.tamanhoPagina
            )
            .subscribe({
                next: (response: any) => {

                    const items = response.items || [];

                    let resultado = items;

                    if (this.filtro?.trim()) {

                        const termo = this.filtro.toLowerCase();

                        resultado = items.filter((x: CentroCustoResponse) =>
                            x.nome?.toLowerCase().includes(termo) ||
                            x.descricao?.toLowerCase().includes(termo)
                        );
                    }

                    this.consulta = resultado;
                    this.dataSource.data = resultado;

                    this.totalRegistros = response.totalCount || 0;

                    this.totalPaginas =
                        Math.ceil(this.totalRegistros / this.tamanhoPagina);

                    this.atualizarPaginasVisiveis();

                    this.carregando = false;

                    this.cdr.detectChanges();
                },
                error: () => {

                    this.mensagemErro = [
                        'Erro ao consultar centros de custo.'
                    ];

                    this.carregando = false;
                }
            });


    }

    irParaPagina(p: number) {

        if (p < 1 || p > this.totalPaginas)
            return;

        this.paginaAtual = p;

        this.carregarCentroCustos();


    }

    atualizarPaginasVisiveis() {

        const maxVisiveis = 5;

        let start = Math.max(
            1,
            this.paginaAtual - 2
        );

        let end = Math.min(
            this.totalPaginas,
            start + maxVisiveis - 1
        );

        start = Math.max(
            1,
            end - maxVisiveis + 1
        );

        this.paginasVisiveis = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i
        );


    }
}

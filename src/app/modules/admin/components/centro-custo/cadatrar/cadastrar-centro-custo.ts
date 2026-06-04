import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CentroCustoService } from '../../../../../core/services/centro-custo.service';

@Component({
    selector: 'app-cadastrar-centro-custo',
    standalone: false,
    templateUrl: './cadastrar-centro-custo.html',
    styleUrl: './cadastrar-centro-custo.css'
})
export class CadastrarCentroCusto {

    private builder = inject(FormBuilder);
    private centroCustoService = inject(CentroCustoService);

    carregando = false;

    mensagemErro: string[] = [];
    mensagemSucesso: string[] = [];

    form = this.builder.group({
        nome: ['', Validators.required],
        descricao: [''],
        ativo: [true]
    });

    get podeEnviar(): boolean {
        return this.form.valid && !this.carregando;
    }

    onSubmit(): void {


        this.mensagemErro = [];
        this.mensagemSucesso = [];

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.carregando = true;

        const request = {
            nome: this.form.value.nome!,
            descricao: this.form.value.descricao ?? '',
              ativo: this.form.value.ativo
        };

        this.centroCustoService
            .cadastrarCentroCusto(request)
            .subscribe({
                next: (response) => {

                    this.mensagemSucesso = [response.message];

                    this.form.reset({
                        ativo: true
                    });

                    this.carregando = false;
                },
                error: (err) => this.tratarErro(err)
            });


    }

    private tratarErro(err: HttpErrorResponse): void {


        this.mensagemErro = [];

        const e = err.error;

        if (e?.errors) {

            for (const key in e.errors) {
                this.mensagemErro.push(...e.errors[key]);
            }

        } else if (e?.mensagem) {

            this.mensagemErro.push(e.mensagem);

        } else if (e?.message) {

            this.mensagemErro.push(e.message);

        } else {

            this.mensagemErro.push('Erro inesperado.');
        }

        this.carregando = false;


    }
}

import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, of } from 'rxjs';

import { ContratoService } from '../../../../../core/services/contrato.service';
import { PessoaService } from '../../../../../core/services/pessoa.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { ContratoRequest } from '../../../../../core/models/contrato/contrato-request';

@Component({
  selector: 'app-cadastrar-contrato',
  standalone: false,
  templateUrl: './cadastrar-contrato.html',
  styleUrl: './cadastrar-contrato.css'
})
export class CadastrarContrato implements OnInit {

  // =========================
  // INJEÇÕES
  // =========================

  private builder = inject(FormBuilder);
  private contratoService = inject(ContratoService);
  private pessoaService = inject(PessoaService);

  // =========================
  // ESTADO
  // =========================

  carregando = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  pessoasFiltradas: PessoaResumo[] = [];

  pessoaSelecionada?: PessoaResumo;

  // =========================
  // FORM
  // =========================

  form = this.builder.group({
    numero: ['', Validators.required],
    pessoaId: ['', Validators.required],
    valorContrato: [0, Validators.required],
    dataInicio: ['', Validators.required],
    dataFim: [''],
   
  });

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {}

  // =========================
  // AUTOCOMPLETE CLIENTE
  // =========================

  buscarPessoa(nome: string): void {

    if (!nome || nome.length < 2) {
      this.pessoasFiltradas = [];
      return;
    }

    this.pessoaService
      .consultarPessoasResumo(nome)
      .pipe(
        catchError(() => of([]))
      )
      .subscribe({
        next: (response) => {
          this.pessoasFiltradas = response;
        }
      });
  }

  selecionarPessoa(pessoa: PessoaResumo): void {

    this.pessoaSelecionada = pessoa;

    this.form.patchValue({
      pessoaId: pessoa.id
    });

    this.pessoasFiltradas = [];
  }

  removerPessoa(): void {

    this.pessoaSelecionada = undefined;

    this.form.patchValue({
      pessoaId: ''
    });
  }

  // =========================
  // SUBMIT
  // =========================

  onSubmit(): void {

    this.mensagemErro = [];
    this.mensagemSucesso = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.pessoaSelecionada) {
      this.mensagemErro = ['Selecione um cliente.'];
      return;
    }

    this.carregando = true;

    const request: ContratoRequest = {
      numero: this.form.value.numero!,
      pessoaId: this.form.value.pessoaId!,
      valorContrato: Number(this.form.value.valorContrato),
      dataInicio: new Date(this.form.value.dataInicio!),
      dataFim: this.form.value.dataFim
        ? new Date(this.form.value.dataFim)
        : undefined,
     
    };

    this.contratoService
      .cadastrarContrato(request)
      .subscribe({
        next: (response: any) => {

          this.resetarFormulario();

          this.mensagemSucesso = [
            response.message ?? 'Contrato cadastrado com sucesso.'
          ];

          this.carregando = false;
        },

        error: (error: HttpErrorResponse) => {
          this.tratarErro(error);
        }
      });
  }

  // =========================
  // RESET
  // =========================

  private resetarFormulario(): void {

    this.form.reset({
      valorContrato: 0
    });

    this.pessoaSelecionada = undefined;
    this.pessoasFiltradas = [];
  }

  // =========================
  // ERROS
  // =========================

  private tratarErro(error: HttpErrorResponse): void {

    this.mensagemErro = [];

    const errorResponse = error.error;

    if (errorResponse?.errors) {

      for (const key in errorResponse.errors) {
        this.mensagemErro.push(
          ...errorResponse.errors[key]
        );
      }

    } else if (errorResponse?.message) {

      this.mensagemErro.push(
        errorResponse.message
      );

    } else {

      this.mensagemErro.push(
        'Erro inesperado ao cadastrar contrato.'
      );
    }

    this.carregando = false;
  }
}
import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

import { ContratoService } from '../../../../../core/services/contrato.service';
import { PessoaService } from '../../../../../core/services/pessoa.service';
import { ProcessoService } from '../../../../../core/services/processo.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { ContratoRequest } from '../../../../../core/models/contrato/contrato-request';
import { ProcessoAutoComplete } from '../../../../../core/models/processo/processo-auto-complete';

@Component({
  selector: 'app-cadastrar-contrato',
  standalone: false,
  templateUrl: './cadastrar-contrato.html',
  styleUrl: './cadastrar-contrato.css'
})
export class CadastrarContrato implements OnInit {

  private builder = inject(FormBuilder);
  private contratoService = inject(ContratoService);
  private pessoaService = inject(PessoaService);
  private processoService = inject(ProcessoService);
  private cdr = inject(ChangeDetectorRef);
 private zone = inject(NgZone);
  carregando = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  processosFiltrados: ProcessoAutoComplete[] = [];
  processosSelecionados: ProcessoAutoComplete[] = [];
  clientesFiltrados: PessoaResumo[] = [];
  clienteSelecionado?: PessoaResumo;

  form = this.builder.group({
    numero: ['', Validators.required],
   
    dataInicio: ['', Validators.required],
    dataFim: [''],
  });

  ngOnInit(): void {}

  get podeEnviar(): boolean {
    return (
      this.form.valid &&
      this.clienteSelecionado != null &&
      this.processosSelecionados.length > 0 &&
      !this.carregando
    );
  }

  // =========================
  // CLIENTE
  // =========================
  buscarClientes(nome: string) {
    this.pessoaService.consultarPessoasResumo(nome)
      .pipe(catchError(() => of([])))
      .subscribe(res => {
        this.clientesFiltrados = res;
      });
  }

  // =========================
  // PROCESSO
  // =========================
  buscarProcessos(termo: string) {

    if (!termo || termo.length < 2) {
      this.processosFiltrados = [];
      return;
    }

    this.processoService.consultarProcessoAutoComplete(termo)
      .pipe(catchError(() => of([])))
      .subscribe(res => {
        this.processosFiltrados = res;
      });
  }

  selecionarProcesso(processo: ProcessoAutoComplete) {

    if (!this.processosSelecionados.some(x => x.id === processo.id)) {
      this.processosSelecionados.push(processo);
    }

    this.processosFiltrados = [];
  }

  removerProcesso(processo: ProcessoAutoComplete) {
    this.processosSelecionados =
      this.processosSelecionados.filter(x => x.id !== processo.id);
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

  if (!this.clienteSelecionado) {
    this.mensagemErro = ['Selecione um cliente'];
    return;
  }

  this.zone.run(() => {
    this.carregando = true;
    this.cdr.detectChanges();
  });



  const request: ContratoRequest = {
    numero: this.form.value.numero!,
    pessoaId: this.clienteSelecionado.id,

    dataInicio: new Date(this.form.value.dataInicio!),
    dataFim: this.form.value.dataFim
      ? new Date(this.form.value.dataFim)
      : undefined,
    processosIds: this.processosSelecionados.map(x => x.id)
  };

  this.contratoService.cadastrarContrato(request)
    .pipe(
      finalize(() => {
        this.zone.run(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        });
      })
    )
    .subscribe({

      next: (res: any) => {

        this.zone.run(() => {

          this.resetar();

          this.mensagemSucesso = [
            res.message ?? 'Contrato cadastrado com sucesso.'
          ];

          this.cdr.detectChanges();
        });
      },

      error: (err: HttpErrorResponse) => {

        this.zone.run(() => {

          const e = err?.error;

          this.mensagemErro = [];

          if (e?.errors) {
            for (const key in e.errors) {
              this.mensagemErro.push(...e.errors[key]);
            }
          }
          else if (e?.message) {
            this.mensagemErro.push(e.message);
          }
          else {
            this.mensagemErro.push('Erro inesperado ao cadastrar contrato.');
          }

          this.carregando = false;

          this.cdr.detectChanges();

          console.log('ERRO BACKEND:', e);
        });
      }
    });
}  onMoneyInput(event: any) {

  let value = event.target.value.replace(/\D/g, '');



  const numericValue = Number(value);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue / 100);

 
  // atualiza o INPUT visual
  event.target.value = formatted;
}

  // =========================
  // RESET
  // =========================
   private resetar() {

   

        this.clienteSelecionado = undefined;
        this.clientesFiltrados = [];
        this.processosFiltrados = [];
        this.processosSelecionados = [];
    }


  // =========================
  // MOEDA
  // =========================

  
}
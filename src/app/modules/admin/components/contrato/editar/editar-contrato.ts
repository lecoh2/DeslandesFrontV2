declare var bootstrap: any;
import { ChangeDetectorRef, Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

import { ContratoService } from '../../../../../core/services/contrato.service';
import { PessoaService } from '../../../../../core/services/pessoa.service';
import { ProcessoService } from '../../../../../core/services/processo.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { ContratoRequest } from '../../../../../core/models/contrato/contrato-request';
import { ProcessoAutoComplete } from '../../../../../core/models/processo/processo-auto-complete';
import { ContratoResponse } from '../../../../../core/models/contrato/contrato-response';
import { TipoEntidadeEnum } from '../../../../../core/models/enums/tipo-entidade/tipo-entidadeEnum';
import { HistoricoService } from '../../../../../core/services/historico.service';

@Component({
    selector: 'app-editar-contrato',
    standalone: false,
    templateUrl: './editar-contrato.html',
    styleUrl: './editar-contrato.css'
})
export class EditarContrato implements OnInit {
    @ViewChild('modalHistorico')
    modalHistorico!: ElementRef;

    private builder = inject(FormBuilder);
    private contratoService = inject(ContratoService);
    private pessoaService = inject(PessoaService);
    private processoService = inject(ProcessoService);
    private historicoService = inject(HistoricoService);
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);
    private zone = inject(NgZone);
    historico: any[] = [];
    carregandoHistorico = false;
    id!: string;

    carregando = false;

    mensagemErro: string[] = [];
    mensagemSucesso: string[] = [];

    contratoId!: string;

    clientesFiltrados: PessoaResumo[] = [];
    clienteSelecionado?: PessoaResumo;

    processosFiltrados: ProcessoAutoComplete[] = [];
    processosSelecionados: ProcessoAutoComplete[] = [];

    form = this.builder.group({
        numero: ['', Validators.required],
        valorContrato: [0, Validators.required],
        dataInicio: ['', Validators.required],
        dataFim: [''],
        observacao: ['']
    });

    ngOnInit(): void {
        this.contratoId = this.route.snapshot.paramMap.get('id')!;
        this.carregarContrato();
    }

    get podeEnviar(): boolean {
        return (
            this.form.valid &&
            this.clienteSelecionado != null &&
            this.processosSelecionados.length > 0 &&
            !this.carregando
        );
    }

    // =========================
    // CARREGAR CONTRATO
    // =========================
    carregarContrato() {

        this.zone.run(() => {
            this.carregando = true;
            this.cdr.detectChanges();
        });

        this.contratoService.obterContratoPorId(this.contratoId)
            .pipe(finalize(() => {
                this.zone.run(() => {
                    this.carregando = false;
                    this.cdr.detectChanges();
                });
            }))
            .subscribe({
                next: (res: any) => {

                    this.form.patchValue({
                        numero: res.numero,
                        valorContrato: res.valorTotal?.toString(),
                        dataInicio: res.dataInicio?.substring(0, 10),
                        dataFim: res.dataFim?.substring(0, 10),
                    });

                    // =========================
                    // CLIENTE (CORRETO)
                    // =========================
                    this.clienteSelecionado = {
                        id: res.pessoaId,
                        nome: res.nomePessoa
                    } as PessoaResumo;

                    // =========================
                    // PROCESSOS (CORRETO)
                    // =========================
                    this.processosSelecionados = res.processos ?? [];

                    this.cdr.detectChanges();
                },
                error: (err: HttpErrorResponse) => {
                    this.tratarErro(err);
                }
            });
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
    // PROCESSOS
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

        const rawValor = (this.form.value.valorContrato ?? '').toString();
        console.log('VALOR RAW:', this.form.value.valorContrato);
        const request: ContratoRequest = {
            numero: this.form.value.numero!,
            pessoaId: this.clienteSelecionado.id,
            valorTotal: this.converterMoedaParaDecimal(rawValor),
            dataInicio: new Date(this.form.value.dataInicio!),
            dataFim: this.form.value.dataFim
                ? new Date(this.form.value.dataFim)
                : undefined,
            processosIds: this.processosSelecionados.map(x => x.id),
            observacao: this.form.value.observacao!
        };

        this.contratoService.editarContrato(this.contratoId, request)
            .pipe(finalize(() => {
                this.zone.run(() => {
                    this.carregando = false;
                    this.cdr.detectChanges();
                });
            }))
            .subscribe({
                next: (res: any) => {

                    console.log('NEXT RECEBIDO', res);

                    this.zone.run(() => {
                        this.mensagemSucesso = [
                            res?.message ?? 'Contrato atualizado com sucesso.'
                        ];

                        this.resetar();
                        this.carregando = false;
                        this.cdr.detectChanges();
                    });
                },

                error: (err) => {

                    console.log('ERRO', err);

                    this.zone.run(() => {
                        this.tratarErro(err);
                        this.carregando = false;
                        this.cdr.detectChanges();
                    });
                },

                complete: () => {
                    console.log('COMPLETE');
                }
            });
    }
    private converterMoedaParaDecimal(valor: any): number {

        if (!valor) return 0;

        const limpo = String(valor)
            .replace(/\./g, '')
            .replace(',', '.')
            .trim();

        return parseFloat(limpo);
    }

    private resetar() {

        this.form.reset({
        valorContrato: 0
    });

        this.clienteSelecionado = undefined;
        this.clientesFiltrados = [];
        this.processosFiltrados = [];
        this.processosSelecionados = [];
    }


    // =========================
    // ERROS
    // =========================
    private tratarErro(err: HttpErrorResponse) {

        this.zone.run(() => {

            this.mensagemErro = [];

            const e = err?.error;

            if (e?.errors) {
                for (const key in e.errors) {
                    this.mensagemErro.push(...e.errors[key]);
                }
            }
            else if (e?.message) {
                this.mensagemErro.push(e.message);
            }
            else {
                this.mensagemErro.push('Erro inesperado.');
            }

            this.carregando = false;
            this.cdr.detectChanges();

            console.log('ERRO EDITAR CONTRATO:', e);
        });
    }

    // =========================
    // MOEDA
    // =========================
    formatarMoeda(event: any) {

        let valor = event.target.value.replace(/\D/g, '');

        valor = (Number(valor) / 100).toFixed(2) + '';
        valor = valor.replace('.', ',');
        valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        event.target.value = valor;
    }
    abrirHistoricoProcesso(contratoId: string) {

        this.carregandoHistorico = true;
        this.historico = [];

        const modal = new bootstrap.Modal(this.modalHistorico.nativeElement);

        this.historicoService
            .ConsultarHistorico(TipoEntidadeEnum.Contrato, contratoId)
            .subscribe({

                next: (res) => {

                    this.historico = (res ?? []).map(h => ({
                        ...h,
                        antes: h.dadosAntes ? JSON.parse(h.dadosAntes) : null,
                        depois: h.dadosDepois ? JSON.parse(h.dadosDepois) : null
                    }));

                    this.carregandoHistorico = false;

                    modal.show(); // 👈 AQUI (depois de ter dado certo)
                    this.cdr.detectChanges();
                },

                error: (err) => {
                    console.error(err);
                    this.carregandoHistorico = false;
                }
            });
    }
    getMudancas(h: any): { campo: string, antes: any, depois: any }[] {
        if (!h.antes || !h.depois) return [];

        const mudancas: any[] = [];

        Object.keys(h.depois).forEach(key => {
            const antes = h.antes[key];
            const depois = h.depois[key];

            if (JSON.stringify(antes) !== JSON.stringify(depois)) {
                mudancas.push({ campo: key, antes, depois });
            }
        });

        return mudancas;
    } formatarValor(valor: any, campo: string): string {

  if (valor === null || valor === undefined) return '-';

  if (Array.isArray(valor)) {
    return valor.join(', ');
  }

  if (typeof valor === 'boolean') {
    return valor ? 'Sim' : 'Não';
  }

  if (campo.toLowerCase().includes('data')) {
    return new Date(valor).toLocaleDateString('pt-BR');
  }

  return valor.toString();
}
   onMoneyInput(event: any) {

  let value = event.target.value.replace(/\D/g, '');

  if (!value) {
    this.form.get('valorContrato')?.setValue(0, { emitEvent: false });
    return;
  }

  const numericValue = Number(value);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue / 100);

  // atualiza o FORM (valor real)
  this.form.get('valorContrato')?.setValue(numericValue / 100, {
    emitEvent: false
  });

  // atualiza o INPUT visual
  event.target.value = formatted;
}
    formatarCampo(campo: string): string {

        const map: any = {

            // =========================
            // CONTRATO
            // =========================
            Numero: 'Número do Contrato',
            PessoaId: 'Cliente',
            NomePessoa: 'Nome do Cliente',
            ValorTotal: 'Valor Total',
            DataInicio: 'Data de Início',
            DataFim: 'Data de Fim',
            Status: 'Status',
            Objeto: 'Objeto',

            // =========================
            // RELACIONAMENTO
            // =========================
            Processos: 'Processos Vinculados'

        };

        return map[campo] ?? campo;
    }
}
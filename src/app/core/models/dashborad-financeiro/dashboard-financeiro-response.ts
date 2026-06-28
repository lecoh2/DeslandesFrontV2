export interface DashboardFinanceiroResponse {

  totalReceberMes: number;
  totalRecebidoMes: number;
  totalPagarMes: number;
  totalPagoMes: number;
  saldoMes: number;
  inadimplencia: number;
  metaMensal: number;
  metaUsadaManual: boolean;
  percentualMeta: number;
  metaAutomatica: boolean;
metaAnual: number;
  receitaDespesa: ReceitaDespesaItem[];

  categorias: CategoriaItem[];

  ultimasMovimentacoes: MovimentacaoItem[];
  fluxoPrevistoRealizado:
  FluxoPrevistoRealizadoItem[];
  fluxoCaixaFuturo:
  FluxoCaixaFuturoItem[];
  fluxoCaixaProjetado: FluxoCaixaProjetadoResponse[];
}

export interface ReceitaDespesaItem {
  mes: string;
  receitas: number;
  despesas: number;
}

export interface CategoriaItem {
  categoria: string;
  valor: number;
}

export interface MovimentacaoItem {
  id: string;
  data: string;
  descricao: string;
  pessoa: string;
  valor: number;
  tipo: string;
  status: number;
}
export interface FluxoPrevistoRealizadoItem {
  mes: string;
  previsto: number;
  realizado: number;
}
export interface FluxoCaixaFuturoItem {
  periodo: string;
  entradas: number;
  saidas: number;
  saldo: number;
}
export interface FluxoCaixaProjetadoResponse {
  data: string;
  previstoReceber: number;
  previstoPagar: number;
  saldoAcumulado: number;
  SaldoDia: number;
}
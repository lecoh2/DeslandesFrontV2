export interface AndamentoProcesso {
  processoId: string;
  dataMovimentacao: string;
  descricao: string;
  complemento?: string;
  origem?: string;
  capturadoAutomaticamente: boolean;
}
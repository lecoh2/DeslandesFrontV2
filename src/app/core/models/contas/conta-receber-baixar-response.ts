export interface ContaReceberBaixaResponse {

  id: string;

  valorPago: number;

  dataBaixa: Date;

  formaRecebimento: number;

  observacao?: string;
}
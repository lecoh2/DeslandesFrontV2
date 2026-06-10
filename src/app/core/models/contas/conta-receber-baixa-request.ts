import { FormaRecebimento } from "../enums/conta/forma-recebimentoEnum";

export interface ContaReceberBaixaRequest {

  valorPago: number;

  dataBaixa: Date;

  formaRecebimento: FormaRecebimento;

  observacao?: string;
}
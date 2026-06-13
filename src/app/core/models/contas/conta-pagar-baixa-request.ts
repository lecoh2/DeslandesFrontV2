import { FormaRecebimento } from "../enums/conta/forma-recebimentoEnum";

export interface ContaPagarBaixaRequest {

  valorPago: number;

  dataBaixa: Date;

   formaRecebimento: FormaRecebimento;

  observacao?: string;
}
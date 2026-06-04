import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PessoaResumo } from '../../../../core/models/pessoa/pessoa-resumo';

@Component({
  selector: 'app-autocomplete-pessoa-unica',
  standalone: false,
  templateUrl: 'auto-complete-pessoa-unica.html',
})
export class AutocompletePessoaUnica {

  @Input() label: string = 'Pessoa';
  @Input() placeholder: string = 'Digite o nome';

  @Input() resultados: PessoaResumo[] = [];

  @Input() selecionada?: PessoaResumo;

  @Output() buscar = new EventEmitter<string>();

  @Output() selecionadaChange =
    new EventEmitter<PessoaResumo | undefined>();

  control = new FormControl('');

  mostrarSugestoes = false;

  onBuscar(): void {

    const valor = this.control.value ?? '';

    this.buscar.emit(valor);
  }

  selecionar(p: PessoaResumo): void {

    this.selecionada = p;

    this.selecionadaChange.emit(p);

    this.control.setValue('');

    this.mostrarSugestoes = false;
  }

  remover(): void {

    this.selecionada = undefined;

    this.selecionadaChange.emit(undefined);
  }

  ocultarComDelay(): void {

    setTimeout(() => {

      this.mostrarSugestoes = false;

    }, 200);
  }

  formatarDocumento(doc?: string | null): string {

    if (!doc) return '';

    const numeros = doc.replace(/\D/g, '');

    if (numeros.length === 11) {
      return numeros.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
    }

    if (numeros.length === 14) {
      return numeros.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }

    return doc;
  }
}
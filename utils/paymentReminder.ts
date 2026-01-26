import { formatEur } from './vat';

export function buildPaymentReminderPT(args: {
  client: string;
  project: string;
  milestone: string;
  amountNet: number;
  vatRate?: number;
  dueDate?: string;
}) {
  const vatLabel = args.vatRate === 0.06 ? '6%' : args.vatRate === 0.23 ? '23%' : 'taxa legal';
  const due = args.dueDate ? new Date(args.dueDate).toLocaleDateString('pt-PT') : '—';

  return [
    `Olá ${args.client},`,
    ``,
    `Só para confirmar: o pagamento referente a "${args.milestone}" do projeto "${args.project}" encontra-se pendente.`,
    `Valor: ${formatEur(args.amountNet)} (NET) + IVA (${vatLabel}).`,
    `Data prevista: ${due}.`,
    ``,
    `Assim que estiver regularizado, seguimos para o próximo marco.`,
    `Arq. José Ferreira | FERREIRARQUITETOS`,
  ].join('\n');
}

export function buildPaymentReminderEN(args: {
  client: string;
  project: string;
  milestone: string;
  amountNet: number;
  vatRate?: number;
  dueDate?: string;
}) {
  const vatLabel = args.vatRate === 0.06 ? '6%' : args.vatRate === 0.23 ? '23%' : 'legal rate';
  const due = args.dueDate ? new Date(args.dueDate).toLocaleDateString('en-GB') : '—';

  return [
    `Hi ${args.client},`,
    ``,
    `Just a quick reminder: the payment for "${args.milestone}" on project "${args.project}" is still pending.`,
    `Amount: ${formatEur(args.amountNet)} (NET) + VAT (${vatLabel}).`,
    `Due date: ${due}.`,
    ``,
    `Once settled, we’ll move to the next milestone.`,
    `Arq. José Ferreira | FERREIRARQUITETOS`,
  ].join('\n');
}

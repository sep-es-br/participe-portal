export default function formatCPF(text: string) {
  const badchars = /[^\d]/g;
  const mask = /(\d{3})(\d{3})(\d{3})(\d{2})/;
  const cpf = text.replace(badchars, '');
  return cpf.replace(mask, '$1.$2.$3-$4');
}

/** Remove tudo que não for dígito. */
export function cpfDigitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formata até 11 dígitos como 000.000.000-00 */
export function formatCpfMask(digits: string): string {
  const d = cpfDigitsOnly(digits).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

export function isCpfLengthValid(digits: string): boolean {
  return cpfDigitsOnly(digits).length === 11;
}

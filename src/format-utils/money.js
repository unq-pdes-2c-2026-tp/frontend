const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
});

export function asMoney(amount){
return arsFormatter.format(amount)
}
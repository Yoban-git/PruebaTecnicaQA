/**
 * matcher.js
 * ----------
 * Compara los productos extraídos de la UI contra los productos
 * de la respuesta interceptada. Separado de los steps para poder
 * testearlo de forma aislada si hace falta.
 */

function normalizeName(name = '') {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/\s+/g, ' ')
    .trim();
}

function isSameProduct(uiProduct, apiProduct) {
  const a = normalizeName(uiProduct.name);
  const b = normalizeName(apiProduct.name);
  return a.length > 0 && b.length > 0 && (a.includes(b) || b.includes(a));
}

function priceDiffers(uiProduct, apiProduct, tolerance = 0.01) {
  return Math.abs(uiProduct.price - apiProduct.price) > tolerance;
}

function crossValidate(uiResults, apiResults) {
  const report = { matched: [], unmatched: [], discrepancies: [] };

  for (const uiItem of uiResults) {
    const apiMatch = apiResults.find((apiItem) => isSameProduct(uiItem, apiItem));

    if (!apiMatch) {
      report.unmatched.push(uiItem);
      continue;
    }

    report.matched.push({ ui: uiItem, api: apiMatch });

    if (priceDiffers(uiItem, apiMatch)) {
      report.discrepancies.push({ name: uiItem.name, uiPrice: uiItem.price, apiPrice: apiMatch.price });
    }
  }

  return report;
}

module.exports = { crossValidate, isSameProduct, normalizeName };

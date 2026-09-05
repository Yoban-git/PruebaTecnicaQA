const Helper = require('@codeceptjs/helper');

/**
 * NetworkHelper
 * -------------
 * Escucha las respuestas de red que ya está consumiendo el frontend
 * (page.on('response', ...)) SIN modificarlas, para poder comparar
 * después contra lo que se pintó en la UI.
 *
 * Se usa 'response' y no 'route' porque route() intercepta/bloquea
 * la petición antes de que salga; aquí solo queremos OBSERVAR.
 */
class NetworkHelper extends Helper {
  constructor(config) {
    super(config);
    this.capturedResponses = [];
    this._responseListener = null;

    // Endpoint real confirmado con DevTools: POST /api/plp/search
    // (se puede sobreescribir vía config si algún día cambia).
    this.searchEndpointPattern = config.searchEndpointPattern
      ? new RegExp(config.searchEndpointPattern, 'i')
      : /api\/plp\/search/i;

    // Modo debug: imprime TODAS las respuestas de red (url + content-type),
    // sin filtrar, para poder identificar el endpoint real.
    // Actívalo con: DEBUG_NETWORK=true npm test
    this.debug = config.debug || process.env.DEBUG_NETWORK === 'true';
  }

  _before() {
    this.capturedResponses = [];
  }

  /**
   * Debe llamarse ANTES de disparar la búsqueda (antes del Enter),
   * porque la petición puede resolverse antes de que exista el listener.
   */
  async startInterceptingSearchResponses() {
    const page = this.helpers.Playwright.page;
    this.capturedResponses = [];

    this._responseListener = async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';

      if (this.debug) {
        console.log(`[NetworkHelper] ${response.status()} | ${contentType} | ${url}`);
      }

      if (!this.searchEndpointPattern.test(url)) return;
      if (!contentType.includes('application/json')) return;

      try {
        const json = await response.json();
        this.capturedResponses.push({ url, json });
      } catch (err) {
        // No es JSON válido o el body ya no está disponible; se ignora.
      }
    };

    page.on('response', this._responseListener);
  }

  stopInterceptingSearchResponses() {
    const page = this.helpers.Playwright.page;
    if (this._responseListener) {
      page.off('response', this._responseListener);
      this._responseListener = null;
    }
  }

  /**
   * Extrae los productos del payload real de Liverpool (/api/plp/search),
   * confirmado con DevTools:
   *   { records: [ { title, priceInfo: { salePrice, listPrice: { price }, ... } } ] }
   *
   * Solo usa la ÚLTIMA respuesta capturada: cada acción (buscar, filtrar,
   * ordenar) dispara una nueva petición a este mismo endpoint, así que la
   * última es el estado final que realmente se ve en la UI. Concatenar
   * todas las respuestas mezclaría resultados de antes y después de filtrar.
   *
   * @param {number} [limit] - si se pasa, corta el resultado a los primeros N
   *   (útil para comparar 1:1 contra los N que se extrajeron de la UI).
   */
  getInterceptedProducts(limit) {
    if (this.capturedResponses.length === 0) return [];

    const { json } = this.capturedResponses[this.capturedResponses.length - 1];
    const items = this._findProductArray(json) || [];

    const products = [];
    for (const item of items) {
      const name = item.title || item.name || item.productName;
      const rawPrice =
        item.priceInfo?.salePrice ??
        item.priceInfo?.listPrice?.price ??
        item.priceInfo?.promoPrice?.price ??
        item.price ??
        item.salePrice;

      if (!name || rawPrice === undefined) continue;
      products.push({ name: String(name).trim(), price: this._normalizePrice(rawPrice) });
    }

    return typeof limit === 'number' ? products.slice(0, limit) : products;
  }

  getRawCapturedResponses() {
    return this.capturedResponses; // útil para debug si el matching falla
  }

  /**
   * Primero intenta la ruta conocida (node.records, confirmada con DevTools).
   * Si no aparece (por ejemplo, si Liverpool cambia el contrato), cae al
   * fallback recursivo que busca cualquier array cuyo primer elemento
   * tenga 'title' o 'name'.
   */
  _findProductArray(node, visited = new Set()) {
    if (!node || typeof node !== 'object' || visited.has(node)) return null;
    visited.add(node);

    if (Array.isArray(node.records) && node.records.length > 0) {
      return node.records;
    }

    if (Array.isArray(node) && node.length > 0) {
      const first = node[0];
      if (first && typeof first === 'object' && (first.name || first.title)) return node;
    }

    for (const key of Object.keys(node)) {
      const result = this._findProductArray(node[key], visited);
      if (result) return result;
    }
    return null;
  }

  _normalizePrice(raw) {
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') return parseFloat(raw.replace(/[^0-9.]/g, ''));
    return NaN;
  }
}

module.exports = NetworkHelper;
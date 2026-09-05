const {I} = inject();

class SearchPage {
    locator = {
        buscador: '(//input[@placeholder="Buscar por producto, categoría y más..."])[1]',
        ordenador: '//button[@id="sorting-button"]',
        tituloFiltro:'//span[contains(text(),"Color")]',
        encabezadoarticulos: '//p[@class="font-semibold text-body-base"]',
        articulos: '//h3[@class="text-body-base font-body-base line-clamp-2"]',
        // TODO: confirmar este selector con DevTools; es el contenedor del precio
        // que corresponde a cada tarjeta de producto en 'articulos'.
        precios: '//span[@class="text-body-xl font-semibold text-price-primary font-bold"]',
        listaOrdenes: '//ul[@id="sorting-options"]',
        
    };

    home() {
        I.amOnPage('/');
    }

    buscaquedaValida(producto){
        I.fillField(this.locator.buscador, producto);
        I.pressKey('Enter');
        I.waitForVisible(this.locator.encabezadoarticulos, 5);
        I.waitForVisible(this.locator.ordenador, 5);
    }

    filtroColor(color){
        let aplicarColor = `//div[contains(text(),"${color}")]`;
        I.scrollTo(this.locator.tituloFiltro);
        I.click(aplicarColor);
        I.waitForVisible(this.locator.encabezadoarticulos, 5);
        I.wait(2);
    }
    filtroPrecios(orden){
        let aplicarOrden = `//li[contains(text(),"${orden}")]`;
        I.click(this.locator.ordenador);
        I.waitForElement(this.locator.listaOrdenes);
        I.click(aplicarOrden);
        I.wait(3); //pequeña espara para cargar todos los componentes de la pagina
    }

    resultado(){
        I.wait(3); //espear de verificacion de resultados,
        //al poner un wait el metodo solo espera lso segundos indicados sin importar el productos que se busques
    }

    /**
     * Extrae nombre y precio de las primeras N tarjetas visibles en la UI,
     * en el orden en que aparecen en el DOM, e imprime el resultado en consola
     * (requisito explícito del Part 1, paso 6).
     */
    async extraerProductos(n = 5) {
        const total = await I.grabNumberOfVisibleElements(this.locator.articulos);
        const resultados = [];

        for (let i = 1; i <= Math.min(n, total); i++) {
            const nombre = await I.grabTextFrom(`(${this.locator.articulos})[${i}]`);
            const precioRaw = await I.grabTextFrom(`(${this.locator.precios})[${i}]`);
            resultados.push({ name: nombre.trim(), price: this._parsePrecio(precioRaw) });
        }

        console.log('\n=== Primeros 5 resultados (UI) ===');
        console.table(resultados);

        return resultados;
    }

    _parsePrecio(raw) {
        return parseFloat(String(raw).replace(/[^0-9.]/g, ''));
    }
}

module.exports = new SearchPage();
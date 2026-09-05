## ¿Qué  no  automatizarías  en  este  flujo  y  por  qué? ##
La intercepcion de una peticion, porque al ser una gran cantidad de datos se tiene que limitar abstante, segunda se tiene que tomar el cuenat la seguridad de la pagina, si esta tiene una buena prtecion bloquera todas pruebas.

## Si Liverpool añadiera un CAPTCHA añl procese de búsqueda, ¿cómo lo gestionarías en tu conjuntoi de pruebas? ##
Yo en cuentro dos posible soluciones, la primera agregar un wait aproximado de 2 minustos, esto da un tiempo de respuesta
para que el QA realize ese captcha y poder conninuar con las pruebas, la sugunda es tomar evidenica del problema, una captura 
de pantalla, crear un reporte y informar al lider del equipo que se tiene un problema de acceso.

## ¿Qué riesgos de inestabilidad existen en esat prueba y cómo los mitigaste? ##
1.- Id dinamicos, aunque yo encontrara localizador unico en mi navegador, cuando se ejecutan las pruebas este localizador
no existe, porque cambia el valor, lo que hago es, si el localizador tiene un texto buscarlo directamente por el o utilizar
algun otro parametro.
2.- multiples resultados: aunque un localizador tenga un parametro unico, existen dos elementos y utilizo la posion para escoger
el localizador adecuado
3.- Seguridad, al ejecutar las pruebas sin la interfaz grafica Liverppol nos detecta como boots, nos bloquea el acceso a la pagina, al momento de hacer la integracion con el CI las pruebas no pasan por el bloque, sinseramente no se me ocurre como 
solucionarlo.
Sindo complemtamente sinsero le pregunatria a la IA paar que me de una idea de como se debe de solucionar, asi le hice con la
itercepcion de las peticiones, le fui prefuntando como se hace cada cosa, donde debo de buscar, que resultados similares deberia
de encontrar mas porque no conosco del tema.

##  Si  tuvieras  que  añadir  esto  a  la  canalización  de  CI  de  un  equipo  que  ejecuta  más  de  50  conjuntos  de  pruebas,  ¿qué  cambiarías? ##
La forma de integrar el CI, por lo qu entiendo el show de playwright debe estar en false para que se ejecute si problemas,
tambien tengo entendido que hay una forma de que la integracion se haga desde el equipo de forma locar y no directamente desde
Git Action, al hacerlo de forma locar uno lo puede ejecutar en su propio equipo como si fuear el servidor.

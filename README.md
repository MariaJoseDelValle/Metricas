# Metricas-Dashboard de Kpis

Esta aplicacion web se hizo con el fin de poder visualizar las metricas de las distintas areas de TI (Sistemas de Informacion,Desarrollo, Procesos y Listo) para poder medir y comparar resultados, ya sea por miembros de cada area o en general.

## Como correrlo

npm install, npm run dev (levanta el front y back).

### Como agregar un nuevo proyecto al filtro de Desarrollo

1.  Buscar el id de la etiqueta del proyecto en PRISMA,
2.  Ve Backend/Indicadores/desarrollo/etiquetas-proyecto.
3.  Agrega una línea a la lista: { id: <Label_ID>, nombre: '<Nombre visible>' }. El nombre es el texto que se ve en el filtro; no tiene que ser igual al de PRISMA.
4.  Reinicia el backend.

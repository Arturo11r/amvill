## Gestión de UI

- **Componentes** Toda la UI debe intentar utilizar componentes de la ruta src/components/ y si no lo hay tender a crearlos componentes comunes y reutilizables.
- Usa la SKILL interface/design.

## Gestión de Estado

- **Estado Global**: Se utiliza **Zustand** para estados que trascienden módulos, como el carrito de compras (`useCartStore.ts`).
- **Estado Local**: Hooks nativos de React (`useState`, `useReducer`) para lógica interna de componentes.
- **Acceso a Datos**: Uso de hooks personalizados que encapsulan las llamadas a la infraestructura de las features.

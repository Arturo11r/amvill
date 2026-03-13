## Estructura de directorios

El proyecto sigue una estructura modular dentro de `src/`, separando las responsabilidades de cada característica (feature), básicamente es el patrón Clean Arquitecture + Vertical slices, pero sin sobre-ingeniería

```
src/
├── app/                	# Rutas de Next.js (App Router)
├── components/         	# Componentes UI globales y reutilizables
├── core/               	# Lógica central del sistema
├── features/           	# Módulos del negocio (Diseño Hexagonal/Limpia)
│   ├── featureName/    	# Nombre de la feature (Cada capa es opcional, si no es necesara no se crea)
│   │	├── application/	# Casos de uso / interfaces / dto
│   │	├── domain/			# Types de la feature
│   │	├── infrastructure/	# Implementación de las interfaces(application)
│   │	├── presentation/	# Los componentes de React, Hooks de ser necesarios
│   ├── featureName2/	
│   ├── featureName3/
├── hooks/              # Hooks de React reutilizables
├── lib/                # Configuraciones de librerías externas (Supabase, etc)
├── store/              # Estado global (Zustand)
├── types/              # Definiciones de tipos globales
└── utils/              # Funciones de utilidad
```

## Arquitecturas

- Sigue el patrón Clean Arquitecture + Vertical slices pero sin sobre-ingeniería
- **Dependency Injection**: User React Context API solo si se requiere, evaluar documentación DI para mantener la simplicidad.


## Base de Datos AmVill

La base de datos PostgreSQL en Supabase consta de las siguientes tablas principales y sus respectivas políticas de seguridad (RLS):

### Esquema de Tablas

1.  **`products`** (Productos)
    *   `id` (uuid, PK)
    *   `slug` (text, unique)
    *   `brand` (text)
    *   `name` (text)
    *   `flanker` (text, nullable)
    *   `gender` (text, default: 'hombre', check: hombre/mujer/unisex)
    *   `concentration` (text, nullable)
    *   `description` (text, nullable)
    *   `image_url` (text, nullable)
    *   `is_active` (boolean, default: true)
    *   `sort_order` (integer, default: 0)
    *   `created_at`, `updated_at` (timestamptz)

2.  **`product_variants`** (Variantes de Productos)
    *   `id` (uuid, PK)
    *   `product_id` (uuid, FK a products.id)
    *   `size_ml` (integer, check > 0)
    *   `price` (numeric, check >= 0)
    *   `is_active` (boolean, default: true)
    *   `created_at` (timestamptz)

3.  **`product_accords`** (Acordes de Productos)
    *   `id` (uuid, PK)
    *   `product_id` (uuid, FK a products.id)
    *   `accord` (text)

4.  **`orders`** (Pedidos)
    *   `id` (uuid, PK)
    *   `user_id` (uuid, FK a auth.users.id, nullable)
    *   `customer_name` (text)
    *   `customer_phone` (text)
    *   `customer_email` (text, nullable)
    *   `notes` (text, nullable)
    *   `status` (text, default: 'pending', check: pending/confirmed/cancelled)
    *   `created_at` (timestamptz)

5.  **`order_items`** (Ítems del Pedido)
    *   `id` (uuid, PK)
    *   `order_id` (uuid, FK a orders.id)
    *   `variant_id` (uuid, FK a product_variants.id)
    *   `quantity` (integer, default: 1)
    *   `unit_price` (numeric, check >= 0)
    *   `created_at` (timestamptz)

6.  **`user_roles`** (Roles de Usuarios)
    *   `user_id` (uuid, PK, FK a auth.users.id)
    *   `role` (text, check: 'admin')
    *   `created_at` (timestamptz)

### Políticas de Seguridad (RLS)

A continuación, el detalle de permisos y restricciones usando RLS (Row Level Security):

*   **`products`**
    *   **Admin (`ALL`)**: Acceso total si `is_admin()`.
    *   **Público (`SELECT`)**: Puede leer productos activos (`is_active = true`).

*   **`product_variants`**
    *   **Admin (`ALL`)**: Acceso total si `is_admin()`.
    *   **Público (`SELECT`)**: Puede leer variantes activas mientras el producto padre también esté activo.

*   **`product_accords`**
    *   **Admin (`ALL`)**: Acceso total si `is_admin()`.
    *   **Público (`SELECT`)**: Puede leer los acordes de un producto que esté activo.

*   **`orders`**
    *   **Admin (`SELECT`, `UPDATE`)**: Puede consultar todos los pedidos y editarlos.
    *   **Público (`INSERT`)**: Cualquiera (autenticado/anónimo) puede insertar un pedido nuevo con estado 'pending' si el `user_id` corresponde a la sesión o es nulo (anónimos).
    *   **Usuario (`SELECT`)**: Solo puede ver sus propios pedidos.

*   **`order_items`**
    *   **Admin (`ALL`, `SELECT`)**: Acceso total.
    *   **Público (`INSERT`)**: Cualquiera puede insertar si el ítem de carrito pertenece a una de sus propias `orders`, y solo puede insertar ítems de `product_variants` y `products` que estén activos.
    *   **Usuario (`SELECT`)**: Solo puede ver los detalles de ítems de sus propios pedidos.

*   **`user_roles`**
    *   **Usuario (`SELECT`)**: Cada usuario puede leer únicamente su propio registro de rol.

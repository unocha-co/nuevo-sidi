export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Admin'
  },
  {
    name: 'Admin',
    url: '/admin',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Perfil usuarios',
        url: '/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Organizaciones',
        url: '/base/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tipo organización',
        url: '/base/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Grupos de contactos',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Divisiones administrativas',
        url: '/base/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Clases de proyecto',
        url: '/base/progress',
        icon: 'icon-puzzle'
      }
    ]
  }
]

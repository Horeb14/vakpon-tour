# Architecture CSS VakponTour

## Point d'entrée

Toutes les pages chargent `site.css`.

`site.css` conserve `style.css` en dernier pendant la migration afin de garantir le rendu actuel. Les modules sont organisés par responsabilité et peuvent recevoir progressivement les règles correspondantes sans casser les pages.

## Modules

- `modules/base.css` : variables, reset et typographie
- `modules/header.css` : en-tête et navigation desktop
- `modules/mobile-nav.css` : burger et animation avion mobile
- `modules/hero.css` : héros
- `modules/components.css` : boutons, sections, cartes et formulaires
- `modules/pages.css` : règles propres aux pages
- `modules/footer.css` : footer partagé

## Règle de sécurité

Ne jamais charger directement un module dans une page. Ajouter les nouvelles règles dans le module concerné puis conserver l'ordre des imports dans `site.css`.

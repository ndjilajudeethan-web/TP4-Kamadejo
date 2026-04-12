/**
 * @file Un menu simple, responsive bâti en amélioration progressive.
 * @version v4
 */

//*******************
// Déclaration d'objet(s)
//*******************

let menu = {
    javascriptEnabled: document.documentElement.classList.add('js'),
    txtNavClosed: 'Menu',
    txtNavOpen: 'Fermer',
    tagButton: null,
    tagSpan: null,
    tagNav: document.querySelector('.nav'),
    relacherFocus: null,

    /**
     * Confine la navigation clavier à l'intérieur d'un élément.
     * Tab sur le dernier focusable revient au premier, et vice-versa.
     *
     * @param {HTMLElement} element - Conteneur à piéger
     * @returns {Function} Appeler pour libérer le piège
     */
    piegerFocus: function (element) {
        const focusables = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const premier = focusables[0];
        const dernier = focusables[focusables.length - 1];

        function gererTab(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === premier) {
                    e.preventDefault();
                    dernier.focus();
                }
            } else {
                if (document.activeElement === dernier) {
                    e.preventDefault();
                    premier.focus();
                }
            }
        }

        element.addEventListener('keydown', gererTab);
        premier.focus();

        return function () {
            element.removeEventListener('keydown', gererTab);
        };
    },

    configurerNav: function () {
        // Donner un id au nav (requis pour aria-controls)
        if (!this.tagNav.id) {
            this.tagNav.id = 'nav-principal';
        }

        // Labelliser le nav pour les lecteurs d'écran
        if (!this.tagNav.getAttribute('aria-label')) {
            this.tagNav.setAttribute('aria-label', 'Navigation principale');
        }

        //********** Création du bouton du menu mobile

        this.tagButton = document.createElement('button');
        this.tagSpan = document.createElement('span');

        this.tagButton.appendChild(this.tagSpan);

        this.tagButton.className = 'nav__control';
        this.tagButton.type = 'button';

        // Attributs ARIA du bouton hamburger
        this.tagButton.setAttribute('aria-expanded', 'false');
        this.tagButton.setAttribute('aria-controls', this.tagNav.id);
        this.tagButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');

        this.tagSpan.className = 'nav__span';
        this.tagSpan.setAttribute('aria-hidden', 'true');
        this.tagSpan.innerHTML = this.txtNavClosed;

        this.tagNav.prepend(this.tagButton);

        this.tagButton.addEventListener('click', function () {
            menu.ouvrirFermerNav();
        });

        // Navigation fermée initialement
        this.tagNav.classList.add('nav--closed');

        // Fermeture au clavier via Échap
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.tagButton.getAttribute('aria-expanded') === 'true') {
                menu.fermerNav();
            }
        });
    },

    ouvrirFermerNav: function () {
        if (this.tagNav.classList.contains('nav--closed')) {
            this.ouvrirNav();
        } else {
            this.fermerNav();
        }
    },

    ouvrirNav: function () {
        this.tagNav.classList.remove('nav--closed');
        this.tagButton.setAttribute('aria-expanded', 'true');
        this.tagButton.setAttribute('aria-label', 'Fermer le menu de navigation');
        this.tagSpan.innerHTML = this.txtNavOpen;

        // Activer le piège de focus ; déplace le focus au premier élément du menu
        this.relacherFocus = this.piegerFocus(this.tagNav);
    },

    fermerNav: function () {
        this.tagNav.classList.add('nav--closed');
        this.tagButton.setAttribute('aria-expanded', 'false');
        this.tagButton.setAttribute('aria-label', 'Ouvrir le menu de navigation');
        this.tagSpan.innerHTML = this.txtNavClosed;

        // Libérer le piège et rendre le focus au déclencheur (WCAG 2.4.3)
        if (this.relacherFocus) {
            this.relacherFocus();
            this.relacherFocus = null;
        }
        this.tagButton.focus();
    },
};

//*******************
// Écouteurs d'événements
//*******************
window.addEventListener('load', function () {
    menu.configurerNav();
});
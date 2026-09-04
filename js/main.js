document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('site-header');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('main-nav');
  var backdrop = document.getElementById('nav-backdrop');
  var lastFocusedElement;

  var whatsappLink = document.createElement('a');
  whatsappLink.className = 'whatsapp-float';
  whatsappLink.href = 'https://wa.me/2290159055088?text=Bonjour%20VakponTour%2C%20je%20souhaite%20pr%C3%A9parer%20un%20voyage%20au%20B%C3%A9nin.';
  whatsappLink.target = '_blank';
  whatsappLink.rel = 'noopener noreferrer';
  whatsappLink.setAttribute('aria-label', 'Discuter sur WhatsApp');
  whatsappLink.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2a12.7 12.7 0 0 0-10.9 19.2L3.2 28.8l6.6-1.8A12.8 12.8 0 1 0 16 3.2Zm0 22.8c-2 0-3.9-.5-5.6-1.6l-.4-.2-3.9 1 1-3.8-.3-.4A10.4 10.4 0 1 1 16 26Zm5.7-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1a8.5 8.5 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.1-.6l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1 2.8 1.1 3c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.8.6.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>';
  document.body.appendChild(whatsappLink);

  var beninMap = document.getElementById('benin-map');
  if (beninMap && typeof L !== 'undefined') {
    var places = [
      { name: 'Ganvié', coordinates: [6.467, 2.417] },
      { name: 'Cotonou', coordinates: [6.365, 2.418] },
      { name: 'Porto-Novo', coordinates: [6.497, 2.605] },
      { name: 'Ouidah', coordinates: [6.363, 2.086] },
      { name: 'Grand-Popo', coordinates: [6.280, 1.822] }
    ];
    var map = L.map(beninMap, { scrollWheelZoom: false, zoomControl: true }).setView([6.40, 2.25], 10);
    // Fond OpenStreetMap public : aucun compte ni API key n'est nécessaire.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors & copy; CARTO'
    }).addTo(map);
    var mapFallback = document.createElement('a');
    mapFallback.className = 'benin-map-fallback';
    mapFallback.href = 'https://www.google.com/maps/place/Benin';
    mapFallback.target = '_blank';
    mapFallback.rel = 'noopener noreferrer';
    mapFallback.textContent = 'Ouvrir la carte du Bénin';
    beninMap.appendChild(mapFallback);

    places.forEach(function (place) {
      var query = encodeURIComponent(place.name + ', Benin');
      var markerIcon = L.divIcon({
        className: 'vakpon-map-marker',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      var marker = L.marker(place.coordinates, { icon: markerIcon }).addTo(map);
      marker.bindTooltip(place.name, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'benin-map-label'
      });
      marker.on('click', function () {
        window.open('https://www.google.com/maps/search/?api=1&query=' + query, '_blank', 'noopener');
      });
    });
    map.fitBounds(places.map(function (place) { return place.coordinates; }), { padding: [42, 42], maxZoom: 11 });
    map.whenReady(function () { mapFallback.remove(); });
  }

  /* La page active est déterminée automatiquement à chaque chargement. */
  if (nav) {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (!/\.html$/.test(currentPage)) currentPage += '.html';
    var navLinks = nav.querySelectorAll('a:not(.nav-cta-mobile)');
    navLinks.forEach(function (navLink) {
      navLink.classList.remove('active');
      navLink.removeAttribute('aria-current');
    });
    navLinks.forEach(function (link) {
      var linkPage = (link.getAttribute('href') || '').split('#')[0].split('?')[0];
      if (!/\.html$/.test(linkPage)) linkPage += '.html';
      var isCurrentPage = linkPage === currentPage;
      link.classList.toggle('active', isCurrentPage);
      if (isCurrentPage) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(contactForm);
      var message = "Bonjour VakponTour, je souhaite préparer un voyage au Bénin.\n\nNom : " + (data.get('prenom') || '') + " + " + (data.get('nom') || '') + "\nE-mail : " + (data.get('email') || '') + "\nMessage : " + (data.get('message') || '');
      window.open('https://wa.me/2290159055088?text=' + encodeURIComponent(message), '_blank', 'noopener');
    });
  }

  if (beninMap && typeof L === 'undefined') {
    beninMap.innerHTML = '<a class="benin-map-fallback" href="https://www.openstreetmap.org/#map=10/6.40/2.25" target="_blank" rel="noopener noreferrer">Ouvrir la carte interactive du Bénin</a>';
  }

  var eventFilter = document.getElementById('event-filter');
  if (eventFilter) {
    eventFilter.addEventListener('change', function () {
      var filter = eventFilter.value.toLowerCase();
      document.querySelectorAll('.event-card').forEach(function (card) {
        var place = card.querySelector('.event-place').textContent.toLowerCase();
        card.hidden = filter !== 'all' && place.indexOf(filter) === -1;
      });
    });
  }

  var tripForm = document.getElementById('trip-form');
  if (tripForm) {
    var whatsappCta = document.createElement('a');
    whatsappCta.className = 'btn btn-gold trip-whatsapp-cta';
    whatsappCta.target = '_blank';
    whatsappCta.rel = 'noopener noreferrer';
    whatsappCta.textContent = 'Envoyer ma demande sur WhatsApp';
    tripForm.appendChild(whatsappCta);
    function updateWhatsappCta() {
      var values = new URLSearchParams();
      values.set('text', 'Bonjour VakponTour, je souhaite préparer un voyage au Bénin.');
      whatsappCta.href = 'https://wa.me/2290159055088?' + values.toString();
    }
    tripForm.addEventListener('input', updateWhatsappCta);
    tripForm.addEventListener('change', updateWhatsappCta);
    updateWhatsappCta();
  }

  // Fait défiler doucement les rails, avec pause dès que l'utilisateur interagit.
  document.querySelectorAll('.testimonial-grid, .trust-grid').forEach(function (rail) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var shouldScroll = rail.classList.contains('testimonial-grid') || window.innerWidth <= 700;
    if (!shouldScroll) return;
    var isPaused = false;
    var timer = window.setInterval(function () {
      if (isPaused || rail.scrollWidth <= rail.clientWidth) return;
      var nextPosition = rail.scrollLeft + Math.max(rail.clientWidth * .7, 220);
      rail.scrollTo({ left: nextPosition >= rail.scrollWidth - rail.clientWidth ? 0 : nextPosition, behavior: 'smooth' });
    }, 4200);
    ['mouseenter', 'focusin', 'touchstart', 'pointerdown'].forEach(function (eventName) {
      rail.addEventListener(eventName, function () { isPaused = true; }, { passive: true });
    });
    rail.addEventListener('mouseleave', function () { isPaused = false; });
    rail.addEventListener('focusout', function () { isPaused = false; });
    window.addEventListener('beforeunload', function () { window.clearInterval(timer); });
  });

  // Les images secondaires ne bloquent pas l'affichage initial de la page.
  document.querySelectorAll('img:not(.hero-image):not(.footer-logo)').forEach(function (image) {
    image.loading = 'lazy';
    image.decoding = 'async';
  });

  /* ===== Header qui se compacte au scroll ===== */
  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

  /* ===== Création de voyage : contraintes sur les dates ===== */
  var MIN_STAY_DAYS = 3;
  var tripFormDates = document.getElementById('trip-form');
  if (tripFormDates) {
    var arrivalInput = document.getElementById('arrival');
    var departureInput = document.getElementById('departure');
    // Minimum : aujourd'hui, mais jamais avant 2026. Actualisé à chaque visite.
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var minDate = new Date(2026, 0, 1);
    if (today > minDate) minDate = today;
    var toISO = function (d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };
    arrivalInput.min = toISO(minDate);
    departureInput.min = toISO(minDate);

    function minDepartureFor(arrivalValue) {
      if (!arrivalValue) return null;
      var d = new Date(arrivalValue + 'T12:00:00');
      d.setDate(d.getDate() + MIN_STAY_DAYS);
      return toISO(d);
    }

    arrivalInput.addEventListener('change', function () {
      var minDep = minDepartureFor(arrivalInput.value);
      if (minDep) {
        departureInput.min = minDep;
        // La date de départ choisie devient invalide : on la replace au minimum.
        if (departureInput.value && departureInput.value < minDep) {
          departureInput.value = minDep;
          departureInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });

    // Validation finale à la soumission (sécurité si le navigateur ignore min).
    tripFormDates.addEventListener('submit', function (event) {
      var minDep = minDepartureFor(arrivalInput.value);
      if (arrivalInput.value && departureInput.value && minDep && departureInput.value < minDep) {
        event.preventDefault();
        departureInput.value = minDep;
        departureInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  /* ===== Création de voyage : récapitulatif en direct ===== */
  var tripForm = document.getElementById('trip-form');
  if (tripForm) {
    var summaryArrival = document.getElementById('summary-arrival');
    var summaryTravellers = document.getElementById('summary-travellers');
    var summaryHotel = document.getElementById('summary-hotel');
    var summaryCities = document.getElementById('summary-cities');
    var tripSuccess = document.getElementById('trip-success');
    var summaryList = tripForm.parentElement.querySelector('.summary-list');
    var durationRow = document.createElement('li');
    var budgetRow = document.createElement('li');
    durationRow.innerHTML = '<span>Durée</span><strong id="summary-duration">À définir</strong>';
    budgetRow.innerHTML = '<span>Budget estimatif</span><strong id="summary-budget">À définir</strong>';
    summaryList.insertBefore(durationRow, summaryList.children[1]);
    summaryList.appendChild(budgetRow);
    var summaryDuration = document.getElementById('summary-duration');
    var summaryBudget = document.getElementById('summary-budget');

    function formatDate(value) {
      if (!value) return 'À définir';
      return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + 'T12:00:00'));
    }

    function formatPrice(value) {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value) + ' FCFA';
    }

    function formatEuro(value) {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value / 655.957) + ' €';
    }

    function getTravelDays(arrival, departure) {
      if (!arrival || !departure) return 0;
      var start = new Date(arrival + 'T12:00:00');
      var end = new Date(departure + 'T12:00:00');
      var difference = Math.round((end - start) / 86400000);
      return difference > 0 ? difference : 0;
    }

    function updateTripSummary() {
      var arrival = tripForm.elements.arrival.value;
      var departure = tripForm.elements.departure.value;
      var selectedHotel = tripForm.querySelector('input[name="hotel"]:checked');
      var cities = tripForm.elements.cities.value.trim();
      var days = getTravelDays(arrival, departure);
      var group = tripForm.elements.travellers.value;
      var groupSizes = { '1': 1, '2': 2, '3-4': 3.5, '5-8': 6.5, '9+': 10 };
      var groupFactors = { '1': 1.18, '2': 1, '3-4': .91, '5-8': .84, '9+': .78 };
      var hotelRates = { 'Hôtels 3 étoiles': 65000, 'Hôtels 4 étoiles': 95000, 'Hôtels 5 étoiles': 150000 };
      var cityCount = cities ? cities.split(/[,;\n]/).filter(function (city) { return city.trim(); }).length : 0;
      var itineraryFactor = cityCount > 1 ? Math.min(1.12, 1 + (cityCount - 1) * .035) : 1;
      summaryArrival.textContent = arrival ? formatDate(arrival) + (departure ? ' → ' + formatDate(departure) : '') : 'À définir';
      summaryDuration.textContent = days ? days + (days > 1 ? ' jours' : ' jour') : 'À définir';
      summaryTravellers.textContent = tripForm.elements.travellers.options[tripForm.elements.travellers.selectedIndex].text;
      summaryHotel.textContent = selectedHotel ? selectedHotel.value : 'À définir';
      summaryCities.textContent = cities || 'À définir';
      if (days && selectedHotel) {
        var estimatedTotal = days * groupSizes[group] * hotelRates[selectedHotel.value] * groupFactors[group] * itineraryFactor;
        var minimumBudget = estimatedTotal * .85;
        var maximumBudget = estimatedTotal * 1.15;
        summaryBudget.innerHTML = formatPrice(minimumBudget) + ' – ' + formatPrice(maximumBudget) + '<small class="budget-euro">(' + formatEuro(minimumBudget) + ' – ' + formatEuro(maximumBudget) + ')</small>';
      } else {
        summaryBudget.textContent = 'Ajoutez vos dates';
      }
    }

    tripForm.addEventListener('input', updateTripSummary);
    tripForm.addEventListener('change', updateTripSummary);
    tripForm.addEventListener('submit', function (event) {
      event.preventDefault();
      updateTripSummary();
      tripSuccess.textContent = 'Votre demande est prête avec une estimation indicative. Notre équipe vous recontactera pour confirmer le programme et le devis final.';
      tripSuccess.classList.add('visible');
      tripSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    updateTripSummary();
  }

  /* ===== Destinations : apparitions alternées au défilement ===== */
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealElements = [];
  var destinations = document.querySelectorAll('.dest-item');

  if (!reducedMotion) {
    destinations.forEach(function (item, index) {
      revealElements.push({
        element: item,
        direction: index % 2 === 0 ? 'from-left' : 'from-right'
      });
    });

    revealElements.forEach(function (item) {
      item.element.classList.add('scroll-reveal');
      if (item.direction) item.element.classList.add(item.direction);
    });

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: .16, rootMargin: '0px 0px -45px' });

      revealElements.forEach(function (item) {
        revealObserver.observe(item.element);
      });
    } else {
      revealElements.forEach(function (item) {
        item.element.classList.add('is-revealed');
      });
    }
  }

  /* ===== Menu burger mobile ===== */
  function openMenu() {
    lastFocusedElement = document.activeElement;
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu');
    nav.classList.add('open');
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstLink = nav.querySelector('a.active') || nav.querySelector('a');
   if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement && window.innerWidth <= 900) lastFocusedElement.focus();
  }

  function toggleMenu() {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burger && nav && backdrop) {
    burger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    /* Ferme le menu quand on clique un lien */
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (!nav.classList.contains('open')) return;

      if (event.key === 'Escape') {
        closeMenu();
        return;
      }

      if (event.key === 'Tab') {
        var focusable = nav.querySelectorAll('a[href]');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    /* Ferme le menu si on repasse en desktop */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }
});

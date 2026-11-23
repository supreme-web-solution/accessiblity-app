/*!
 * AccessEase Widget v1.0.0
 * Accessibility toolbar for websites. Vanilla JavaScript, no dependencies.
 * Licensed under the MIT Licence (see LICENSE.txt).
 */
(function (win, doc) {
  'use strict';
  if (win.AccessEase) { return; }

  var VERSION = '1.0.0';
  var HOST_ID = 'ae-host';
  var STYLE_ID = 'ae-doc-style';
  var FILTER_ID = 'ae-doc-filters';
  var STATE_KEY = 'accessease:state';
  var LANG_KEY = 'accessease:lang';
  var HIDE_KEY = 'accessease:hidden-until';
  var SIZE = 56;

  var DEFAULTS = {
    brandName: 'AccessEase',
    primaryColor: '#1663d7',
    textColor: '#ffffff',
    highlightColor: '#ffe600',
    position: 'bottom-right',   // top-left | top-right | middle-left | middle-right | bottom-left | bottom-right
    offset: 20,                 // px from the viewport edge
    uiLanguage: '',             // en | es | fr | de | pt | it. Empty = match the page language, else English.
    language: 'en',             // used for dictionary lookups and speech
    dyslexiaFont: 'Verdana, Tahoma, Arial, sans-serif',
    statementUrl: '',           // link to your accessibility statement (optional)
    hideHours: 24,
    features: {},               // set any feature to false to remove it, e.g. { dictionary: false }
    labels: {}                  // override any text for the chosen language
  };

  // ---------- Translations ----------
  var I18N = {
    en: {
      title: 'Accessibility tools', open: 'Open accessibility tools', close: 'Close', back: 'Back', language: 'Language',
      profiles: 'Smart profiles', profileVisual: 'Visually impaired', profileAdhd: 'ADHD friendly', profileCognitive: 'Cognitive disability',
      groupText: 'Text and reading', groupColour: 'Colour and vision', groupTools: 'Navigation and tools', groupCustom: 'Custom colours',
      textSize: 'Text size', lineHeight: 'Line height', spacing: 'Text spacing', align: 'Text align', dyslexia: 'Dyslexia font',
      contrast: 'High contrast', darkMode: 'Smart dark mode', saturation: 'Saturation', colorFilter: 'Colour-blind filter',
      hideImages: 'Hide images', hideDistractions: 'Hide distractions', pauseAnimations: 'Stop animations', focusIndicator: 'Focus indicator',
      bigCursor: 'Big cursor', magnifier: 'Text magnifier', highlightLinks: 'Highlight links', highlightHeadings: 'Highlight headers',
      highlightHover: 'Highlight on hover', readingGuide: 'Reading guide', readingMask: 'Reading mask', pageStructure: 'Page navigator',
      textToSpeech: 'Text reader', dictionary: 'Dictionary', muteSounds: 'Mute sounds', voiceControl: 'Voice control', keyboard: 'Virtual keyboard',
      bgColor: 'Background', textCol: 'Text', titleCol: 'Titles', colorReset: 'Reset colours',
      statement: 'Accessibility statement', reset: 'Reset all', hide: 'Hide widget (24h)',
      on: 'On', off: 'Off', unsupported: 'Not supported here',
      structureTitle: 'Page navigator', noHeadings: 'No headings found on this page.',
      dictTitle: 'Dictionary', dictLoading: 'Looking up...', dictNone: 'No definition found for', dictHint: 'Double-click any word on the page to look it up.',
      keyboardTitle: 'Virtual keyboard', keyboardHint: 'Click a text field on the page, then type here.', shift: 'Shift', space: 'Space', enter: 'Enter', del: 'Del',
      options: { textSize: ['Default', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Default', 'Medium', 'Large', 'Extra large'], spacing: ['Default', 'Light', 'Medium', 'Heavy'], align: ['Default', 'Left', 'Center', 'Right'], contrast: ['Off', 'Medium', 'High', 'Ultra'], saturation: ['Normal', 'Low', 'High', 'Mono'], colorFilter: ['Off', 'Protanopia', 'Deuteranopia', 'Tritanopia'] }
    },
    es: {
      title: 'Herramientas de accesibilidad', open: 'Abrir herramientas de accesibilidad', close: 'Cerrar', back: 'Volver', language: 'Idioma',
      profiles: 'Perfiles inteligentes', profileVisual: 'Discapacidad visual', profileAdhd: 'TDAH', profileCognitive: 'Discapacidad cognitiva',
      groupText: 'Texto y lectura', groupColour: 'Color y visión', groupTools: 'Navegación y herramientas', groupCustom: 'Colores personalizados',
      textSize: 'Tamaño del texto', lineHeight: 'Interlineado', spacing: 'Espaciado del texto', align: 'Alinear texto', dyslexia: 'Fuente para dislexia',
      contrast: 'Alto contraste', darkMode: 'Modo oscuro inteligente', saturation: 'Saturación', colorFilter: 'Filtro daltonismo',
      hideImages: 'Ocultar imágenes', hideDistractions: 'Ocultar distracciones', pauseAnimations: 'Detener animaciones', focusIndicator: 'Indicador de foco',
      bigCursor: 'Cursor grande', magnifier: 'Lupa de texto', highlightLinks: 'Resaltar enlaces', highlightHeadings: 'Resaltar títulos',
      highlightHover: 'Resaltar al pasar', readingGuide: 'Guía de lectura', readingMask: 'Máscara de lectura', pageStructure: 'Navegador de página',
      textToSpeech: 'Lector de texto', dictionary: 'Diccionario', muteSounds: 'Silenciar sonidos', voiceControl: 'Control por voz', keyboard: 'Teclado virtual',
      bgColor: 'Fondo', textCol: 'Texto', titleCol: 'Títulos', colorReset: 'Restablecer colores',
      statement: 'Declaración de accesibilidad', reset: 'Restablecer todo', hide: 'Ocultar widget (24 h)',
      on: 'Sí', off: 'No', unsupported: 'No compatible aquí',
      structureTitle: 'Navegador de página', noHeadings: 'No se encontraron títulos en esta página.',
      dictTitle: 'Diccionario', dictLoading: 'Buscando...', dictNone: 'No se encontró definición para', dictHint: 'Haz doble clic en cualquier palabra de la página.',
      keyboardTitle: 'Teclado virtual', keyboardHint: 'Haz clic en un campo de texto de la página y escribe aquí.', shift: 'Mayús', space: 'Espacio', enter: 'Intro', del: 'Borrar',
      options: { textSize: ['Normal', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Normal', 'Medio', 'Grande', 'Muy grande'], spacing: ['Normal', 'Ligero', 'Medio', 'Alto'], align: ['Normal', 'Izquierda', 'Centro', 'Derecha'], contrast: ['No', 'Medio', 'Alto', 'Máximo'], saturation: ['Normal', 'Baja', 'Alta', 'Monocromo'], colorFilter: ['No', 'Protanopia', 'Deuteranopia', 'Tritanopia'] }
    },
    fr: {
      title: "Outils d'accessibilité", open: "Ouvrir les outils d'accessibilité", close: 'Fermer', back: 'Retour', language: 'Langue',
      profiles: 'Profils intelligents', profileVisual: 'Déficience visuelle', profileAdhd: 'TDAH', profileCognitive: 'Déficience cognitive',
      groupText: 'Texte et lecture', groupColour: 'Couleur et vision', groupTools: 'Navigation et outils', groupCustom: 'Couleurs personnalisées',
      textSize: 'Taille du texte', lineHeight: 'Interligne', spacing: 'Espacement du texte', align: 'Alignement', dyslexia: 'Police dyslexie',
      contrast: 'Contraste élevé', darkMode: 'Mode sombre intelligent', saturation: 'Saturation', colorFilter: 'Filtre daltonisme',
      hideImages: 'Masquer les images', hideDistractions: 'Masquer les distractions', pauseAnimations: "Arrêter l'animation", focusIndicator: 'Indicateur de focus',
      bigCursor: 'Grand curseur', magnifier: 'Loupe de texte', highlightLinks: 'Surligner les liens', highlightHeadings: 'Surligner les titres',
      highlightHover: 'Surligner au survol', readingGuide: 'Guide de lecture', readingMask: 'Masque de lecture', pageStructure: 'Navigateur de page',
      textToSpeech: 'Lecteur de texte', dictionary: 'Dictionnaire', muteSounds: 'Couper le son', voiceControl: 'Commande vocale', keyboard: 'Clavier virtuel',
      bgColor: 'Fond', textCol: 'Texte', titleCol: 'Titres', colorReset: 'Réinitialiser les couleurs',
      statement: "Déclaration d'accessibilité", reset: 'Tout réinitialiser', hide: 'Masquer le widget (24 h)',
      on: 'Oui', off: 'Non', unsupported: 'Non pris en charge ici',
      structureTitle: 'Navigateur de page', noHeadings: 'Aucun titre trouvé sur cette page.',
      dictTitle: 'Dictionnaire', dictLoading: 'Recherche...', dictNone: 'Aucune définition pour', dictHint: 'Double-cliquez sur un mot de la page pour le chercher.',
      keyboardTitle: 'Clavier virtuel', keyboardHint: 'Cliquez dans un champ de la page, puis tapez ici.', shift: 'Maj', space: 'Espace', enter: 'Entrée', del: 'Suppr',
      options: { textSize: ['Par défaut', '+15 %', '+30 %', '+50 %', '+75 %'], lineHeight: ['Par défaut', 'Moyen', 'Grand', 'Très grand'], spacing: ['Par défaut', 'Léger', 'Moyen', 'Fort'], align: ['Par défaut', 'Gauche', 'Centré', 'Droite'], contrast: ['Non', 'Moyen', 'Élevé', 'Maximal'], saturation: ['Normale', 'Faible', 'Élevée', 'Monochrome'], colorFilter: ['Non', 'Protanopie', 'Deutéranopie', 'Tritanopie'] }
    },
    de: {
      title: 'Barrierefreiheit-Werkzeuge', open: 'Barrierefreiheit-Werkzeuge öffnen', close: 'Schließen', back: 'Zurück', language: 'Sprache',
      profiles: 'Intelligente Profile', profileVisual: 'Sehbehinderung', profileAdhd: 'ADHS-freundlich', profileCognitive: 'Kognitive Einschränkung',
      groupText: 'Text und Lesen', groupColour: 'Farbe und Sehen', groupTools: 'Navigation und Werkzeuge', groupCustom: 'Eigene Farben',
      textSize: 'Textgröße', lineHeight: 'Zeilenhöhe', spacing: 'Textabstand', align: 'Textausrichtung', dyslexia: 'Legasthenie-Schrift',
      contrast: 'Hoher Kontrast', darkMode: 'Intelligenter Dunkelmodus', saturation: 'Sättigung', colorFilter: 'Farbblindheit-Filter',
      hideImages: 'Bilder ausblenden', hideDistractions: 'Ablenkungen ausblenden', pauseAnimations: 'Animationen stoppen', focusIndicator: 'Fokusanzeige',
      bigCursor: 'Großer Mauszeiger', magnifier: 'Text-Lupe', highlightLinks: 'Links hervorheben', highlightHeadings: 'Überschriften hervorheben',
      highlightHover: 'Beim Überfahren hervorheben', readingGuide: 'Lesehilfe', readingMask: 'Lesemaske', pageStructure: 'Seitennavigation',
      textToSpeech: 'Textvorleser', dictionary: 'Wörterbuch', muteSounds: 'Töne stummschalten', voiceControl: 'Sprachsteuerung', keyboard: 'Bildschirmtastatur',
      bgColor: 'Hintergrund', textCol: 'Text', titleCol: 'Überschriften', colorReset: 'Farben zurücksetzen',
      statement: 'Erklärung zur Barrierefreiheit', reset: 'Alles zurücksetzen', hide: 'Widget ausblenden (24 Std.)',
      on: 'An', off: 'Aus', unsupported: 'Hier nicht unterstützt',
      structureTitle: 'Seitennavigation', noHeadings: 'Keine Überschriften auf dieser Seite gefunden.',
      dictTitle: 'Wörterbuch', dictLoading: 'Suche läuft...', dictNone: 'Keine Definition gefunden für', dictHint: 'Doppelklicken Sie auf ein Wort auf der Seite.',
      keyboardTitle: 'Bildschirmtastatur', keyboardHint: 'Klicken Sie auf ein Textfeld der Seite und tippen Sie hier.', shift: 'Umschalt', space: 'Leertaste', enter: 'Eingabe', del: 'Entf',
      options: { textSize: ['Standard', '+15 %', '+30 %', '+50 %', '+75 %'], lineHeight: ['Standard', 'Mittel', 'Groß', 'Sehr groß'], spacing: ['Standard', 'Leicht', 'Mittel', 'Stark'], align: ['Standard', 'Links', 'Zentriert', 'Rechts'], contrast: ['Aus', 'Mittel', 'Hoch', 'Maximal'], saturation: ['Normal', 'Niedrig', 'Hoch', 'Monochrom'], colorFilter: ['Aus', 'Protanopie', 'Deuteranopie', 'Tritanopie'] }
    },
    pt: {
      title: 'Ferramentas de acessibilidade', open: 'Abrir ferramentas de acessibilidade', close: 'Fechar', back: 'Voltar', language: 'Idioma',
      profiles: 'Perfis inteligentes', profileVisual: 'Deficiência visual', profileAdhd: 'TDAH', profileCognitive: 'Deficiência cognitiva',
      groupText: 'Texto e leitura', groupColour: 'Cor e visão', groupTools: 'Navegação e ferramentas', groupCustom: 'Cores personalizadas',
      textSize: 'Tamanho do texto', lineHeight: 'Altura da linha', spacing: 'Espaçamento do texto', align: 'Alinhamento', dyslexia: 'Fonte para dislexia',
      contrast: 'Alto contraste', darkMode: 'Modo escuro inteligente', saturation: 'Saturação', colorFilter: 'Filtro daltonismo',
      hideImages: 'Ocultar imagens', hideDistractions: 'Ocultar distrações', pauseAnimations: 'Parar animações', focusIndicator: 'Indicador de foco',
      bigCursor: 'Cursor grande', magnifier: 'Lupa de texto', highlightLinks: 'Destacar links', highlightHeadings: 'Destacar títulos',
      highlightHover: 'Destacar ao passar o mouse', readingGuide: 'Guia de leitura', readingMask: 'Máscara de leitura', pageStructure: 'Navegador da página',
      textToSpeech: 'Leitor de texto', dictionary: 'Dicionário', muteSounds: 'Silenciar sons', voiceControl: 'Controle por voz', keyboard: 'Teclado virtual',
      bgColor: 'Fundo', textCol: 'Texto', titleCol: 'Títulos', colorReset: 'Redefinir cores',
      statement: 'Declaração de acessibilidade', reset: 'Redefinir tudo', hide: 'Ocultar widget (24 h)',
      on: 'Sim', off: 'Não', unsupported: 'Não compatível aqui',
      structureTitle: 'Navegador da página', noHeadings: 'Nenhum título encontrado nesta página.',
      dictTitle: 'Dicionário', dictLoading: 'Buscando...', dictNone: 'Nenhuma definição encontrada para', dictHint: 'Clique duas vezes em qualquer palavra da página.',
      keyboardTitle: 'Teclado virtual', keyboardHint: 'Clique em um campo de texto da página e digite aqui.', shift: 'Shift', space: 'Espaço', enter: 'Enter', del: 'Apagar',
      options: { textSize: ['Padrão', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Padrão', 'Médio', 'Grande', 'Muito grande'], spacing: ['Padrão', 'Leve', 'Médio', 'Alto'], align: ['Padrão', 'Esquerda', 'Centro', 'Direita'], contrast: ['Não', 'Médio', 'Alto', 'Máximo'], saturation: ['Normal', 'Baixa', 'Alta', 'Monocromático'], colorFilter: ['Não', 'Protanopia', 'Deuteranopia', 'Tritanopia'] }
    },
    it: {
      title: 'Strumenti di accessibilità', open: 'Apri strumenti di accessibilità', close: 'Chiudi', back: 'Indietro', language: 'Lingua',
      profiles: 'Profili intelligenti', profileVisual: 'Disabilità visiva', profileAdhd: 'ADHD', profileCognitive: 'Disabilità cognitiva',
      groupText: 'Testo e lettura', groupColour: 'Colore e vista', groupTools: 'Navigazione e strumenti', groupCustom: 'Colori personalizzati',
      textSize: 'Dimensione testo', lineHeight: 'Interlinea', spacing: 'Spaziatura testo', align: 'Allineamento', dyslexia: 'Carattere per dislessia',
      contrast: 'Alto contrasto', darkMode: 'Modalità scura intelligente', saturation: 'Saturazione', colorFilter: 'Filtro daltonismo',
      hideImages: 'Nascondi immagini', hideDistractions: 'Nascondi distrazioni', pauseAnimations: 'Ferma animazioni', focusIndicator: 'Indicatore di focus',
      bigCursor: 'Cursore grande', magnifier: 'Lente di testo', highlightLinks: 'Evidenzia link', highlightHeadings: 'Evidenzia titoli',
      highlightHover: 'Evidenzia al passaggio', readingGuide: 'Guida di lettura', readingMask: 'Maschera di lettura', pageStructure: 'Navigatore pagina',
      textToSpeech: 'Lettore di testo', dictionary: 'Dizionario', muteSounds: 'Disattiva audio', voiceControl: 'Controllo vocale', keyboard: 'Tastiera virtuale',
      bgColor: 'Sfondo', textCol: 'Testo', titleCol: 'Titoli', colorReset: 'Ripristina colori',
      statement: 'Dichiarazione di accessibilità', reset: 'Ripristina tutto', hide: 'Nascondi widget (24 h)',
      on: 'Sì', off: 'No', unsupported: 'Non supportato qui',
      structureTitle: 'Navigatore pagina', noHeadings: 'Nessun titolo trovato in questa pagina.',
      dictTitle: 'Dizionario', dictLoading: 'Ricerca in corso...', dictNone: 'Nessuna definizione trovata per', dictHint: 'Fai doppio clic su una parola della pagina.',
      keyboardTitle: 'Tastiera virtuale', keyboardHint: 'Fai clic su un campo di testo della pagina, poi scrivi qui.', shift: 'Maiusc', space: 'Spazio', enter: 'Invio', del: 'Canc',
      options: { textSize: ['Predefinito', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Predefinito', 'Medio', 'Grande', 'Molto grande'], spacing: ['Predefinito', 'Leggero', 'Medio', 'Alto'], align: ['Predefinito', 'Sinistra', 'Centro', 'Destra'], contrast: ['No', 'Medio', 'Alto', 'Massimo'], saturation: ['Normale', 'Bassa', 'Alta', 'Monocromatico'], colorFilter: ['No', 'Protanopia', 'Deuteranopia', 'Tritanopia'] }
    }
  };
  I18N.nl = {
    title: 'Toegankelijkheidstools', open: 'Toegankelijkheidstools openen', close: 'Sluiten', back: 'Terug', language: 'Taal',
    profiles: 'Slimme profielen', profileVisual: 'Slechtziend', profileAdhd: 'ADHD-vriendelijk', profileCognitive: 'Cognitieve beperking',
    groupText: 'Tekst en lezen', groupColour: 'Kleur en zicht', groupTools: 'Navigatie en hulpmiddelen', groupCustom: 'Eigen kleuren',
    textSize: 'Tekstgrootte', lineHeight: 'Regelafstand', spacing: 'Tekstafstand', align: 'Tekstuitlijning', dyslexia: 'Dyslexie-lettertype',
    contrast: 'Hoog contrast', darkMode: 'Slimme donkere modus', saturation: 'Verzadiging', colorFilter: 'Kleurenblindheidsfilter',
    hideImages: 'Afbeeldingen verbergen', hideDistractions: 'Afleidingen verbergen', pauseAnimations: 'Animaties stoppen', focusIndicator: 'Focusindicator',
    bigCursor: 'Grote cursor', magnifier: 'Tekstvergrootglas', highlightLinks: 'Links markeren', highlightHeadings: 'Koppen markeren',
    highlightHover: 'Markeren bij aanwijzen', readingGuide: 'Leesgids', readingMask: 'Leesmasker', pageStructure: 'Paginanavigator',
    keyboard: 'Virtueel toetsenbord', textToSpeech: 'Tekstvoorlezer', dictionary: 'Woordenboek', muteSounds: 'Geluid dempen', voiceControl: 'Spraakbediening',
    bgColor: 'Achtergrond', textCol: 'Tekst', titleCol: 'Koppen', colorReset: 'Kleuren resetten',
    statement: 'Toegankelijkheidsverklaring', reset: 'Alles resetten', hide: 'Widget verbergen (24 u)',
    on: 'Aan', off: 'Uit', unsupported: 'Hier niet ondersteund',
    structureTitle: 'Paginanavigator', noHeadings: 'Geen koppen gevonden op deze pagina.',
    dictTitle: 'Woordenboek', dictLoading: 'Zoeken...', dictNone: 'Geen definitie gevonden voor', dictHint: 'Dubbelklik op een woord op de pagina.',
    keyboardTitle: 'Virtueel toetsenbord', keyboardHint: 'Klik op een tekstveld op de pagina en typ hier.', shift: 'Shift', space: 'Spatie', enter: 'Enter', del: 'Wis',
    options: { textSize: ['Standaard', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Standaard', 'Gemiddeld', 'Groot', 'Extra groot'], spacing: ['Standaard', 'Licht', 'Gemiddeld', 'Zwaar'], align: ['Standaard', 'Links', 'Midden', 'Rechts'], contrast: ['Uit', 'Gemiddeld', 'Hoog', 'Maximaal'], saturation: ['Normaal', 'Laag', 'Hoog', 'Mono'], colorFilter: ['Uit', 'Protanopie', 'Deuteranopie', 'Tritanopie'] }
  };
  I18N.pl = {
    title: 'Narzędzia dostępności', open: 'Otwórz narzędzia dostępności', close: 'Zamknij', back: 'Wstecz', language: 'Język',
    profiles: 'Inteligentne profile', profileVisual: 'Niedowidzący', profileAdhd: 'Przyjazny dla ADHD', profileCognitive: 'Niepełnosprawność poznawcza',
    groupText: 'Tekst i czytanie', groupColour: 'Kolor i wzrok', groupTools: 'Nawigacja i narzędzia', groupCustom: 'Własne kolory',
    textSize: 'Rozmiar tekstu', lineHeight: 'Interlinia', spacing: 'Odstępy w tekście', align: 'Wyrównanie tekstu', dyslexia: 'Czcionka dla dyslektyków',
    contrast: 'Wysoki kontrast', darkMode: 'Inteligentny tryb ciemny', saturation: 'Nasycenie', colorFilter: 'Filtr daltonizmu',
    hideImages: 'Ukryj obrazy', hideDistractions: 'Ukryj rozpraszacze', pauseAnimations: 'Zatrzymaj animacje', focusIndicator: 'Wskaźnik fokusu',
    bigCursor: 'Duży kursor', magnifier: 'Lupa tekstu', highlightLinks: 'Podświetl linki', highlightHeadings: 'Podświetl nagłówki',
    highlightHover: 'Podświetl po najechaniu', readingGuide: 'Prowadnica czytania', readingMask: 'Maska czytania', pageStructure: 'Nawigator strony',
    keyboard: 'Klawiatura ekranowa', textToSpeech: 'Czytnik tekstu', dictionary: 'Słownik', muteSounds: 'Wycisz dźwięki', voiceControl: 'Sterowanie głosem',
    bgColor: 'Tło', textCol: 'Tekst', titleCol: 'Nagłówki', colorReset: 'Resetuj kolory',
    statement: 'Deklaracja dostępności', reset: 'Resetuj wszystko', hide: 'Ukryj widżet (24 h)',
    on: 'Wł.', off: 'Wył.', unsupported: 'Niedostępne tutaj',
    structureTitle: 'Nawigator strony', noHeadings: 'Nie znaleziono nagłówków na tej stronie.',
    dictTitle: 'Słownik', dictLoading: 'Szukam...', dictNone: 'Nie znaleziono definicji dla', dictHint: 'Kliknij dwukrotnie słowo na stronie.',
    keyboardTitle: 'Klawiatura ekranowa', keyboardHint: 'Kliknij pole tekstowe na stronie i pisz tutaj.', shift: 'Shift', space: 'Spacja', enter: 'Enter', del: 'Usuń',
    options: { textSize: ['Domyślny', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Domyślna', 'Średnia', 'Duża', 'Bardzo duża'], spacing: ['Domyślne', 'Lekkie', 'Średnie', 'Duże'], align: ['Domyślne', 'Lewo', 'Środek', 'Prawo'], contrast: ['Wył.', 'Średni', 'Wysoki', 'Maksymalny'], saturation: ['Normalne', 'Niskie', 'Wysokie', 'Mono'], colorFilter: ['Wył.', 'Protanopia', 'Deuteranopia', 'Tritanopia'] }
  };
  I18N.sv = {
    title: 'Tillgänglighetsverktyg', open: 'Öppna tillgänglighetsverktyg', close: 'Stäng', back: 'Tillbaka', language: 'Språk',
    profiles: 'Smarta profiler', profileVisual: 'Synnedsättning', profileAdhd: 'ADHD-anpassad', profileCognitive: 'Kognitiv funktionsnedsättning',
    groupText: 'Text och läsning', groupColour: 'Färg och syn', groupTools: 'Navigering och verktyg', groupCustom: 'Egna färger',
    textSize: 'Textstorlek', lineHeight: 'Radavstånd', spacing: 'Textavstånd', align: 'Textjustering', dyslexia: 'Dyslexivänligt typsnitt',
    contrast: 'Hög kontrast', darkMode: 'Smart mörkt läge', saturation: 'Mättnad', colorFilter: 'Färgblindhetsfilter',
    hideImages: 'Dölj bilder', hideDistractions: 'Dölj störningar', pauseAnimations: 'Stoppa animationer', focusIndicator: 'Fokusindikator',
    bigCursor: 'Stor muspekare', magnifier: 'Textförstorare', highlightLinks: 'Markera länkar', highlightHeadings: 'Markera rubriker',
    highlightHover: 'Markera vid hovring', readingGuide: 'Läsguide', readingMask: 'Läsmask', pageStructure: 'Sidnavigering',
    keyboard: 'Virtuellt tangentbord', textToSpeech: 'Textuppläsning', dictionary: 'Ordbok', muteSounds: 'Tysta ljud', voiceControl: 'Röststyrning',
    bgColor: 'Bakgrund', textCol: 'Text', titleCol: 'Rubriker', colorReset: 'Återställ färger',
    statement: 'Tillgänglighetsredogörelse', reset: 'Återställ allt', hide: 'Dölj widget (24 h)',
    on: 'På', off: 'Av', unsupported: 'Stöds inte här',
    structureTitle: 'Sidnavigering', noHeadings: 'Inga rubriker hittades på den här sidan.',
    dictTitle: 'Ordbok', dictLoading: 'Söker...', dictNone: 'Ingen definition hittades för', dictHint: 'Dubbelklicka på ett ord på sidan.',
    keyboardTitle: 'Virtuellt tangentbord', keyboardHint: 'Klicka i ett textfält på sidan och skriv här.', shift: 'Skift', space: 'Mellanslag', enter: 'Enter', del: 'Radera',
    options: { textSize: ['Standard', '+15 %', '+30 %', '+50 %', '+75 %'], lineHeight: ['Standard', 'Mellan', 'Stor', 'Extra stor'], spacing: ['Standard', 'Lätt', 'Mellan', 'Stark'], align: ['Standard', 'Vänster', 'Centrerad', 'Höger'], contrast: ['Av', 'Medel', 'Hög', 'Maximal'], saturation: ['Normal', 'Låg', 'Hög', 'Mono'], colorFilter: ['Av', 'Protanopi', 'Deuteranopi', 'Tritanopi'] }
  };
  I18N.da = {
    title: 'Tilgængelighedsværktøjer', open: 'Åbn tilgængelighedsværktøjer', close: 'Luk', back: 'Tilbage', language: 'Sprog',
    profiles: 'Smarte profiler', profileVisual: 'Synshandicap', profileAdhd: 'ADHD-venlig', profileCognitive: 'Kognitivt handicap',
    groupText: 'Tekst og læsning', groupColour: 'Farve og syn', groupTools: 'Navigation og værktøjer', groupCustom: 'Egne farver',
    textSize: 'Tekststørrelse', lineHeight: 'Linjeafstand', spacing: 'Tekstafstand', align: 'Tekstjustering', dyslexia: 'Dysleksivenlig skrifttype',
    contrast: 'Høj kontrast', darkMode: 'Smart mørk tilstand', saturation: 'Mætning', colorFilter: 'Farveblindhedsfilter',
    hideImages: 'Skjul billeder', hideDistractions: 'Skjul forstyrrelser', pauseAnimations: 'Stop animationer', focusIndicator: 'Fokusindikator',
    bigCursor: 'Stor markør', magnifier: 'Tekstforstørrelse', highlightLinks: 'Fremhæv links', highlightHeadings: 'Fremhæv overskrifter',
    highlightHover: 'Fremhæv ved hover', readingGuide: 'Læsevejledning', readingMask: 'Læsemaske', pageStructure: 'Sidenavigator',
    keyboard: 'Virtuelt tastatur', textToSpeech: 'Tekstlæser', dictionary: 'Ordbog', muteSounds: 'Slå lyd fra', voiceControl: 'Stemmestyring',
    bgColor: 'Baggrund', textCol: 'Tekst', titleCol: 'Overskrifter', colorReset: 'Nulstil farver',
    statement: 'Tilgængelighedserklæring', reset: 'Nulstil alt', hide: 'Skjul widget (24 t)',
    on: 'Til', off: 'Fra', unsupported: 'Understøttes ikke her',
    structureTitle: 'Sidenavigator', noHeadings: 'Ingen overskrifter fundet på denne side.',
    dictTitle: 'Ordbog', dictLoading: 'Slår op...', dictNone: 'Ingen definition fundet for', dictHint: 'Dobbeltklik på et ord på siden.',
    keyboardTitle: 'Virtuelt tastatur', keyboardHint: 'Klik i et tekstfelt på siden, og skriv her.', shift: 'Shift', space: 'Mellemrum', enter: 'Enter', del: 'Slet',
    options: { textSize: ['Standard', '+15 %', '+30 %', '+50 %', '+75 %'], lineHeight: ['Standard', 'Mellem', 'Stor', 'Ekstra stor'], spacing: ['Standard', 'Let', 'Mellem', 'Kraftig'], align: ['Standard', 'Venstre', 'Centreret', 'Højre'], contrast: ['Fra', 'Medium', 'Høj', 'Maksimal'], saturation: ['Normal', 'Lav', 'Høj', 'Mono'], colorFilter: ['Fra', 'Protanopi', 'Deuteranopi', 'Tritanopi'] }
  };
  I18N.fi = {
    title: 'Saavutettavuustyökalut', open: 'Avaa saavutettavuustyökalut', close: 'Sulje', back: 'Takaisin', language: 'Kieli',
    profiles: 'Älykkäät profiilit', profileVisual: 'Näkövamma', profileAdhd: 'ADHD-ystävällinen', profileCognitive: 'Kognitiivinen vamma',
    groupText: 'Teksti ja lukeminen', groupColour: 'Väri ja näkö', groupTools: 'Navigointi ja työkalut', groupCustom: 'Omat värit',
    textSize: 'Tekstin koko', lineHeight: 'Riviväli', spacing: 'Tekstin väli', align: 'Tekstin tasaus', dyslexia: 'Dysleksiaystävällinen fontti',
    contrast: 'Korkea kontrasti', darkMode: 'Älykäs tumma tila', saturation: 'Kyllästys', colorFilter: 'Värisokeussuodatin',
    hideImages: 'Piilota kuvat', hideDistractions: 'Piilota häiritsevät elementit', pauseAnimations: 'Pysäytä animaatiot', focusIndicator: 'Fokusindikaattori',
    bigCursor: 'Iso kursori', magnifier: 'Tekstin suurennus', highlightLinks: 'Korosta linkit', highlightHeadings: 'Korosta otsikot',
    highlightHover: 'Korosta osoitettaessa', readingGuide: 'Lukuopas', readingMask: 'Lukunaamio', pageStructure: 'Sivunavigaattori',
    keyboard: 'Näytönäppäimistö', textToSpeech: 'Tekstin lukija', dictionary: 'Sanakirja', muteSounds: 'Mykistä äänet', voiceControl: 'Ääniohjaus',
    bgColor: 'Tausta', textCol: 'Teksti', titleCol: 'Otsikot', colorReset: 'Palauta värit',
    statement: 'Saavutettavuusselosteet', reset: 'Palauta kaikki', hide: 'Piilota widget (24 h)',
    on: 'Päällä', off: 'Pois', unsupported: 'Ei tuettu täällä',
    structureTitle: 'Sivunavigaattori', noHeadings: 'Tältä sivulta ei löytynyt otsikoita.',
    dictTitle: 'Sanakirja', dictLoading: 'Haetaan...', dictNone: 'Määritelmää ei löytynyt haulle', dictHint: 'Kaksoisnapsauta sivun sanaa.',
    keyboardTitle: 'Näytönäppäimistö', keyboardHint: 'Napsauta sivun tekstikenttää ja kirjoita tähän.', shift: 'Shift', space: 'Väli', enter: 'Enter', del: 'Poista',
    options: { textSize: ['Oletus', '+15 %', '+30 %', '+50 %', '+75 %'], lineHeight: ['Oletus', 'Keskikokoinen', 'Suuri', 'Erittäin suuri'], spacing: ['Oletus', 'Kevyt', 'Keskitasoinen', 'Voimakas'], align: ['Oletus', 'Vasen', 'Keskitetty', 'Oikea'], contrast: ['Pois', 'Keskitaso', 'Korkea', 'Enimmäis'], saturation: ['Normaali', 'Matala', 'Korkea', 'Mono'], colorFilter: ['Pois', 'Protanopia', 'Deuteranopia', 'Tritanopia'] }
  };
  I18N.el = {
    title: 'Εργαλεία προσβασιμότητας', open: 'Άνοιγμα εργαλείων προσβασιμότητας', close: 'Κλείσιμο', back: 'Πίσω', language: 'Γλώσσα',
    profiles: 'Έξυπνα προφίλ', profileVisual: 'Οπτική αναπηρία', profileAdhd: 'Φιλικό για ΔΕΠΥ', profileCognitive: 'Γνωστική αναπηρία',
    groupText: 'Κείμενο και ανάγνωση', groupColour: 'Χρώμα και όραση', groupTools: 'Πλοήγηση και εργαλεία', groupCustom: 'Προσαρμοσμένα χρώματα',
    textSize: 'Μέγεθος κειμένου', lineHeight: 'Διάστιχο', spacing: 'Απόσταση κειμένου', align: 'Στοίχιση κειμένου', dyslexia: 'Γραμματοσειρά για δυσλεξία',
    contrast: 'Υψηλή αντίθεση', darkMode: 'Έξυπνη σκοτεινή λειτουργία', saturation: 'Κορεσμός', colorFilter: 'Φίλτρο χρωματοτύφλου',
    hideImages: 'Απόκρυψη εικόνων', hideDistractions: 'Απόκρυψη περισπασμών', pauseAnimations: 'Διακοπή κινούμενων', focusIndicator: 'Δείκτης εστίασης',
    bigCursor: 'Μεγάλος δρομέας', magnifier: 'Μεγεθυντικός φακός κειμένου', highlightLinks: 'Επισήμανση συνδέσμων', highlightHeadings: 'Επισήμανση επικεφαλίδων',
    highlightHover: 'Επισήμανση με αιώρηση', readingGuide: 'Οδηγός ανάγνωσης', readingMask: 'Μάσκα ανάγνωσης', pageStructure: 'Πλοηγός σελίδας',
    keyboard: 'Εικονικό πληκτρολόγιο', textToSpeech: 'Ανάγνωση κειμένου', dictionary: 'Λεξικό', muteSounds: 'Σίγαση ήχων', voiceControl: 'Φωνητικός έλεγχος',
    bgColor: 'Φόντο', textCol: 'Κείμενο', titleCol: 'Τίτλοι', colorReset: 'Επαναφορά χρωμάτων',
    statement: 'Δήλωση προσβασιμότητας', reset: 'Επαναφορά όλων', hide: 'Απόκρυψη widget (24 ώρες)',
    on: 'Ενεργό', off: 'Ανενεργό', unsupported: 'Δεν υποστηρίζεται εδώ',
    structureTitle: 'Πλοηγός σελίδας', noHeadings: 'Δεν βρέθηκαν επικεφαλίδες σε αυτή τη σελίδα.',
    dictTitle: 'Λεξικό', dictLoading: 'Αναζήτηση...', dictNone: 'Δεν βρέθηκε ορισμός για', dictHint: 'Κάντε διπλό κλικ σε οποιαδήποτε λέξη της σελίδας.',
    keyboardTitle: 'Εικονικό πληκτρολόγιο', keyboardHint: 'Κάντε κλικ σε πεδίο κειμένου της σελίδας και γράψτε εδώ.', shift: 'Shift', space: 'Διάστημα', enter: 'Enter', del: 'Διαγραφή',
    options: { textSize: ['Προεπιλογή', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['Προεπιλογή', 'Μέτριο', 'Μεγάλο', 'Πολύ μεγάλο'], spacing: ['Προεπιλογή', 'Ελαφρύ', 'Μέτριο', 'Έντονο'], align: ['Προεπιλογή', 'Αριστερά', 'Κέντρο', 'Δεξιά'], contrast: ['Ανενεργό', 'Μέτρια', 'Υψηλή', 'Μέγιστη'], saturation: ['Κανονικός', 'Χαμηλός', 'Υψηλός', 'Μονόχρωμος'], colorFilter: ['Ανενεργό', 'Πρωτανοπία', 'Δευτερανοπία', 'Τριτανοπία'] }
  };
  I18N.bn = {
    title: 'অ্যাক্সেসিবিলিটি টুলস', open: 'অ্যাক্সেসিবিলিটি টুলস খুলুন', close: 'বন্ধ করুন', back: 'পিছনে', language: 'ভাষা',
    profiles: 'স্মার্ট প্রোফাইল', profileVisual: 'দৃষ্টিপ্রতিবন্ধী', profileAdhd: 'ADHD-বান্ধব', profileCognitive: 'জ্ঞানীয় প্রতিবন্ধকতা',
    groupText: 'লেখা ও পড়া', groupColour: 'রঙ ও দৃষ্টি', groupTools: 'নেভিগেশন ও টুলস', groupCustom: 'নিজস্ব রঙ',
    textSize: 'লেখার আকার', lineHeight: 'লাইনের উচ্চতা', spacing: 'লেখার ব্যবধান', align: 'লেখার সারিবদ্ধতা', dyslexia: 'ডিসলেক্সিয়া-বান্ধব ফন্ট',
    contrast: 'উচ্চ কনট্রাস্ট', darkMode: 'স্মার্ট ডার্ক মোড', saturation: 'স্যাচুরেশন', colorFilter: 'বর্ণান্ধতা ফিল্টার',
    hideImages: 'ছবি লুকান', hideDistractions: 'বিভ্রান্তি লুকান', pauseAnimations: 'অ্যানিমেশন থামান', focusIndicator: 'ফোকাস নির্দেশক',
    bigCursor: 'বড় কার্সর', magnifier: 'টেক্সট ম্যাগনিফায়ার', highlightLinks: 'লিংক হাইলাইট', highlightHeadings: 'শিরোনাম হাইলাইট',
    highlightHover: 'হোভারে হাইলাইট', readingGuide: 'পড়ার নির্দেশিকা', readingMask: 'পড়ার মাস্ক', pageStructure: 'পেজ নেভিগেটর',
    keyboard: 'ভার্চুয়াল কীবোর্ড', textToSpeech: 'টেক্সট রিডার', dictionary: 'অভিধান', muteSounds: 'শব্দ বন্ধ করুন', voiceControl: 'ভয়েস কন্ট্রোল',
    bgColor: 'ব্যাকগ্রাউন্ড', textCol: 'লেখা', titleCol: 'শিরোনাম', colorReset: 'রঙ রিসেট',
    statement: 'অ্যাক্সেসিবিলিটি বিবৃতি', reset: 'সব রিসেট', hide: 'উইজেট লুকান (২৪ ঘণ্টা)',
    on: 'চালু', off: 'বন্ধ', unsupported: 'এখানে সমর্থিত নয়',
    structureTitle: 'পেজ নেভিগেটর', noHeadings: 'এই পৃষ্ঠায় কোনো শিরোনাম পাওয়া যায়নি।',
    dictTitle: 'অভিধান', dictLoading: 'খোঁজা হচ্ছে...', dictNone: 'এর জন্য সংজ্ঞা পাওয়া যায়নি', dictHint: 'পৃষ্ঠার যেকোনো শব্দে ডাবল-ক্লিক করুন।',
    keyboardTitle: 'ভার্চুয়াল কীবোর্ড', keyboardHint: 'পৃষ্ঠার একটি টেক্সট ফিল্ডে ক্লিক করে এখানে টাইপ করুন।', shift: 'Shift', space: 'স্পেস', enter: 'Enter', del: 'মুছুন',
    options: { textSize: ['ডিফল্ট', '+15%', '+30%', '+50%', '+75%'], lineHeight: ['ডিফল্ট', 'মাঝারি', 'বড়', 'অনেক বড়'], spacing: ['ডিফল্ট', 'হালকা', 'মাঝারি', 'বেশি'], align: ['ডিফল্ট', 'বাম', 'মাঝখানে', 'ডান'], contrast: ['বন্ধ', 'মাঝারি', 'উচ্চ', 'সর্বোচ্চ'], saturation: ['স্বাভাবিক', 'কম', 'বেশি', 'মনোক্রোম'], colorFilter: ['বন্ধ', 'প্রোটানোপিয়া', 'ডিউটারানোপিয়া', 'ট্রাইটানোপিয়া'] }
  };

  // Position labels for every language (order matches POS_KEYS)
  var POS_KEYS = ['bottom-right', 'bottom-left', 'middle-right', 'middle-left', 'top-right', 'top-left'];
  var POS_TEXT = {
    en: ['Widget position', ['Bottom right', 'Bottom left', 'Middle right', 'Middle left', 'Top right', 'Top left']],
    es: ['Posición del widget', ['Abajo derecha', 'Abajo izquierda', 'Medio derecha', 'Medio izquierda', 'Arriba derecha', 'Arriba izquierda']],
    fr: ['Position du widget', ['Bas droite', 'Bas gauche', 'Milieu droite', 'Milieu gauche', 'Haut droite', 'Haut gauche']],
    de: ['Position des Widgets', ['Unten rechts', 'Unten links', 'Mitte rechts', 'Mitte links', 'Oben rechts', 'Oben links']],
    pt: ['Posição do widget', ['Inferior direita', 'Inferior esquerda', 'Meio direita', 'Meio esquerda', 'Superior direita', 'Superior esquerda']],
    it: ['Posizione del widget', ['In basso a destra', 'In basso a sinistra', 'Al centro a destra', 'Al centro a sinistra', 'In alto a destra', 'In alto a sinistra']],
    nl: ['Positie van de widget', ['Rechtsonder', 'Linksonder', 'Midden rechts', 'Midden links', 'Rechtsboven', 'Linksboven']],
    pl: ['Położenie widżetu', ['Prawy dolny', 'Lewy dolny', 'Środek, prawa', 'Środek, lewa', 'Prawy górny', 'Lewy górny']],
    sv: ['Widgetens position', ['Nedre höger', 'Nedre vänster', 'Mitten höger', 'Mitten vänster', 'Övre höger', 'Övre vänster']],
    da: ['Widgetens placering', ['Nederst til højre', 'Nederst til venstre', 'Midt til højre', 'Midt til venstre', 'Øverst til højre', 'Øverst til venstre']],
    fi: ['Widgetin sijainti', ['Oikea alakulma', 'Vasen alakulma', 'Oikea keski', 'Vasen keski', 'Oikea yläkulma', 'Vasen yläkulma']],
    el: ['Θέση widget', ['Κάτω δεξιά', 'Κάτω αριστερά', 'Μέση δεξιά', 'Μέση αριστερά', 'Πάνω δεξιά', 'Πάνω αριστερά']],
    bn: ['উইজেটের অবস্থান', ['নিচে ডানে', 'নিচে বাঁয়ে', 'মাঝে ডানে', 'মাঝে বাঁয়ে', 'উপরে ডানে', 'উপরে বাঁয়ে']]
  };
  Object.keys(POS_TEXT).forEach(function (code) {
    if (!I18N[code]) { return; }
    I18N[code].position = POS_TEXT[code][0];
    I18N[code].positionNames = POS_TEXT[code][1];
  });

  var LANG_NAMES = { en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português', it: 'Italiano', nl: 'Nederlands', pl: 'Polski', sv: 'Svenska', da: 'Dansk', fi: 'Suomi', el: 'Ελληνικά', bn: 'বাংলা' };

  // ---------- Icons (24px grid, stroke-based, original drawings) ----------
  function svg(body, fill) {
    return '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false" fill="' + (fill || 'none') + '" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  }
  var ICONS = {
    textSize: svg('<path d="M3 19 8 5l5 14M5 14h6M16 19V9M13.5 11.5H19"/>'),
    lineHeight: svg('<path d="M6 3v18M3.5 6 6 3l2.5 3M3.5 18 6 21l2.5-3M12 6h9M12 12h9M12 18h9"/>'),
    spacing: svg('<path d="M3 12h4M17 12h4M9 12h6M6 8l-3 4 3 4M18 8l3 4-3 4"/>'),
    align: svg('<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>'),
    dyslexia: svg('<path d="M4 7h16M4 12h10M4 17h13"/><path d="M16 12c1.5 0 2.5 1 2.5 2.5S17.5 17 16 17"/>'),
    contrast: svg('<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>'),
    darkMode: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
    saturation: svg('<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>'),
    colorFilter: svg('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>'),
    hideImages: svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 20 21 4"/>'),
    hideDistractions: svg('<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3 3.7M6.6 6.6A16 16 0 0 0 2 12s3.5 6 10 6a10 10 0 0 0 4.4-1"/>'),
    pauseAnimations: svg('<path d="M9 5v14M15 5v14"/>'),
    focusIndicator: svg('<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="12" r="2.5"/>'),
    bigCursor: svg('<path d="M5 3v16l4-4 3 6 2.5-1-3-6H17z"/>'),
    magnifier: svg('<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M11 8v6M8 11h6"/>'),
    highlightLinks: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    highlightHeadings: svg('<rect x="3" y="4" width="18" height="7" rx="1"/><path d="M4 16h12"/>'),
    highlightHover: svg('<path d="M6 3v15l4-3.5 2.5 5.5 2.2-1-2.5-5.3H18z"/><rect x="3" y="2" width="18" height="20" rx="2" stroke-dasharray="2 3" opacity=".5"/>'),
    readingGuide: svg('<path d="M3 12h18" stroke-width="3"/><path d="M3 7h18M3 17h18" opacity=".4"/>'),
    readingMask: svg('<rect x="3" y="9" width="18" height="6" rx="1"/><path d="M3 4h18M3 20h18" opacity=".4"/>'),
    pageStructure: svg('<path d="M4 6h16M8 12h12M12 18h8"/><path d="M4 12h.01M4 18h.01" stroke-width="3"/>'),
    textToSpeech: svg('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>'),
    dictionary: svg('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>'),
    muteSounds: svg('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    voiceControl: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    keyboard: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'),
    customColors: svg('<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 1-2h2.5a3.5 3.5 0 0 0 3.5-3.5C21 7.5 17 3 12 3z"/><circle cx="7.5" cy="10" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/><circle cx="16" cy="8.5" r="1.2" fill="currentColor"/>'),
    profileVisual: svg('<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>'),
    profileAdhd: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
    profileCognitive: svg('<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/>')
  };
  var ICON_FAB = '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false" fill="currentColor">' +
    '<circle cx="12" cy="4" r="2.1"/>' +
    '<path d="M4 7.6 12 9.2 20 7.6v1.8l-5.8 1.1v2.6l2.4 5.3-1.7.8L12 14.2l-2.9 5.4-1.7-.8 2.4-5.3v-2.6L4 9.4z"/>' +
    '</svg>';

  // Tile definitions. kind: cycle | toggle | action | voice
  var TILES = [
    { key: 'textSize', group: 'text', kind: 'cycle' },
    { key: 'lineHeight', group: 'text', kind: 'cycle' },
    { key: 'spacing', group: 'text', kind: 'cycle' },
    { key: 'align', group: 'text', kind: 'cycle' },
    { key: 'dyslexia', group: 'text', kind: 'toggle' },
    { key: 'contrast', group: 'colour', kind: 'cycle' },
    { key: 'darkMode', group: 'colour', kind: 'toggle' },
    { key: 'saturation', group: 'colour', kind: 'cycle' },
    { key: 'colorFilter', group: 'colour', kind: 'cycle' },
    { key: 'hideImages', group: 'colour', kind: 'toggle' },
    { key: 'hideDistractions', group: 'colour', kind: 'toggle' },
    { key: 'pauseAnimations', group: 'colour', kind: 'toggle' },
    { key: 'focusIndicator', group: 'colour', kind: 'toggle' },
    { key: 'bigCursor', group: 'colour', kind: 'toggle' },
    { key: 'magnifier', group: 'colour', kind: 'toggle' },
    { key: 'highlightLinks', group: 'tools', kind: 'toggle' },
    { key: 'highlightHeadings', group: 'tools', kind: 'toggle' },
    { key: 'highlightHover', group: 'tools', kind: 'toggle' },
    { key: 'readingGuide', group: 'tools', kind: 'toggle' },
    { key: 'readingMask', group: 'tools', kind: 'toggle' },
    { key: 'pageStructure', group: 'tools', kind: 'action' },
    { key: 'keyboard', group: 'tools', kind: 'action' },
    { key: 'textToSpeech', group: 'tools', kind: 'toggle' },
    { key: 'dictionary', group: 'tools', kind: 'toggle' },
    { key: 'muteSounds', group: 'tools', kind: 'toggle' },
    { key: 'voiceControl', group: 'tools', kind: 'voice' }
  ];
  var TILE_BY_KEY = {};
  TILES.forEach(function (t) { TILE_BY_KEY[t.key] = t; });
  var GROUPS = [['text', 'groupText'], ['colour', 'groupColour'], ['tools', 'groupTools']];

  var PROFILES = {
    visual: { textSize: 3, contrast: 2, bigCursor: true, highlightLinks: true, focusIndicator: true, magnifier: true },
    adhd: { pauseAnimations: true, hideImages: true, hideDistractions: true, readingGuide: true, readingMask: true, focusIndicator: true },
    cognitive: { dyslexia: true, lineHeight: 2, spacing: 2, align: 1, highlightHeadings: true, textToSpeech: true }
  };

  var LINE_HEIGHT = ['normal', '1.7', '2.1', '2.6'];
  var LETTER_SPACING = [0, 0.05, 0.12, 0.2];
  var WORD_SPACING = [0, 0.1, 0.3, 0.6];
  var ALIGN = ['', 'left', 'center', 'right'];
  var TEXT_SCALE = [1, 1.15, 1.3, 1.5, 1.75];
  var SATURATION = [1, 0.5, 2, 0];
  var CB_NAMES = ['', 'protan', 'deutan', 'tritan'];
  var CB_MATRIX = {
    protan: '0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0',
    deutan: '0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0',
    tritan: '0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0'
  };
  var CURSOR_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><path d='M5 3 L5 29 L12 22.5 L17 33 L21.5 30.8 L16.6 20.6 L27 20.6 Z' fill='black' stroke='white' stroke-width='2.2' stroke-linejoin='round'/></svg>";
  var TEXT_TAGS = 'p,li,h1,h2,h3,h4,h5,h6,a,span,label,td,th,dt,dd,figcaption,blockquote,button,em,strong,small';
  var KB_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  var NUM_ROW = '1234567890';

  var SR = win.SpeechRecognition || win.webkitSpeechRecognition || null;
  var instance = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function merge(base, extra) {
    var out = clone(base);
    Object.keys(extra || {}).forEach(function (k) {
      var v = extra[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object') { out[k] = merge(out[k], v); }
      else { out[k] = v; }
    });
    return out;
  }
  function freshState() {
    return {
      textSize: 0, lineHeight: 0, spacing: 0, align: 0, dyslexia: false,
      contrast: 0, darkMode: false, saturation: 0, colorFilter: 0,
      hideImages: false, hideDistractions: false, pauseAnimations: false, focusIndicator: false, bigCursor: false, magnifier: false,
      highlightLinks: false, highlightHeadings: false, highlightHover: false, readingGuide: false, readingMask: false,
      textToSpeech: false, dictionary: false, muteSounds: false,
      customBg: '', customText: '', customTitle: '', position: ''
    };
  }
  function loadState() {
    var s = freshState();
    try {
      var saved = JSON.parse(win.localStorage.getItem(STATE_KEY) || 'null');
      if (saved) { Object.keys(s).forEach(function (k) { if (saved[k] !== undefined && typeof saved[k] === typeof s[k]) { s[k] = saved[k]; } }); }
    } catch (e) { /* storage unavailable */ }
    return s;
  }
  function saveState(s) { try { win.localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } }
  function pickLanguage(cfg) {
    var saved = '';
    try { saved = win.localStorage.getItem(LANG_KEY) || ''; } catch (e) { /* ignore */ }
    var page = String(doc.documentElement.lang || '').slice(0, 2).toLowerCase();
    var candidates = [saved, cfg.uiLanguage, page, 'en'];
    for (var i = 0; i < candidates.length; i++) { if (candidates[i] && I18N[candidates[i]]) { return candidates[i]; } }
    return 'en';
  }
  function hiddenUntil() { try { return Number(win.localStorage.getItem(HIDE_KEY)) || 0; } catch (e) { return 0; } }

  function shadowCss(cfg) {
    var p = cfg.primaryColor, t = cfg.textColor, hl = cfg.highlightColor;
    return [
      '.wrap{position:absolute;left:0;top:0;width:' + SIZE + 'px;height:' + SIZE + 'px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.4;color:#1d2330;text-align:left}',
      '.fab{position:absolute;left:0;top:0;width:' + SIZE + 'px;height:' + SIZE + 'px;margin:0;padding:0;border:3px solid #fff;border-radius:50%;background:' + p + ';color:' + t + ';box-shadow:0 8px 22px rgba(0,0,0,.28);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s ease}',
      '.fab:hover{transform:scale(1.06)}',
      '.fab{touch-action:none;user-select:none}',
      '.fab.dragging{transition:none!important;transform:none!important;cursor:grabbing}',
      'button:focus-visible,a:focus-visible,select:focus-visible{outline:3px solid ' + hl + ';outline-offset:2px}',
      '.panel{position:absolute;width:min(384px,calc(100vw - 32px));max-height:min(76vh,680px);overflow:auto;background:rgba(247,249,252,.82);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);color:#1d2330;border:1px solid rgba(255,255,255,.7);border-radius:16px;box-shadow:0 18px 48px rgba(10,20,40,.3);box-sizing:border-box;padding-bottom:14px}',
      '.panel[hidden]{display:none}',
      '.pos-r{right:0}.pos-l{left:0}',
      '.pos-t{top:' + (SIZE + 12) + 'px}.pos-b{bottom:' + (SIZE + 12) + 'px}',
      '.hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:8px;background:' + p + ';color:' + t + ';padding:14px 12px 14px 16px;border-radius:15px 15px 0 0}',
      '.hd h2{margin:0;font-size:17px;font-weight:700;line-height:1.2}',
      '.hd .brand{display:flex;align-items:center;gap:8px}',
      '.x{border:0;background:rgba(255,255,255,.18);color:' + t + ';min-width:40px;height:40px;border-radius:11px;font-size:20px;line-height:1;cursor:pointer;padding:0 10px;font-weight:700}',
      '.lang{margin:12px 14px 0;display:flex;align-items:center;gap:8px;font-size:13px;color:#4a5566}',
      '.lang select{flex:1;font:inherit;padding:8px 10px;border:1px solid #cfd7e3;border-radius:10px;background:#fff;color:#1d2330}',
      '.sec{margin:16px 16px 8px;font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#4a5566}',
      '.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 14px}',
      '.tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:92px;padding:12px 8px;border:1px solid #dfe5ee;border-radius:14px;background:#fff;color:#1d2330;font:inherit;font-size:13px;font-weight:600;text-align:center;cursor:pointer;box-shadow:0 1px 2px rgba(20,30,50,.05)}',
      '.tile:hover{border-color:' + p + ';box-shadow:0 4px 12px rgba(20,60,140,.12)}',
      '.tile .ic{color:' + p + ';display:flex}',
      '.tile .st{font-size:11px;font-weight:600;color:#66718a;background:#f0f3f8;border-radius:20px;padding:1px 9px}',
      '.tile.on{background:' + p + ';border-color:' + p + ';color:' + t + '}',
      '.tile.on .ic{color:' + t + '}',
      '.tile.on .st{background:rgba(255,255,255,.22);color:' + t + '}',
      '.tile:disabled{opacity:.5;cursor:not-allowed}',
      '.profiles{display:grid;gap:10px;padding:0 14px}',
      '.prof{display:flex;align-items:center;gap:12px;border:1px solid #dfe5ee;border-radius:14px;padding:12px 14px;background:#fff;color:#1d2330;font:inherit;font-weight:700;text-align:left;cursor:pointer}',
      '.prof .ic{color:' + p + ';display:flex}',
      '.prof:hover{border-color:' + p + '}',
      '.colours{display:grid;gap:8px;padding:0 14px}',
      '.crow{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fff;border:1px solid #dfe5ee;border-radius:12px;padding:8px 12px;font-size:14px}',
      '.crow input[type=color]{width:48px;height:32px;border:1px solid #cfd7e3;border-radius:8px;padding:2px;background:#fff;cursor:pointer}',
      '.foot{display:grid;gap:8px;padding:16px 14px 0}',
      '.btn{display:block;width:100%;border:1px solid ' + p + ';background:#fff;color:' + p + ';border-radius:11px;padding:11px 12px;font:inherit;font-weight:700;cursor:pointer;text-align:center;text-decoration:none;box-sizing:border-box}',
      '.btn:hover{background:#eef4ff}',
      '.btn.solid{background:' + p + ';color:' + t + '}',
      '.list{list-style:none;margin:0;padding:0 10px}',
      '.jump{display:block;width:100%;text-align:left;border:0;background:#fff;margin:4px 0;padding:9px 10px;border-radius:9px;font:inherit;color:#1d2330;cursor:pointer;box-sizing:border-box}',
      '.jump:hover{background:#eef4ff}',
      '.jump b{color:' + p + ';font-size:12px;margin-right:6px}',
      '.note{margin:0 16px;color:#4a5566;font-size:14px;line-height:1.5}',
      '.dict{padding:0 16px}.dict h3{margin:14px 0 6px;font-size:20px}.dict p{margin:0;font-size:15px;line-height:1.5}',
      '.kb{display:grid;gap:6px;padding:0 10px}',
      '.kr{display:flex;justify-content:center;gap:5px}',
      '.k{flex:1 1 0;min-width:0;height:42px;border:1px solid #cfd7e3;border-radius:9px;background:#fff;color:#1d2330;font:inherit;font-size:16px;font-weight:600;cursor:pointer;padding:0}',
      '.k.wide{flex:2.2 1 0}.k.space{flex:5 1 0}',
      '.k.on{background:' + p + ';color:' + t + ';border-color:' + p + '}',
      '.kbhint{margin:10px 14px 0;font-size:13px;color:#4a5566}',
      '@media (prefers-reduced-motion: reduce){.fab{transition:none}}'
    ].join('');
  }

  function buildDocCss(s, cfg) {
    var css = [];
    var body = 'body *:not(#' + HOST_ID + ')';
    var hl = cfg.highlightColor;
    var filters = [];

    if (s.textSize) { css.push('html{font-size:' + Math.round(TEXT_SCALE[s.textSize] * 100) + '%!important}'); }
    if (s.lineHeight) { css.push(body + '{line-height:' + LINE_HEIGHT[s.lineHeight] + '!important}'); }
    if (s.spacing) { css.push(body + '{letter-spacing:' + LETTER_SPACING[s.spacing] + 'em!important;word-spacing:' + WORD_SPACING[s.spacing] + 'em!important}'); }
    if (s.align) { css.push(body + '{text-align:' + ALIGN[s.align] + '!important}'); }
    if (s.dyslexia) { css.push(body + '{font-family:' + cfg.dyslexiaFont + '!important;letter-spacing:.06em!important;word-spacing:.12em!important;line-height:1.7!important}'); }

    if (s.contrast === 1) { filters.push('contrast(1.25)'); }
    if (s.contrast >= 2) {
      var fg = s.contrast === 3 ? '#ffff00' : '#ffffff';
      var link = s.contrast === 3 ? '#00ffff' : '#8fd8ff';
      css.push('body{background-color:#000!important}');
      css.push(body + '{background-color:#000!important;color:' + fg + '!important;border-color:' + fg + '!important}');
      css.push('body a:not(#' + HOST_ID + '){color:' + link + '!important}');
    }
    if (s.customBg) { css.push(body + '{background-color:' + s.customBg + '!important}'); }
    if (s.customText) { css.push(body + '{color:' + s.customText + '!important}'); }
    if (s.customTitle) { css.push('body h1,body h2,body h3,body h4,body h5,body h6{color:' + s.customTitle + '!important}'); }

    if (s.darkMode) {
      var inv = 'invert(1) hue-rotate(180deg)';
      filters.push(inv);
      css.push('#' + HOST_ID + '{filter:' + inv + '}');
      css.push('body img,body picture,body video,body canvas,body svg,body iframe{filter:' + inv + '}');
    }
    if (s.saturation) { filters.push('saturate(' + SATURATION[s.saturation] + ')'); }
    if (s.colorFilter) { filters.push('url(#ae-cb-' + CB_NAMES[s.colorFilter] + ')'); }
    if (filters.length) { css.push('html{filter:' + filters.join(' ') + '!important}'); }

    if (s.hideImages) {
      css.push('body img,body picture,body video,body svg,body canvas,body iframe,body object,body embed{visibility:hidden!important}');
      css.push(body + '{background-image:none!important}');
    }
    if (s.hideDistractions) { css.push('.ae-hidden{display:none!important}'); }
    if (s.pauseAnimations) { css.push('html *,html *::before,html *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'); }
    if (s.bigCursor) { css.push('html,html *{cursor:url("' + CURSOR_SVG + '") 2 2, auto!important}'); }
    if (s.highlightLinks) { css.push('body a:not(#' + HOST_ID + '){background-color:' + hl + '!important;color:#000!important;text-decoration:underline!important;outline:2px solid #000!important;outline-offset:1px}'); }
    if (s.highlightHeadings) { css.push('body h1,body h2,body h3,body h4,body h5,body h6{background-color:' + hl + '!important;color:#000!important;outline:3px solid ' + cfg.primaryColor + '!important;outline-offset:3px!important}'); }
    if (s.highlightHover) { css.push('body *:hover:not(#' + HOST_ID + '){outline:3px solid ' + cfg.primaryColor + '!important;outline-offset:2px!important;background-color:' + hl + '40!important}'); }
    if (s.focusIndicator) { css.push('html :focus-visible:not(#' + HOST_ID + '){outline:4px solid ' + hl + '!important;outline-offset:3px!important;box-shadow:0 0 0 7px #000!important}'); }
    return css.join('\n');
  }

  function ensureFilters() {
    if (doc.getElementById(FILTER_ID)) { return; }
    var ns = 'http://www.w3.org/2000/svg';
    var el = doc.createElementNS(ns, 'svg');
    el.setAttribute('id', FILTER_ID);
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('width', '0');
    el.setAttribute('height', '0');
    el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    var defs = doc.createElementNS(ns, 'defs');
    Object.keys(CB_MATRIX).forEach(function (name) {
      var f = doc.createElementNS(ns, 'filter');
      f.setAttribute('id', 'ae-cb-' + name);
      var m = doc.createElementNS(ns, 'feColorMatrix');
      m.setAttribute('type', 'matrix');
      m.setAttribute('values', CB_MATRIX[name]);
      f.appendChild(m);
      defs.appendChild(f);
    });
    el.appendChild(defs);
    doc.body.appendChild(el);
  }

  function init(userConfig) {
    if (instance) { return instance; }
    var cfg = merge(DEFAULTS, userConfig || {});
    var lang = pickLanguage(cfg);
    var L = merge(I18N[lang], cfg.labels || {});
    var state = loadState();
    var view = 'main';
    var voiceOn = false;
    var rec = null;
    var headings = [];
    var dict = { word: '', text: '', status: 'idle' };
    var muteObserver = null;
    var guideEl = null, maskEl = null, tipEl = null;
    var lastField = null;
    var kbShift = false;
    var voiceHeard = '';

    function enabled(key) { return cfg.features[key] !== false; }

    // ---------- Shadow DOM UI ----------
    var host = doc.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('style', 'position:absolute;left:0;top:0;width:' + SIZE + 'px;height:' + SIZE + 'px;margin:0;padding:0;z-index:2147483600;');
    var sr = host.attachShadow({ mode: 'open' });
    sr.innerHTML = '<style>' + shadowCss(cfg) + '</style>' +
      '<div class="wrap">' +
      '<button type="button" class="fab" id="fab" aria-haspopup="dialog" aria-expanded="false" aria-controls="panel" aria-label="' + esc(L.open) + '">' + ICON_FAB + '</button>' +
      '<div class="panel" id="panel" role="dialog" hidden></div>' +
      '</div>';
    var fab = sr.getElementById('fab');
    var panel = sr.getElementById('panel');

    // ---------- Positioning (document coordinates) ----------
    // A visitor can drag the button anywhere; the spot is remembered until they pick a preset position.
    var dragPos = null;
    try { dragPos = JSON.parse(win.localStorage.getItem('accessease:pos') || 'null'); } catch (e) { dragPos = null; }

    function place() {
      var pos = String(state.position || cfg.position || 'bottom-right');
      var off = Number(cfg.offset) || 20;
      var vw = doc.documentElement.clientWidth || win.innerWidth;
      var vh = doc.documentElement.clientHeight || win.innerHeight;
      var sx = win.scrollX || 0, sy = win.scrollY || 0;
      var left = /left/.test(pos) ? sx + off : sx + vw - off - SIZE;
      var top;
      if (/^top/.test(pos)) { top = sy + off; }
      else if (/^middle/.test(pos)) { top = sy + (vh - SIZE) / 2; }
      else { top = sy + vh - off - SIZE; }
      if (dragPos && typeof dragPos.left === 'number' && typeof dragPos.top === 'number') {
        left = Math.max(sx, Math.min(dragPos.left, sx + vw - SIZE));
        top = Math.max(sy, Math.min(dragPos.top, sy + vh - SIZE));
      }
      host.style.left = left + 'px';
      host.style.top = top + 'px';
      var onLeft = dragPos ? (left - sx) < vw / 2 : /left/.test(pos);
      var onTop = dragPos ? (top - sy) < vh / 2 : /^top|^middle/.test(pos);
      panel.className = 'panel ' + (onLeft ? 'pos-l' : 'pos-r') + ' ' + (onTop ? 'pos-t' : 'pos-b');
    }

    var drag = null;
    var justDragged = false;

    // Keep the button fully on screen while dragging (document coordinates).
    function clampToViewport(left, top) {
      var vw = doc.documentElement.clientWidth || win.innerWidth;
      var vh = doc.documentElement.clientHeight || win.innerHeight;
      var sx = win.scrollX || 0, sy = win.scrollY || 0;
      return {
        left: Math.max(sx, Math.min(left, sx + vw - SIZE)),
        top: Math.max(sy, Math.min(top, sy + vh - SIZE))
      };
    }

    var dragFrame = 0;
    var dragLatest = null;

    function applyDragFrame() {
      dragFrame = 0;
      if (!drag || !dragLatest) { return; }
      var dx = dragLatest.x - drag.x, dy = dragLatest.y - drag.y;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 6) { return; }
      drag.moved = true;
      var spot = clampToViewport(drag.left + dx, drag.top + dy);
      dragPos = spot;
      host.style.left = spot.left + 'px';
      host.style.top = spot.top + 'px';
    }

    function onFabPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) { return; }
      drag = { x: e.clientX, y: e.clientY, left: parseFloat(host.style.left) || 0, top: parseFloat(host.style.top) || 0, moved: false, id: e.pointerId };
      try { fab.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
      fab.classList.add('dragging');
    }

    function onFabPointerMove(e) {
      if (!drag) { return; }
      dragLatest = { x: e.clientX, y: e.clientY };
      if (!dragFrame) { dragFrame = win.requestAnimationFrame ? win.requestAnimationFrame(applyDragFrame) : win.setTimeout(applyDragFrame, 16); }
    }

    function onFabPointerUp(e) {
      if (!drag) { return; }
      try { fab.releasePointerCapture(drag.id); } catch (err) { /* ignore */ }
      if (dragFrame) { applyDragFrame(); }
      if (drag.moved) {
        justDragged = true;
        try { win.localStorage.setItem('accessease:pos', JSON.stringify(dragPos)); } catch (err) { /* ignore */ }
        place();
      }
      drag = null;
      dragLatest = null;
      fab.classList.remove('dragging');
    }

    // ---------- Dictionary tooltip for selected words ----------
    var defineEl = null;

    function ensureDefineTip() {
      if (defineEl) { return defineEl; }
      defineEl = doc.createElement('div');
      defineEl.id = 'ae-define';
      defineEl.setAttribute('role', 'tooltip');
      defineEl.style.cssText = 'position:absolute;display:none;max-width:320px;background:#fff;color:#1d2330;border:1px solid #d6dce6;border-radius:12px;box-shadow:0 12px 30px rgba(10,20,40,.25);padding:10px 12px;font:14px/1.45 Arial,sans-serif;z-index:2147483587;cursor:pointer';
      defineEl.addEventListener('click', function () {
        var word = defineEl.getAttribute('data-word');
        hideDefine();
        if (word) { lookupWord(word); }
      });
      doc.body.appendChild(defineEl);
      return defineEl;
    }

    function hideDefine() {
      if (defineEl) { defineEl.style.display = 'none'; }
    }

    function showDefine(word, rect) {
      var el = ensureDefineTip();
      el.setAttribute('data-word', word);
      el.textContent = '';
      var title = doc.createElement('strong');
      title.textContent = word;
      el.appendChild(title);
      el.appendChild(doc.createElement('br'));
      var body = doc.createElement('span');
      body.textContent = L.dictLoading;
      el.appendChild(body);
      el.style.left = (rect.left + (win.scrollX || 0)) + 'px';
      el.style.top = (rect.bottom + (win.scrollY || 0) + 8) + 'px';
      el.style.display = 'block';

      var code = (doc.documentElement.lang || cfg.language || 'en').slice(0, 2);
      if (!win.fetch) { body.textContent = L.dictNone + ' "' + word + '".'; return; }
      win.fetch('https://' + code + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(word))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (el.getAttribute('data-word') !== word) { return; }
          body.textContent = j && j.extract ? String(j.extract).slice(0, 220) : L.dictNone + ' "' + word + '".';
        })
        .catch(function () { body.textContent = L.dictNone + ' "' + word + '".'; });
    }

    function onSelectionEnd(e) {
      if (!state.dictionary || fromWidget(e)) { return; }
      var sel = win.getSelection ? win.getSelection() : null;
      var word = sel ? String(sel).trim() : '';
      if (!/^[A-Za-zÀ-ɏ'\-]{2,40}$/.test(word) || !sel.rangeCount) { hideDefine(); return; }
      var range = sel.getRangeAt(0);
      var rect = null;
      if (typeof range.getBoundingClientRect === 'function') { rect = range.getBoundingClientRect(); }
      if (!rect || (!rect.width && !rect.height)) {
        var anchor = e.target && e.target.getBoundingClientRect ? e.target : doc.body;
        rect = anchor.getBoundingClientRect();
      }
      showDefine(word, rect);
    }

    // ---------- Panel rendering ----------
    function tileStatus(t) {
      if (t.kind === 'cycle') { return L.options[t.key][state[t.key]]; }
      if (t.kind === 'toggle') { return state[t.key] ? L.on : L.off; }
      if (t.kind === 'voice') {
        if (!SR) { return L.unsupported; }
        if (!voiceOn) { return voiceHeard ? voiceHeard.slice(0, 22) : L.off; }
        return voiceHeard ? voiceHeard.slice(0, 22) : L.on;
      }
      return '›';
    }
    function isPressed(t) {
      if (t.kind === 'cycle') { return state[t.key] > 0; }
      if (t.kind === 'toggle') { return !!state[t.key]; }
      if (t.kind === 'voice') { return voiceOn; }
      return false;
    }
    function iconFor(key) { return ICONS[key] || ICONS.textSize; }

    function tileHtml(t) {
      var status = tileStatus(t);
      var pressed = isPressed(t);
      var isToggle = t.kind === 'toggle' || t.kind === 'voice';
      var disabled = t.kind === 'voice' && !SR;
      return '<button type="button" class="tile' + (pressed ? ' on' : '') + '" data-act="tile" data-key="' + t.key + '" data-focus="' + t.key + '"' +
        (isToggle ? ' aria-pressed="' + pressed + '"' : ' aria-label="' + esc(L[t.key] + ': ' + status) + '"') +
        (disabled ? ' disabled' : '') + '>' +
        '<span class="ic" aria-hidden="true">' + iconFor(t.key) + '</span>' +
        '<span class="lb">' + esc(L[t.key]) + '</span>' +
        '<span class="st" aria-hidden="true">' + esc(status) + '</span>' +
        '</button>';
    }

    function header(title, showBack) {
      var left = showBack
        ? '<button type="button" class="x" data-act="back" aria-label="' + esc(L.back) + '">&larr;</button>'
        : '';
      return '<div class="hd"><div class="brand"><h2>' + esc(title) + '</h2></div>' +
        (showBack ? left : '<button type="button" class="x" data-act="close" aria-label="' + esc(L.close) + '">&times;</button>') + '</div>';
    }

    function languageSelect() {
      var opts = Object.keys(I18N).map(function (code) {
        return '<option value="' + code + '"' + (code === lang ? ' selected' : '') + '>' + esc(LANG_NAMES[code]) + '</option>';
      }).join('');
      return '<div class="lang"><label for="ae-lang">' + esc(L.language) + '</label><select id="ae-lang" data-act="lang">' + opts + '</select></div>';
    }

    function positionSelect() {
      var current = state.position || cfg.position;
      var names = L.positionNames || POS_TEXT.en[1];
      var opts = POS_KEYS.map(function (key, i) {
        return '<option value="' + key + '"' + (key === current ? ' selected' : '') + '>' + esc(names[i]) + '</option>';
      }).join('');
      return '<div class="lang"><label for="ae-pos">' + esc(L.position || POS_TEXT.en[0]) + '</label><select id="ae-pos" data-act="position">' + opts + '</select></div>';
    }

    function mainHtml() {
      var out = header(cfg.brandName + ' · ' + L.title, false) + languageSelect() + positionSelect();

      if (enabled('profiles')) {
        out += '<div class="sec">' + esc(L.profiles) + '</div><div class="profiles">' +
          ['visual', 'adhd', 'cognitive'].map(function (p) {
            return '<button type="button" class="prof" data-act="profile" data-profile="' + p + '">' +
              '<span class="ic">' + ICONS['profile' + p.charAt(0).toUpperCase() + p.slice(1)] + '</span>' + esc(L['profile' + p.charAt(0).toUpperCase() + p.slice(1)]) + '</button>';
          }).join('') + '</div>';
      }

      GROUPS.forEach(function (g) {
        var tiles = TILES.filter(function (t) { return t.group === g[0] && enabled(t.key); });
        if (!tiles.length) { return; }
        out += '<div class="sec">' + esc(L[g[1]]) + '</div><div class="grid">' + tiles.map(tileHtml).join('') + '</div>';
        if (g[0] === 'colour' && enabled('customColors')) {
          out += '<div class="sec">' + esc(L.groupCustom) + '</div><div class="colours">' +
            colourRow('customBg', L.bgColor, state.customBg || '#ffffff') +
            colourRow('customText', L.textCol, state.customText || '#1d2330') +
            colourRow('customTitle', L.titleCol, state.customTitle || '#1663d7') +
            '<button type="button" class="btn" data-act="colour-reset">' + esc(L.colorReset) + '</button></div>';
        }
      });

      out += '<div class="foot">' +
        '<button type="button" class="btn solid" data-act="reset" data-focus="reset">' + esc(L.reset) + '</button>' +
        '<button type="button" class="btn" data-act="hide">' + esc(L.hide) + '</button>';
      if (cfg.statementUrl && enabled('statement')) {
        out += '<a class="btn" href="' + esc(cfg.statementUrl) + '" target="_blank" rel="noopener">' + esc(L.statement) + '</a>';
      }
      out += '</div>';
      return out;
    }

    function colourRow(key, label, value) {
      return '<label class="crow"><span>' + esc(label) + '</span><input type="color" data-colour="' + key + '" value="' + esc(value) + '"></label>';
    }

    function structureHtml() {
      var items = headings.map(function (el, i) {
        var lvl = Number(el.tagName.charAt(1)) || 1;
        var text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);
        return '<li><button type="button" class="jump" data-act="jump" data-idx="' + i + '" style="margin-left:' + ((lvl - 1) * 12) + 'px"><b>H' + lvl + '</b>' + esc(text || '(no text)') + '</button></li>';
      }).join('');
      return header(L.structureTitle, true) + (items ? '<ul class="list">' + items + '</ul>' : '<p class="note">' + esc(L.noHeadings) + '</p>');
    }

    function dictionaryHtml() {
      var body = dict.status === 'loading' ? L.dictLoading :
        dict.status === 'ok' ? dict.text :
        dict.status === 'none' ? L.dictNone + ' "' + dict.word + '".' : L.dictHint;
      return header(L.dictTitle, true) + '<div class="dict"><h3>' + esc(dict.word || '') + '</h3><p>' + esc(body) + '</p></div>';
    }

    function keyboardHtml() {
      var letters = function (row) {
        return row.split('').map(function (c) {
          var ch = kbShift ? c.toUpperCase() : c;
          return '<button type="button" class="k" data-act="key" data-k="' + esc(ch) + '">' + esc(ch) + '</button>';
        }).join('');
      };
      var numbers = NUM_ROW.split('').map(function (c) { return '<button type="button" class="k" data-act="key" data-k="' + c + '">' + c + '</button>'; }).join('');
      var bottom = '<button type="button" class="k wide' + (kbShift ? ' on' : '') + '" data-act="shift" aria-pressed="' + kbShift + '" aria-label="' + esc(L.shift) + '">⇧</button>' +
        '<button type="button" class="k space" data-act="key" data-k=" " aria-label="' + esc(L.space) + '">' + esc(L.space) + '</button>' +
        '<button type="button" class="k wide" data-act="key" data-k="BACKSPACE" aria-label="' + esc(L.del) + '">⌫</button>' +
        '<button type="button" class="k wide" data-act="key" data-k="ENTER" aria-label="' + esc(L.enter) + '">↵</button>';
      return header(L.keyboardTitle, true) +
        '<div class="kb">' + '<div class="kr">' + numbers + '</div>' +
        KB_ROWS.map(function (r) { return '<div class="kr">' + letters(r) + '</div>'; }).join('') +
        '<div class="kr">' + bottom + '</div></div>' +
        '<p class="kbhint">' + esc(L.keyboardHint) + '</p>';
    }

    function renderPanel(focusKey) {
      if (view === 'structure') { panel.innerHTML = structureHtml(); }
      else if (view === 'dictionary') { panel.innerHTML = dictionaryHtml(); }
      else if (view === 'keyboard') { panel.innerHTML = keyboardHtml(); }
      else { view = 'main'; panel.innerHTML = mainHtml(); }
      if (focusKey) {
        var el = panel.querySelector('[data-focus="' + focusKey + '"]');
        if (el && !el.disabled) { el.focus(); }
      }
    }

    function openPanel() {
      panel.hidden = false;
      fab.setAttribute('aria-expanded', 'true');
    }

    function setOpen(open) {
      if (open) {
        view = 'main';
        openPanel();
        renderPanel();
        var close = panel.querySelector('.x');
        if (close) { close.focus(); }
      } else {
        panel.hidden = true;
        fab.setAttribute('aria-expanded', 'false');
      }
    }

    // ---------- Page effects ----------
    function setStyle(css) {
      var el = doc.getElementById(STYLE_ID);
      if (!el) { el = doc.createElement('style'); el.id = STYLE_ID; doc.head.appendChild(el); }
      el.textContent = css;
    }

    function ensureOverlays() {
      if (guideEl) { return; }
      guideEl = doc.createElement('div');
      guideEl.id = 'ae-guide';
      guideEl.setAttribute('aria-hidden', 'true');
      guideEl.style.cssText = 'position:absolute;left:0;width:100%;height:4px;background:' + cfg.highlightColor + ';pointer-events:none;z-index:2147483590;display:none;top:0';
      maskEl = doc.createElement('div');
      maskEl.id = 'ae-mask';
      maskEl.setAttribute('aria-hidden', 'true');
      maskEl.style.cssText = 'position:absolute;left:0;width:100%;height:120px;background:transparent;box-shadow:0 0 0 100vmax rgba(0,0,0,.62);pointer-events:none;z-index:2147483589;display:none;top:0';
      tipEl = doc.createElement('div');
      tipEl.id = 'ae-magnifier';
      tipEl.setAttribute('aria-hidden', 'true');
      tipEl.style.cssText = 'position:absolute;display:none;max-width:420px;padding:8px 12px;background:#fff;color:#000;font:600 24px/1.35 Arial,sans-serif;border:3px solid ' + cfg.primaryColor + ';border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.3);pointer-events:none;z-index:2147483588';
      doc.body.appendChild(guideEl);
      doc.body.appendChild(maskEl);
      doc.body.appendChild(tipEl);
    }

    function onPointerMove(e) {
      if (guideEl) {
        if (guideEl.style.display !== 'none') { guideEl.style.top = (e.pageY - 2) + 'px'; }
        if (maskEl.style.display !== 'none') { maskEl.style.top = (e.pageY - 60) + 'px'; }
      }
      if (tipEl && state.magnifier) {
        var t = e.target;
        var el = t && t.closest ? t.closest(TEXT_TAGS) : null;
        var text = el && !host.contains(el) ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
        if (text) {
          tipEl.textContent = text.slice(0, 220);
          tipEl.style.display = 'block';
          tipEl.style.left = Math.min(e.pageX + 18, (doc.documentElement.scrollWidth || 0) - 440) + 'px';
          tipEl.style.top = (e.pageY + 22) + 'px';
        } else {
          tipEl.style.display = 'none';
        }
      }
    }

    function updateOverlays() {
      if (state.readingGuide || state.readingMask || state.magnifier) { ensureOverlays(); }
      if (guideEl) {
        guideEl.style.display = state.readingGuide ? 'block' : 'none';
        maskEl.style.display = state.readingMask ? 'block' : 'none';
        if (!state.magnifier) { tipEl.style.display = 'none'; }
      }
    }

    function muteAll(on) {
      var media = function () { return doc.querySelectorAll('audio,video'); };
      media().forEach(function (m) { m.muted = on; });
      if (on && !muteObserver && win.MutationObserver) {
        muteObserver = new win.MutationObserver(function () { media().forEach(function (m) { m.muted = true; }); });
        muteObserver.observe(doc.documentElement, { childList: true, subtree: true });
      } else if (!on && muteObserver) {
        muteObserver.disconnect();
        muteObserver = null;
      }
    }

    // Hide distractions: only floating elements (fixed/sticky) and sidebars or
    // dialogs outside the main content are hidden. Large blocks that contain
    // the page's main content are never hidden.
    var DIST_SEL = 'aside,[role=complementary],[role=dialog],[role=alertdialog],[class*="cookie" i],[id*="cookie" i],[class*="popup" i],[class*="newsletter" i],[class*="advert" i],[class*="modal" i]';
    var distHidden = [];
    var distObserver = null;
    var distTimer = null;

    function isDistraction(el) {
      if (el === doc.body || el === doc.documentElement || host.contains(el)) { return false; }
      if (el.querySelector('main,article,[role=main]')) { return false; }
      var cs = win.getComputedStyle ? win.getComputedStyle(el) : null;
      var floating = !!cs && (cs.position === 'fixed' || cs.position === 'sticky');
      var inMain = !!el.closest && !!el.closest('main,article,[role=main]');
      if (inMain && !floating) { return false; }
      if ((el.textContent || '').length > 2500 && !floating) { return false; }
      return true;
    }

    function applyDistractions(on) {
      distHidden.forEach(function (el) { el.classList.remove('ae-hidden'); });
      distHidden = [];
      if (on) {
        Array.prototype.forEach.call(doc.querySelectorAll(DIST_SEL), function (el) {
          if (isDistraction(el)) { el.classList.add('ae-hidden'); distHidden.push(el); }
        });
      }
      if (on && !distObserver && win.MutationObserver) {
        distObserver = new win.MutationObserver(function () {
          clearTimeout(distTimer);
          distTimer = setTimeout(function () { if (state.hideDistractions) { applyDistractions(true); } }, 400);
        });
        distObserver.observe(doc.body, { childList: true, subtree: true });
      } else if (!on && distObserver) {
        distObserver.disconnect();
        distObserver = null;
      }
    }

    function applyAll() {
      setStyle(buildDocCss(state, cfg));
      ensureFilters();
      muteAll(state.muteSounds);
      updateOverlays();
      applyDistractions(state.hideDistractions);
      place();
      saveState(state);
    }

    // Lists images with no alt attribute. Alt text is not generated automatically:
    // the site owner writes it, or sets alt="" for decorative images.
    function auditImages() {
      return Array.prototype.slice.call(doc.querySelectorAll('img'))
        .filter(function (img) { return !host.contains(img) && !img.hasAttribute('alt'); })
        .map(function (img) { return { src: img.currentSrc || img.src, fix: 'Add alt="..." (a short description) or alt="" if the image is decorative.' }; });
    }

    function speak(text) {
      try {
        if (!win.speechSynthesis) { return; }
        win.speechSynthesis.cancel();
        var u = new win.SpeechSynthesisUtterance(text);
        u.lang = doc.documentElement.lang || cfg.language;
        win.speechSynthesis.speak(u);
      } catch (e) { /* unsupported */ }
    }

    function fromWidget(e) {
      var path = e.composedPath ? e.composedPath() : [];
      return path.indexOf(host) !== -1;
    }

    function onDocClick(e) {
      if (!state.textToSpeech || fromWidget(e)) { return; }
      var el = e.target;
      var text = (el.innerText || el.textContent || el.alt || (el.getAttribute && el.getAttribute('aria-label')) || '').replace(/\s+/g, ' ').trim();
      if (text) { speak(text.slice(0, 400)); }
    }

    function trackField(e) {
      var t = e.target;
      if (fromWidget(e)) { return; }
      if (t && (t.isContentEditable || t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && /^(text|search|email|url|tel|password|number)?$/.test(t.type || 'text')))) {
        lastField = t;
      }
    }

    function lookupWord(word) {
      view = 'dictionary';
      dict = { word: word, text: '', status: 'loading' };
      openPanel();
      renderPanel();
      var code = (doc.documentElement.lang || cfg.language || 'en').slice(0, 2);
      if (!win.fetch) { dict.status = 'none'; renderPanel(); return; }
      win.fetch('https://' + code + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(word))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          dict.status = j && j.extract ? 'ok' : 'none';
          dict.text = (j && j.extract) || '';
          if (view === 'dictionary') { renderPanel(); }
        })
        .catch(function () { dict.status = 'none'; if (view === 'dictionary') { renderPanel(); } });
    }

    function onDblClick(e) {
      if (!state.dictionary || fromWidget(e)) { return; }
      var word = (win.getSelection ? String(win.getSelection()) : '').trim();
      if (/^[A-Za-zÀ-ɏ'\-]{2,40}$/.test(word)) { lookupWord(word); }
    }

    function collectHeadings() {
      headings = Array.prototype.slice.call(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'))
        .filter(function (el) { return (el.textContent || '').trim().length > 0 && !host.contains(el); });
    }

    function jumpTo(i) {
      var el = headings[i];
      if (!el) { return; }
      if (!el.hasAttribute('tabindex')) { el.setAttribute('tabindex', '-1'); }
      try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); }
      try { el.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }

    // ---------- Virtual keyboard ----------
    function typeKey(k) {
      var f = lastField;
      if (!f || !doc.contains(f)) { return; }
      try { f.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      if (k === 'BACKSPACE') {
        if (f.isContentEditable) { doc.execCommand('delete'); }
        else {
          var s = f.selectionStart == null ? f.value.length : f.selectionStart;
          var en = f.selectionEnd == null ? s : f.selectionEnd;
          var from = s === en ? Math.max(0, s - 1) : s;
          f.value = f.value.slice(0, from) + f.value.slice(en);
          f.setSelectionRange(from, from);
          f.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }
      if (k === 'ENTER') {
        if (f.isContentEditable || f.tagName === 'TEXTAREA') { typeText('\n', f); }
        return;
      }
      typeText(k, f);
      if (kbShift) { kbShift = false; renderPanel('shift'); }
    }

    function typeText(ch, f) {
      if (f.isContentEditable) { doc.execCommand('insertText', false, ch); return; }
      var s = f.selectionStart == null ? f.value.length : f.selectionStart;
      var en = f.selectionEnd == null ? s : f.selectionEnd;
      f.value = f.value.slice(0, s) + ch + f.value.slice(en);
      f.setSelectionRange(s + ch.length, s + ch.length);
      f.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // ---------- Voice control ----------
    var VOICE_COMMANDS = [
      { p: ['bigger text', 'larger text', 'increase text'], run: function () { state.textSize = Math.min(state.textSize + 1, 4); } },
      { p: ['smaller text', 'reduce text'], run: function () { state.textSize = Math.max(state.textSize - 1, 0); } },
      { p: ['high contrast', 'increase contrast'], run: function () { state.contrast = 2; } },
      { p: ['normal contrast', 'contrast off'], run: function () { state.contrast = 0; } },
      { p: ['dark mode', 'night mode'], run: function () { state.darkMode = !state.darkMode; } },
      { p: ['dyslexia font', 'dyslexia friendly'], run: function () { state.dyslexia = !state.dyslexia; } },
      { p: ['hide images', 'no images'], run: function () { state.hideImages = true; } },
      { p: ['show images'], run: function () { state.hideImages = false; } },
      { p: ['stop animations', 'pause animations'], run: function () { state.pauseAnimations = true; } },
      { p: ['big cursor', 'bigger cursor'], run: function () { state.bigCursor = true; } },
      { p: ['highlight links'], run: function () { state.highlightLinks = true; } },
      { p: ['read aloud', 'read on click'], run: function () { state.textToSpeech = true; } },
      { p: ['stop reading'], run: function () { state.textToSpeech = false; try { win.speechSynthesis.cancel(); } catch (e) { /* ignore */ } } },
      { p: ['reset all', 'reset everything'], run: function () { resetState(); } },
      { p: ['show menu', 'open menu'], run: function () { setOpen(true); } },
      { p: ['close menu', 'hide menu'], run: function () { setOpen(false); } }
    ];

    // Common spoken alternatives, mapped to the command phrases above.
    var VOICE_SYNONYMS = [
      ['increase font size', 'bigger text'], ['make text bigger', 'bigger text'], ['larger text', 'bigger text'],
      ['dark theme', 'dark mode'], ['night theme', 'dark mode'],
      ['no pictures', 'hide images'], ['hide pictures', 'hide images'],
      ['contrast on', 'high contrast'], ['reset settings', 'reset all'],
      ['close the menu', 'close menu'], ['open the menu', 'open menu']
    ];

    function normaliseSpeech(s) {
      return ' ' + String(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim() + ' ';
    }

    // candidates: the alternatives Chrome heard for one phrase, best first.
    function runVoice(candidates) {
      for (var k = 0; k < candidates.length; k++) {
        var said = normaliseSpeech(candidates[k]);
        VOICE_SYNONYMS.forEach(function (pair) {
          said = said.split(' ' + pair[0] + ' ').join(' ' + pair[1] + ' ');
        });
        for (var i = 0; i < VOICE_COMMANDS.length; i++) {
          var c = VOICE_COMMANDS[i];
          for (var j = 0; j < c.p.length; j++) {
            if (said.indexOf(' ' + c.p[j] + ' ') !== -1) {
              c.run();
              applyAll();
              voiceHeard = '✓ ' + candidates[0];
              if (!panel.hidden) { renderPanel('voiceControl'); }
              return true;
            }
          }
        }
      }
      voiceHeard = '? ' + (candidates[0] || '');
      if (!panel.hidden) { renderPanel('voiceControl'); }
      return false;
    }

    function stopVoice() {
      voiceOn = false;
      voiceHeard = '';
      if (rec) { try { rec.onend = null; rec.stop(); } catch (e) { /* ignore */ } rec = null; }
    }

    function toggleVoice() {
      if (!SR) { return; }
      if (voiceOn) { stopVoice(); return; }
      try {
        rec = new SR();
        rec.continuous = true;
        rec.interimResults = false;
        rec.maxAlternatives = 3;
        var code = (doc.documentElement.lang || 'en').toLowerCase();
        rec.lang = code === 'en' ? 'en-US' : code;
        rec.onresult = function (ev) {
          // Handle every new final result, not just the last one.
          for (var i = ev.resultIndex; i < ev.results.length; i++) {
            var res = ev.results[i];
            if (!res.isFinal) { continue; }
            var candidates = [];
            for (var a = 0; a < res.length; a++) { candidates.push(String(res[a].transcript)); }
            runVoice(candidates);
          }
        };
        // Silence ("no-speech") and short interruptions are not failures:
        // the onend handler restarts listening. Only permission or hardware errors stop it.
        rec.onend = function () {
          if (!voiceOn) { return; }
          try { rec.start(); } catch (e) { /* will retry on the next onend */ }
        };
        rec.onerror = function (ev) {
          var err = ev && ev.error;
          if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
            stopVoice();
            voiceHeard = err === 'audio-capture' ? 'no microphone' : 'mic blocked';
            if (!panel.hidden) { renderPanel('voiceControl'); }
          }
        };
        rec.start();
        voiceOn = true;
        voiceHeard = '';
      } catch (e) { voiceOn = false; }
    }

    // ---------- Actions ----------
    function applyProfile(name) {
      var p = PROFILES[name];
      if (!p) { return; }
      var keepPosition = state.position;
      state = freshState();
      state.position = keepPosition;
      Object.keys(p).forEach(function (k) { state[k] = p[k]; });
      applyAll();
    }

    function resetState() {
      try { win.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      state = freshState();
      applyAll();
    }

    function hideWidget() {
      try { win.localStorage.setItem(HIDE_KEY, String(Date.now() + cfg.hideHours * 3600 * 1000)); } catch (e) { /* ignore */ }
      setOpen(false);
      host.style.display = 'none';
    }

    function onTile(key) {
      var t = TILE_BY_KEY[key];
      if (!t) { return; }
      if (t.kind === 'action') {
        if (key === 'pageStructure') { collectHeadings(); view = 'structure'; renderPanel(); }
        if (key === 'keyboard') { view = 'keyboard'; renderPanel(); }
        return;
      }
      if (t.kind === 'voice') { toggleVoice(); renderPanel(key); return; }
      if (t.kind === 'cycle') { state[key] = (state[key] + 1) % L.options[key].length; }
      else { state[key] = !state[key]; }
      applyAll();
      renderPanel(key);
    }

    function setLanguage(code) {
      if (!I18N[code]) { return; }
      lang = code;
      L = merge(I18N[code], cfg.labels || {});
      try { win.localStorage.setItem(LANG_KEY, code); } catch (e) { /* ignore */ }
      fab.setAttribute('aria-label', L.open);
      renderPanel('ae-lang');
    }

    function onPanelClick(e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
      if (!el) { return; }
      var act = el.getAttribute('data-act');
      if (act === 'close') { setOpen(false); fab.focus(); }
      else if (act === 'back') { view = 'main'; renderPanel('pageStructure'); }
      else if (act === 'tile') { onTile(el.getAttribute('data-key')); }
      else if (act === 'profile') { applyProfile(el.getAttribute('data-profile')); renderPanel(); }
      else if (act === 'reset') { resetState(); renderPanel('reset'); }
      else if (act === 'hide') { hideWidget(); }
      else if (act === 'jump') { jumpTo(Number(el.getAttribute('data-idx'))); }
      else if (act === 'key') { typeKey(el.getAttribute('data-k')); }
      else if (act === 'shift') { kbShift = !kbShift; renderPanel('shift'); }
      else if (act === 'colour-reset') {
        state.customBg = ''; state.customText = ''; state.customTitle = '';
        applyAll(); renderPanel('colour-reset');
      }
    }

    function onPanelInput(e) {
      var key = e.target && e.target.getAttribute && e.target.getAttribute('data-colour');
      if (!key) { return; }
      state[key] = e.target.value;
      applyAll();
    }

    function onPanelChange(e) {
      var act = e.target && e.target.getAttribute ? e.target.getAttribute('data-act') : null;
      if (act === 'lang') { setLanguage(e.target.value); }
      if (act === 'position') {
        state.position = e.target.value;
        dragPos = null;
        try { win.localStorage.removeItem('accessease:pos'); } catch (err) { /* ignore */ }
        applyAll();
      }
    }

    // ---------- Mount ----------
    fab.addEventListener('pointerdown', onFabPointerDown);
    fab.addEventListener('pointermove', onFabPointerMove);
    fab.addEventListener('pointerup', onFabPointerUp);
    fab.addEventListener('pointercancel', function () { drag = null; });
    fab.addEventListener('click', function () {
      if (justDragged) { justDragged = false; return; }
      if (panel.hidden) { setOpen(true); } else { setOpen(false); }
    });
    doc.addEventListener('mouseup', onSelectionEnd, true);
    doc.addEventListener('mousedown', function (e) {
      if (defineEl && !defineEl.contains(e.target)) { hideDefine(); }
    }, true);
    panel.addEventListener('click', onPanelClick);
    panel.addEventListener('input', onPanelInput);
    panel.addEventListener('change', onPanelChange);
    panel.addEventListener('mousedown', function (e) {
      // Keep focus in the page field while typing on the virtual keyboard.
      if (e.target && e.target.closest && e.target.closest('[data-act="key"],[data-act="shift"]')) { e.preventDefault(); }
    });
    sr.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { setOpen(false); fab.focus(); }
    });
    doc.addEventListener('click', onDocClick, true);
    doc.addEventListener('dblclick', onDblClick, false);
    doc.addEventListener('focusin', trackField, true);
    doc.addEventListener('mousemove', onPointerMove, { passive: true });
    win.addEventListener('resize', place);
    win.addEventListener('scroll', place, { passive: true });

    doc.body.appendChild(host);
    if (hiddenUntil() > Date.now()) { host.style.display = 'none'; }
    place();
    applyAll();
    renderPanel();

    instance = {
      version: VERSION,
      open: function () { setOpen(true); },
      close: function () { setOpen(false); },
      reset: function () { resetState(); renderPanel(); },
      setProfile: function (name) { applyProfile(name); renderPanel(); },
      setLanguage: setLanguage,
      auditImages: auditImages,
      getState: function () { return clone(state); }
    };
    return instance;
  }

  win.AccessEase = { version: VERSION, init: init, instance: null, languages: Object.keys(I18N) };

  function boot() { win.AccessEase.instance = init(win.ACCESSEASE_CONFIG || {}); }

  if (win.ACCESSEASE_AUTO_INIT !== false) {
    if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', boot); }
    else { boot(); }
  }
})(window, document);

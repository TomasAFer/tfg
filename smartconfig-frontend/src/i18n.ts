import type { Language } from '@/store/config.store';

export type TranslationKey =
  | 'app.brandTitle'
  | 'app.brandSubtitle'
  | 'mode.welcome'
  | 'mode.subtitle'
  | 'mode.byIndustry.title'
  | 'mode.byIndustry.desc'
  | 'mode.byParameters.title'
  | 'mode.byParameters.desc'
  | 'mode.chooseMode'
  | 'confirm.reset'
  | 'industry.title'
  | 'industry.subtitle'
  | 'families.title'
  | 'families.subtitle'
  | 'families.noResults'
  | 'families.selectedIndustry'
  | 'robots.title'
  | 'robots.subtitle'
  | 'robots.noResults'
  | 'summary.title'
  | 'summary.items'
  | 'summary.emptyTitle'
  | 'summary.emptyDescription'
  | 'summary.configureRobot'
  | 'summary.back'
  | 'summary.print'
  | 'summary.sendToSales'
  | 'summary.mode.industry'
  | 'summary.mode.params'
  | 'summary.deleteConfirm'
  | 'summary.form.error.empty'
  | 'summary.form.error.fields'
  | 'summary.form.error.email'
  | 'summary.sent'
  | 'buttons.back'
  | 'filters.title'
  | 'robotConfig.controladora'
  | 'robotConfig.accesoriosOblig'
  | 'robotConfig.accesoriosOpc'
  | 'robotConfig.cantidad'
  | 'robotConfig.noAcc'
  | 'header.summary'
  | 'footer.text'
  | 'common.yes'
  | 'common.no'
  | 'buttons.close'
  | 'buttons.delete'
  | 'buttons.cancel'
  | 'buttons.addToSummary'
  | 'summary.selectionModeTitle'
  | 'summary.industryLabel'
  | 'summary.configNumber'
  | 'summary.codeLabel'
  | 'summary.familyLabel'
  | 'summary.axesLabel'
  | 'summary.payloadLabel'
  | 'summary.reachLabel'
  | 'summary.controller'
  | 'summary.accessoriesTitle'
  | 'summary.accessoryName'
  | 'summary.quantity'
  | 'summary.mandatory'
  | 'summary.deleteButton'
  | 'summary.sending'
  | 'summary.sentLabel'
  | 'filters.modelsTitle'
  | 'robots.collaborativeTag'
  | 'robots.axes'
  | 'robots.payload'
  | 'robots.reach'
  | 'robots.loadError'
  | 'errors.configLoad'
  | 'errors.loadFamilies'
  | 'errors.selectController'
  | 'summary.form.error.send'
  | 'controller.generation'
  | 'controller.axesMax'
  | 'robotDetails.description'
  | 'robotDetails.protectionLabel'
  | 'robotDetails.configurationTitle'
  | 'robotDetails.confirmTitle'
  | 'robotDetails.confirmMessage'
  | 'robotDetails.confirmAccept'
  | 'common.na'
  | 'language.es'
  | 'language.en'
  | 'units.kg'
  | 'units.mm'
  | 'filters.industry'
  | 'filters.payload'
  | 'filters.reach'
  | 'filters.axes'
  | 'filters.collaborative'
  | 'filters.protection'
  | 'filters.allIndustries'
  | 'filters.allAxes'
  | 'filters.indifferent'
  | 'filters.yes'
  | 'filters.no'
  | 'filters.all'
  | 'filters.clearFilters'
  | 'filters.applyFilters'
  | 'filters.activeFilters'
  | 'filters.loadingRanges'
  | 'techFilters.title'
  | 'techFilters.subtitle'
  | 'techFilters.resetButton'
  | 'contactForm.title'
  | 'contactForm.subtitle'
  | 'contactForm.nameLabel'
  | 'contactForm.companyLabel'
  | 'contactForm.emailLabel'
  | 'contactForm.phoneLabel'
  | 'contactForm.commentLabel'
  | 'contactForm.cancel'
  | 'contactForm.send'
  | 'contactForm.sending';

const translations: Record<Language, Record<TranslationKey, string>> = {
  es: {
    'app.brandTitle': 'SmartConfig',
    'app.brandSubtitle': 'Configurador de Robots Industriales',
    'mode.welcome': 'Bienvenido a SmartConfig',
    'mode.subtitle': 'Configure su robot industrial de forma inteligente',
    'mode.byIndustry.title': 'Por Industria',
    'mode.byIndustry.desc': 'Seleccione su sector industrial y encuentre robots recomendados',
    'mode.byParameters.title': 'Por Parámetros Técnicos',
    'mode.byParameters.desc': 'Configure filtros técnicos específicos para su aplicación',
    'mode.chooseMode': '¿Cómo desea comenzar?',
    'confirm.reset': '¿Desea reiniciar la configuración? Se perderán todos los cambios.',
    'industry.title': 'Seleccione su Industria',
    'industry.subtitle': 'Elija el sector industrial que mejor se adapte a su aplicación',
    'families.title': 'Seleccione una Familia de Robots',
    'families.subtitle': 'Elija la familia que mejor se adapte a su necesidad',
    'families.noResults': 'No hay familias disponibles con los criterios seleccionados',
    'families.selectedIndustry': 'Industria seleccionada:',
    'robots.title': 'Seleccione un Modelo',
    'robots.subtitle': 'Elija el modelo de robot que se adapte a su configuración',
    'robots.noResults': 'No hay modelos disponibles con los criterios seleccionados',
    'summary.title': 'Resumen de Configuración',
    'summary.items': 'configuraciones',
    'summary.emptyTitle': 'Su resumen está vacío',
    'summary.emptyDescription': 'Configure robots y agréguelos al resumen para verlos aquí',
    'summary.configureRobot': '➕ Configurar Robot',
    'summary.back': '← Agregar más robots',
    'summary.print': 'Imprimir / PDF',
    'summary.sendToSales': 'Enviar a Comercial',
    'summary.mode.industry': '🏭 Por Industria',
    'summary.mode.params': '⚙️ Por Parámetros Técnicos',
    'summary.deleteConfirm': '¿Desea eliminar esta configuración del resumen?',
    'summary.form.error.empty': 'No hay configuraciones para enviar.',
    'summary.form.error.fields': 'Completa todos los campos obligatorios.',
    'summary.form.error.email': 'Ingresa un email válido.',
    'summary.sent': 'Solicitud enviada correctamente. Nos pondremos en contacto pronto.',
    'buttons.back': '← Volver',
    'filters.title': 'Filtros',
    'robotConfig.controladora': 'Controladora',
    'robotConfig.accesoriosOblig': 'Accesorios Obligatorios',
    'robotConfig.accesoriosOpc': 'Accesorios Opcionales',
    'robotConfig.cantidad': 'Cantidad:',
    'robotConfig.noAcc': 'No hay accesorios disponibles para este robot.',
    'header.summary': 'Resumen',
    'footer.text': '2025 Proyecto académico SmartConfig - Configurador de Robots Industriales',
    'common.yes': 'Sí',
    'common.no': 'No',
    'buttons.close': 'Cerrar',
    'buttons.delete': 'Eliminar',
    'buttons.cancel': 'Cancelar',
    'buttons.addToSummary': 'Agregar al resumen',
    'summary.selectionModeTitle': 'Modo de selección',
    'summary.industryLabel': 'Industria:',
    'summary.configNumber': 'Configuración #',
    'summary.codeLabel': 'Código:',
    'summary.familyLabel': 'Familia',
    'summary.axesLabel': 'Número de ejes',
    'summary.payloadLabel': 'Carga máxima',
    'summary.reachLabel': 'Alcance máximo',
    'summary.controller': 'Controladora',
    'summary.accessoriesTitle': 'Accesorios',
    'summary.accessoryName': 'Accesorio',
    'summary.quantity': 'Cantidad',
    'summary.mandatory': 'Obligatorio',
    'summary.deleteButton': 'Eliminar',
    'summary.sending': 'Enviando...',
    'summary.sentLabel': '✓ Enviado',
    'filters.modelsTitle': 'Filtros de modelos',
    'robots.collaborativeTag': 'Colaborativo',
    'robots.axes': 'Ejes',
    'robots.payload': 'Carga',
    'robots.reach': 'Alcance',
    'robots.loadError': 'Error al cargar los modelos',
    'errors.configLoad': 'Error al cargar la configuración',
    'errors.loadFamilies': 'Error al cargar las familias',
    'errors.selectController': 'Debes seleccionar una controladora',
    'summary.form.error.send': 'Error al enviar la solicitud. Intenta nuevamente.',
    'controller.generation': 'Generación:',
    'controller.axesMax': 'Ejes máx:',
    'robotDetails.description': 'Descripción',
    'robotDetails.protectionLabel': 'Grado de protección',
    'robotDetails.configurationTitle': 'Configuración',
    'robotDetails.confirmTitle': 'Agregar al resumen',
    'robotDetails.confirmMessage': '¿Desea guardar esta configuración en el resumen para revisarla más tarde?',
    'robotDetails.confirmAccept': 'Sí, guardar',
    'common.na': 'N/D',
    'language.es': 'ES',
    'language.en': 'EN',
    'units.kg': 'kg',
    'units.mm': 'mm',
    'filters.industry': 'Industria',
    'filters.payload': 'Carga útil',
    'filters.reach': 'Alcance',
    'filters.axes': 'Número de ejes',
    'filters.collaborative': 'Robot Colaborativo',
    'filters.protection': 'Grado de protección (IP)',
    'filters.allIndustries': 'Todas',
    'filters.allAxes': 'Todos',
    'filters.indifferent': 'Indiferente',
    'filters.yes': 'Sí',
    'filters.no': 'No',
    'filters.all': 'Todos',
    'filters.clearFilters': 'Limpiar filtros',
    'filters.applyFilters': 'Aplicar filtros',
    'filters.activeFilters': 'activos',
    'filters.loadingRanges': 'Cargando rangos...',
    'techFilters.title': 'Parámetros Técnicos',
    'techFilters.subtitle': 'Configure los filtros técnicos para su aplicación',
    'techFilters.resetButton': 'Limpiar filtros',
    'contactForm.title': 'Enviar a Comercial',
    'contactForm.subtitle': 'Completa tus datos y enviaremos tus configuraciones al equipo comercial.',
    'contactForm.nameLabel': 'Nombre',
    'contactForm.companyLabel': 'Empresa',
    'contactForm.emailLabel': 'Email',
    'contactForm.phoneLabel': 'Teléfono',
    'contactForm.commentLabel': 'Comentario',
    'contactForm.cancel': 'Cancelar',
    'contactForm.send': 'Enviar solicitud',
    'contactForm.sending': '⏳ Enviando...',
  },
  en: {
    'app.brandTitle': 'SmartConfig',
    'app.brandSubtitle': 'Industrial Robots Configurator',
    'mode.welcome': 'Welcome to SmartConfig',
    'mode.subtitle': 'Configure your industrial robot smartly',
    'mode.byIndustry.title': 'By Industry',
    'mode.byIndustry.desc': 'Select your sector and find recommended robots',
    'mode.byParameters.title': 'By Technical Parameters',
    'mode.byParameters.desc': 'Set technical filters for your application',
    'mode.chooseMode': 'How do you want to start?',
    'confirm.reset': 'Do you want to reset the configuration? All changes will be lost.',
    'industry.title': 'Select your Industry',
    'industry.subtitle': 'Choose the industrial sector that fits your application',
    'families.title': 'Choose a Robot Family',
    'families.subtitle': 'Pick the family that best suits your needs',
    'families.noResults': 'No families available with the selected criteria',
    'families.selectedIndustry': 'Selected industry:',
    'robots.title': 'Select a Model',
    'robots.subtitle': 'Choose the robot model that fits your configuration',
    'robots.noResults': 'No models available with the selected criteria',
    'summary.title': 'Configuration Summary',
    'summary.items': 'configurations',
    'summary.emptyTitle': 'Your summary is empty',
    'summary.emptyDescription': 'Configure robots and add them to the summary to see them here',
    'summary.configureRobot': '➕ Configure Robot',
    'summary.back': '← Add more robots',
    'summary.print': 'Print / PDF',
    'summary.sendToSales': 'Send to Sales',
    'summary.mode.industry': '🏭 By Industry',
    'summary.mode.params': '⚙️ By Technical Parameters',
    'summary.deleteConfirm': 'Do you want to remove this configuration from the summary?',
    'summary.form.error.empty': 'There are no configurations to send.',
    'summary.form.error.fields': 'Complete all required fields.',
    'summary.form.error.email': 'Enter a valid email.',
    'summary.sent': 'Request sent successfully. We will contact you soon.',
    'buttons.back': '← Back',
    'filters.title': 'Filters',
    'robotConfig.controladora': 'Controller',
    'robotConfig.accesoriosOblig': 'Mandatory Accessories',
    'robotConfig.accesoriosOpc': 'Optional Accessories',
    'robotConfig.cantidad': 'Quantity:',
    'robotConfig.noAcc': 'No accessories available for this robot.',
    'header.summary': 'Summary',
    'footer.text': '2025 Academic project SmartConfig - Industrial Robot Configurator',
    'common.yes': 'Yes',
    'common.no': 'No',
    'buttons.close': 'Close',
    'buttons.delete': 'Delete',
    'buttons.cancel': 'Cancel',
    'buttons.addToSummary': 'Add to summary',
    'summary.selectionModeTitle': 'Selection mode',
    'summary.industryLabel': 'Industry:',
    'summary.configNumber': 'Configuration #',
    'summary.codeLabel': 'Code:',
    'summary.familyLabel': 'Family',
    'summary.axesLabel': 'Axes',
    'summary.payloadLabel': 'Payload',
    'summary.reachLabel': 'Reach',
    'summary.controller': 'Controller',
    'summary.accessoriesTitle': 'Accessories',
    'summary.accessoryName': 'Accessory',
    'summary.quantity': 'Quantity',
    'summary.mandatory': 'Mandatory',
    'summary.deleteButton': 'Delete',
    'summary.sending': 'Sending...',
    'summary.sentLabel': '✓ Sent',
    'filters.modelsTitle': 'Model filters',
    'robots.collaborativeTag': 'Collaborative',
    'robots.axes': 'Axes',
    'robots.payload': 'Payload',
    'robots.reach': 'Reach',
    'robots.loadError': 'Error loading models',
    'errors.configLoad': 'Error loading configuration',
    'errors.loadFamilies': 'Error loading families',
    'errors.selectController': 'You must select a controller',
    'summary.form.error.send': 'Error sending the request. Please try again.',
    'controller.generation': 'Generation:',
    'controller.axesMax': 'Max axes:',
    'robotDetails.description': 'Description',
    'robotDetails.protectionLabel': 'Protection rating',
    'robotDetails.configurationTitle': 'Configuration',
    'robotDetails.confirmTitle': 'Add to summary',
    'robotDetails.confirmMessage': 'Do you want to save this configuration in the summary to review it later?',
    'robotDetails.confirmAccept': 'Yes, save',
    'common.na': 'N/A',
    'language.es': 'ES',
    'language.en': 'EN',
    'units.kg': 'kg',
    'units.mm': 'mm',
    'filters.industry': 'Industry',
    'filters.payload': 'Payload',
    'filters.reach': 'Reach',
    'filters.axes': 'Number of axes',
    'filters.collaborative': 'Collaborative Robot',
    'filters.protection': 'Protection rating (IP)',
    'filters.allIndustries': 'All',
    'filters.allAxes': 'All',
    'filters.indifferent': 'Indifferent',
    'filters.yes': 'Yes',
    'filters.no': 'No',
    'filters.all': 'All',
    'filters.clearFilters': 'Clear filters',
    'filters.applyFilters': 'Apply filters',
    'filters.activeFilters': 'active',
    'filters.loadingRanges': 'Loading ranges...',
    'techFilters.title': 'Technical Parameters',
    'techFilters.subtitle': 'Configure technical filters for your application',
    'techFilters.resetButton': 'Clear filters',
    'contactForm.title': 'Send to Sales',
    'contactForm.subtitle': 'Complete your details and we will send your configurations to our sales team.',
    'contactForm.nameLabel': 'Name',
    'contactForm.companyLabel': 'Company',
    'contactForm.emailLabel': 'Email',
    'contactForm.phoneLabel': 'Phone',
    'contactForm.commentLabel': 'Comment',
    'contactForm.cancel': 'Cancel',
    'contactForm.send': 'Send request',
    'contactForm.sending': '⏳ Sending...',
  },
};

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang]?.[key] ?? key;
}

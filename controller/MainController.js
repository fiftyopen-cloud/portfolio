import ThemeManager from '../core/ThemeManager.js';

(function() {
    // https://dashboard.emailjs.com/admin/account
    // free subscription: 1000 emails/month, 5 email templates, 1 email service
    emailjs.init({
        publicKey: "7NTnHuoEq3ADQqEQf",
    });
})();

export default class MainController {
    #theme_manager = new ThemeManager();
    #model;
    #view;

    constructor(model, view) {
        this.#model = model;
        this.#view = view;
        this.init();
    }    

    async init() {
        this.#view.bind_toggle_theme(this.toggle_theme.bind(this));
        this.#view.bind_event_hamburger_menu();
        this.#view.set_active_nav_button(this.nav_handler.bind(this));
        this.#view.display_user_profil(this.#model.get_user_profil());
        this.#view.display_projects(
            this.#model.get_projects(), 
            this.#model.get_logos()
        );
        this.#view.display_recommandations(this.#model.get_recommandations());
        this.#view.form_validation(this.form_handler.bind(this));
        this.#view.scroll_to_page('profil');
    }

    toggle_theme() {
        this.#theme_manager.toggle_theme();
    }

    nav_handler(section_name) {
        this.#view.scroll_to_page(section_name);
    }

    validate_form_data(form_data) {
        const errors = {};

        if (!form_data.name) {
            errors.name = 'Le nom est requis.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form_data.email)) {
            errors.email = 'Email invalide.';
        }

        if (!form_data.message) {
            errors.message = 'Le message est requis.';
        }

        return {
            is_valid: Object.keys(errors).length === 0,
            errors
        };
    }

    form_handler(templateParams) {
        const validation = this.validate_form_data(templateParams);
        this.#view.render_form_errors(validation.errors);

        if (!validation.is_valid) {
            return;
        }

        const current_datetime = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'long' }).format(new Date());
        const payload = {
            timestamp: current_datetime,
            ...templateParams
        };

        console.log('Form submitted with data:', payload);
        if (!emailjs) {
            console.log('EmailJS is not available.');
            return;
        }
        
        emailjs.send('service_phkqwy2', 'template_8hfaobv', payload)
        .then(() => {
            this.#view.render_message('Message envoyé avec succès.');
            console.log('SUCCESS!');
        }, (error) => {
            this.#view.render_message('Échec de l\'envoi du message. Veuillez réessayer.');
            console.log('FAILED...', error);
        });

    }


}
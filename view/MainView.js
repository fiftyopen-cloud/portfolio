export default class MainView {
    #root;
    #toggle_btn;
    
    constructor(root) {
        this.#root = root;
        document.addEventListener('mousemove', (event) => {
            document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
        });
    }

    bind_event_hamburger_menu() {
        const hamburgers = this.#root.querySelectorAll('.hamburger');
        const menu = this.#root.querySelector('nav ul');

        const close_menu = () => {
            menu.classList.remove('menu_mobile');
            hamburgers.forEach((item) => item.classList.remove('is-active'));
        };
        
        hamburgers.forEach(h => {
            h.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const is_open = menu.classList.toggle('menu_mobile');
                hamburgers.forEach((item) => {
                    item.classList.toggle('is-active', is_open);
                });
            });
        });

        document.addEventListener('click', (event) => {
            const target = event.target;
            const clicked_hamburger = target.closest('.hamburger');
            const clicked_menu = menu.contains(target);

            if (!menu.classList.contains('menu_mobile')) {
                return;
            }

            if (!clicked_hamburger && !clicked_menu) {
                close_menu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('menu_mobile')) {
                close_menu();
            }
        });
    }
    
    bind_toggle_theme(handler) {  
        let current_theme = localStorage.getItem('theme') || 'light';

        this.#root.querySelectorAll('div.header').forEach(header => {
            if (!header.querySelector('.toggle-theme-btn')) {
                const img = document.createElement('span');
                img.classList.add('material-symbols-outlined');
                img.classList.add('toggle-theme-btn');
                img.setAttribute('alt', 'Toggle light/dark theme');
                img.innerHTML = current_theme === 'dark' ? 'light_mode' : 'dark_mode';
                
                img.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (handler) handler();
                    img.innerHTML = img.innerHTML == 'dark_mode' ? 'dark_mode' : 'light_mode';
                    localStorage.setItem('theme', img.innerHTML == 'dark_mode' ? 'dark' : 'light');
                    this.bind_toggle_theme(handler); // Rebind to update the button state after theme change
                });
                    
                header.appendChild(img);
            } else {
                const existing_btn = header.querySelector('.toggle-theme-btn');
                existing_btn.innerHTML = current_theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        });
    }

    set_active_nav_button(handler) {
        this.#root.querySelectorAll('nav a').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                if (handler) handler(button.getAttribute('href').substring(1));

                const menu = this.#root.querySelector('nav ul');
                const hamburgers = this.#root.querySelectorAll('.hamburger');
                if (menu) {
                    menu.classList.remove('menu_mobile');
                }
                hamburgers.forEach((item) => item.classList.remove('is-active'));
            });
        });
    }

    scroll_to_page(section_name) {
        if (!section_name) {
            return;
        }

        const hash = `#${section_name}`;
        if (window.location.hash !== hash) {
            window.location.hash = hash;
        }
    }

    display_user_profil(profil) {
        const profil_div = this.#root.querySelector('.inner-container');
        profil_div.innerHTML = `
            <div class="presentation">
                <div class="title">
                    <h2>${profil.name}</h2>
                    <h6>${profil.title}</h6>
                </div>
                <p class="description">"${profil.description}"</p>
            </div>
            <img class="profile-photo" src="${profil.image}" alt="Photo de ${profil.name}">
        `;
    }

    display_projects(projects, logos) {
        const projects_container = this.#root.querySelector('.projects');
        projects_container.innerHTML = '';
       
        projects.forEach(project => {
            const project_item = this.create_project_item(project, logos);
            projects_container.innerHTML += project_item;
        });
    }

    create_project_item(project, logos) {
        let tech = project.technologies.map(tech => tech.toLowerCase());
        const stack = this.get_stack(tech, logos);
        
        return `
            <div class="project">
                <h3>${project.title}</h3>
                ${stack}
                <p class="description">${project.description}</p>
                <a href="${project.link}">Voir le projet</a>
            </div>`;
    }  

    get_stack(techs, logos) {
        const stack = document.createElement('span');
        techs.forEach(tech => {
            logos.forEach(logo => {
                if (logo.name.toLowerCase() === tech) {
                    let img = document.createElement('img');
                        img.classList.add('icon');
                        img.setAttribute('src', logo.symbol_path);
                        img.setAttribute('alt', `${tech} logo`);
                    stack.appendChild(img);
                }
            });
        });
        return stack.outerHTML;
    }

    display_recommandations(recommandations) {
        const recommandations_container = this.#root.querySelector('.recommandations');
        recommandations_container.innerHTML = '';
        recommandations.forEach(recommandation => {
            const recommandation_item = this.create_recommandation_item(recommandation);
            recommandations_container.appendChild(recommandation_item);
        });
    }

    create_recommandation_item(recommandation) {
        const recommandation_div = document.createElement('div');
        recommandation_div.classList.add('recommandation');
        recommandation_div.innerHTML = `
            <div class="title">
                <h2 class="name">${recommandation.name}</h2>
                <h6 class="position">${recommandation.position}</h6>
            </div>
            <p class="testimonial">"${recommandation.testimonial}"</p>
            <button class="demande_references">Demander mes références.</button>
        `;
        return recommandation_div;
    }

    form_validation(handler) {
        const form = this.#root.querySelector('#contact-form');
        const form_data = form.querySelector('div');
        const nameInput = form_data.querySelector('input[name="name"]');
        const emailInput = form_data.querySelector('input[name="email"]');
        const messageInput = form_data.querySelector('textarea[name="message"]');
    
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (handler) {
                handler({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                });
            }
        });
    }

    render_form_errors(errors = {}) {
        const fields = ['name', 'email', 'message'];
        fields.forEach((field) => {
            const container = this.#root.querySelector(`.${field}`);
            if (!container) {
                return;
            }
            const errorMessage = container.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = errors[field] || '';
            }
        });
    }
    
    render_message(message) {
        const errorMessage = this.#root.querySelector('#contact-form .form-message');
        errorMessage.textContent = message;
    }
}

export default class Recommandations {
    #recommandations = [];

    constructor(database) {
        this.#recommandations = database.get_data()?.recommandations || [];
     }

    get_recommandations() {
        return this.#recommandations;
    }

    get_recommandation_by_id(id) {
        return this.#recommandations.find(recommandation => recommandation.id === id);
    }

    async load_recommandations(file_path) {
        try {
            const response = await fetch(file_path);
            const data = await response.json();

            this.#recommandations = data.recommandations;
            
            return this.get_recommandations();
        } catch (error) {
            console.error('Error loading items:', error);
            return [];
        }
    }

}
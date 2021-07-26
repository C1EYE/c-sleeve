import {Http} from "../utils/http";

class Theme {
    static locationA = 't-1';
    static locationE = 't-2';
    static locationF = 't-3';
    static locationH = 't-4';
    themes = [];

    async getHomeLocationA() {
        return this.themes.find(t => t.name === Theme.locationA);
    }

    async getHomeLocationE() {
        return this.themes.find(t => t.name === Theme.locationE);
    }

    async getHomeLocationF() {
        return this.themes.find(t => t.name === Theme.locationF);
    }

    async getThemes() {
        const names = `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
        this.themes = await Http.request({
            url: `theme/by/names`,
            data: {
                names
            }
        })
    }

    static async getHomeLocationESpu() {
        return await Theme.getThemeSpuByName(Theme.locationE);
    }

    static async getThemeSpuByName(name) {
        return await Http.request({
            url: `theme/name/${name}/with_spu`
        })
    }
}

export {Theme};
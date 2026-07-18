import { normalizeFacedatLocale, translateFacedat } from "./index";

function unwrapLocale(locale) {
    return locale && typeof locale === "object" && "value" in locale ? locale.value : locale;
}

export default {
    props: {
        locale: {
            type: String,
            default: "",
        },
    },
    computed: {
        facedatLocale() {
            const hostLocale = unwrapLocale(this.$i18n?.locale);
            const documentLocale = typeof document === "undefined" ? "" : document.documentElement?.lang;
            return normalizeFacedatLocale(this.locale || hostLocale || documentLocale);
        },
    },
    methods: {
        fdT(key, params = {}, fallback = "") {
            if (this.$te?.(key)) return this.$t(key, params);
            return translateFacedat(this.facedatLocale, key, params, fallback);
        },
    },
};

import { useStore } from "@nanostores/vue";
import { $lang } from "../stores/configStore";
import { translations } from "./translations";
import { computed } from "vue";

/** Vue composable — returns reactive translations and current lang for use in 
 components. */
export const useI18n = () => {
  const lang = useStore($lang);
  const t = computed(() => translations[lang.value]);
  return { t, lang };
};
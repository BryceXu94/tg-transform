import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default function useBody() {
  const currentRoute = useRoute();
  const viewKey = computed(() => {
    return currentRoute.path || Date.now();
  });

  return {
    viewKey,
  };
}

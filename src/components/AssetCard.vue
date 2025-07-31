<script setup lang="ts">

export interface Asset {
  name: string;
  price: number;
  // add other properties if needed
}

const props = defineProps<Asset>();

</script>
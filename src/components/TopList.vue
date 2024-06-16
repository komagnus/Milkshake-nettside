<template>
    <v-row>
        <v-icon @click="showDialog = true" size="x-large">
            mdi-podium
        </v-icon>
        <v-dialog v-model="showDialog">
            <v-card style="display: flex; justify-content: center; width: 100%; align-items: center;">
                <v-card
                    style="display: flex; align-items: center; background-color: white; width: 60%; margin: 5%; justify-content: space-evenly;">
                    <img src="@/assets/1stplace.jpg" style="height:10vh" />
                    <h1 style="margin: 10px; color: black;">{{ capitalizeFirstLetter(topMilkshakes[0].name) }}</h1>
                    <h2 style="margin: 10px; color: black;">({{ topMilkshakes[0].rating }} / 10)</h2>
                </v-card>
                <v-card
                    style="display: flex; align-items: center; background-color: white; width: 60%; margin: 5%;  justify-content: space-evenly;">
                    <img src="@/assets/2ndplace.jpg" style="height:10vh" />
                    <h1 style="margin: 10px; color: black;">{{ capitalizeFirstLetter(topMilkshakes[1].name) }}</h1>
                    <h2 style="margin: 10px; color: black;">({{ topMilkshakes[1].rating }} / 10)</h2>

                </v-card>
                <v-card
                    style="display: flex; align-items: center; background-color: white; width: 60%; margin: 5%;  justify-content: space-evenly;">
                    <img src="@/assets/3rdplace.jpg" style="height:10vh" />
                    <h1 style="margin: 10px; color: black;">{{ capitalizeFirstLetter(topMilkshakes[2].name) }}</h1>
                    <h2 style="margin: 10px; color: black;">({{ topMilkshakes[2].rating }} / 10)</h2>
                </v-card>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { documents, getDocumentsFromDB } from '@/tools/apihandler';

const milkshakes = ref<documents[]>([]);
const showDialog = ref(false);

onMounted(async () => {
    const getmilkshakes = await getDocumentsFromDB();
    milkshakes.value = getmilkshakes.documents;
});

function capitalizeFirstLetter(name: string) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
}

const topMilkshakes = computed(() => {
    const testedMilkshakes = milkshakes.value.filter(shake => shake.tested);
    testedMilkshakes.sort((a, b) => b.rating - a.rating);
    return testedMilkshakes.slice(0, 3);
});
</script>

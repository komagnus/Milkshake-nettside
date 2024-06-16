<template>
    <v-container>
        <v-row style="display: flex; justify-content: center; align-items: center;">
            <TopList style="margin-left: 30px;" />
            <div style="display: flex; justify-content: center; align-items: center;">
                <h3>Alle:</h3>
                <v-checkbox v-model="showAll" @change="handleCheckboxChange('showAll')"></v-checkbox>
                <h3>De vi har prøvd:</h3>
                <v-checkbox v-model="showTested" @change="handleCheckboxChange('showTested')"></v-checkbox>
                <h3>De vi ikke har prøvd:</h3>
                <v-checkbox v-model="showMissing" @change="handleCheckboxChange('showMissing')"></v-checkbox>
            </div>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6" v-for="(shake, index) in filteredMilkshakes" :key="shake.name">
                <v-card
                    style="background-color: white; margin: 1%; width: 100%; height: 100%; min-height: 40vh; display: flex; align-items: center; flex-direction: column; gap: 10px;">
                    <v-img :src="imgUrls[index]" style="width: 80%; max-height: 20vh;" />
                    <h2 style="color: black">{{ capitalizeFirstLetter(shake.name) }}</h2>
                    <v-checkbox v-if="!shake.tested" @click="update(shake.name, shake.rating, true)"
                        style="color: red; height: 60px;" v-model="shake.tested"></v-checkbox>
                    <img v-else src="@/assets/check.jpg" style="height: 60px;" alt="img" />
                    <div style="display: flex; color: black; align-items: center;">
                        <h1 style="margin: 10px;"> {{ shake.rating }}</h1>
                        <div style="display: flex; flex-direction: column;">
                            <v-icon @click="increaseRating(shake)" size="large">
                                mdi-plus-box
                            </v-icon>
                            <v-icon @click="decreaseRating(shake)" size="large">
                                mdi-minus-box
                            </v-icon>
                        </div>
                    </div>
                    <h3 style="margin: 10px;color: black;">Rating</h3>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { documents, getDocumentsFromDB, updateDocument } from '@/tools/apihandler';

const milkshakes = ref<documents[]>([]);
const imgUrls = ref<any[]>([]);
const showAll = ref(true);
const showMissing = ref(false);
const showTested = ref(false);

onMounted(async () => {
    const getmilkshakes = await getDocumentsFromDB();
    milkshakes.value = getmilkshakes.documents;
    loadImages(milkshakes.value);
});

async function loadImages(list: documents[]) {
    imgUrls.value = await Promise.all(
        list.map(async shake => {
            const image = await import(`@/assets/${shake.name}.jpg`);
            return image.default;
        })
    );
}

const filteredMilkshakes = computed(() => {
    if (showAll.value) {
        loadImages(milkshakes.value)
        return milkshakes.value;
    } else if (showTested.value) {
        const newValues = milkshakes.value.filter(item => item.tested === true)
        loadImages(newValues)
        return newValues
    } else if (showMissing.value) {
        const newValues = milkshakes.value.filter(item => item.tested === false)
        loadImages(newValues)
        return newValues

    }
});

function capitalizeFirstLetter(name: string) {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function increaseRating(shake: documents) {
    update(shake.name, shake.rating + 1, shake.tested);
    shake.rating += 1;
}

function decreaseRating(shake: documents) {
    update(shake.name, shake.rating - 1, shake.tested);
    shake.rating -= 1;
}

async function update(documentName: string, rating: number, tested: boolean) {
    await updateDocument('leora', documentName, rating, tested);
}

function handleCheckboxChange(checkbox: string) {
    // Update checkboxes to behave like radio buttons
    if (checkbox === 'showAll') {
        showTested.value = false;
        showMissing.value = false;
    } else if (checkbox === 'showTested') {
        showAll.value = false;
        showMissing.value = false;
    } else if (checkbox === 'showMissing') {
        showAll.value = false;
        showTested.value = false;
    }
}
</script>

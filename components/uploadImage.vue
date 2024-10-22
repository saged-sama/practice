<template>
    <label class="w-full md:w-1/2">
        <input type="file" :name="name" multiple hidden accept="image/*" @change="handleFileUpload">
        <div class="flex items-center justify-center w-full h-40 border rounded-md cursor-pointer">
            <h1>Select files to upload</h1>
        </div>
    </label>

    <div class="grid grid-cols-3 gap-2">
        <div v-for="(image, index) in images" :key="index" class="relative rounded-md">
            <img :src="image.src" class="w-full h-40 object-cover rounded-md" />
            <button @click="removeImage(index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                <LucideX class="w-5 h-5" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    interface Image {
        src: string;
        blob: Blob;
    }
    const props = defineProps({
        name: String
    });
    const images = ref<Image[]>([]);

    const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            for (let i = 0; i < target.files.length; i++) {
                const file = target.files[i];
                const reader = new FileReader();
                reader.onload = () => {
                    images.value.push({
                        src: reader.result as string,
                        blob: file
                    });
                }
                reader.readAsDataURL(file);
            }
        }
    }

    const removeImage = (index: number) => {
        images.value.splice(index, 1);
    }

</script>
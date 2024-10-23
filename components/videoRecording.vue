<template>
    <label class="w-full md:w-1/2">
        <input type="file" :name="name" capture="environment" hidden accept="video/*" @change="handleFileUpload">
        <div class="flex items-center justify-center w-full h-40 border rounded-md cursor-pointer">
            <h1 class="flex flex-col items-center gap-2"><span>Record a Video</span> <LucideVideo /> </h1>
        </div>
    </label>

    <div class="grid grid-cols-3 gap-2">
        <div v-for="(video, index) in videos" :key="index" class="relative rounded-md">
            <video :src="video.src" class="w-full h-40 object-cover rounded-md"></video>
            <button @click="removeImage(index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                <LucideX class="w-5 h-5" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

    interface Video {
        src: string;
        blob: Blob;
    }   

    const videos = ref<Video[]>([]);

    const props = defineProps({
        name: String
    });

    const handleFileUpload = (event: any) => {
        if(videos.value.length >= 3) {
            return;
        }
        const target = event.target as HTMLInputElement;
        if (target.files) {
            for (let i = 0; i < 3; i++) {
                const file = target.files[i];
                const reader = new FileReader();
                reader.onload = () => {
                    videos.value.push({
                        src: reader.result as string,
                        blob: file
                    });
                }
                reader.readAsDataURL(file);
            }
        }
    }

    const removeImage = (index: number) => {
        videos.value.splice(index, 1);
    }

</script>
<template>
    <div class="relative flex flex-col gap-3 items-center w-1/2 h-auto">
        <video ref="videoElement" autoplay class="rounded-md bg-black w-full"></video>
        <div class="absolute bottom-2 w-full flex items-center justify-center gap-3">
            <button class="text-white" @click="capturePhoto">
                <LucideDisc class="w-10 h-10" fill="white" />
            </button>
        </div>
        <input type="file" accept="image/*" :name="name" hidden multiple ref="inputElement" />
    </div>
    
    <div class="grid grid-cols-3 gap-2">
        <div v-for="(image, index) in images" :key="index" class="relative rounded-md">
            <img :src="image.src" class="w-full h-40 object-cover rounded-md" />
            <button @click="removeImage(index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                <LucideX class="w-5 h-5" />
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>

    interface Image {
        src: string;
        blob: Blob;
    }

    const videoElement = ref<HTMLVideoElement | null>(null);
    const inputElement = ref<HTMLInputElement | null>(null);
    let stream: MediaStream | null = null;
    let images = ref<Image[]>([]);

    const props = defineProps({
        name: String
    });

    onMounted(async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoElement.value) {
                videoElement.value.srcObject = stream;
                videoElement.value.play();
            }
        } catch (err) {
            console.error('Error accessing the camera:', err);
        }
    });

    const capturePhoto = () => {
        if(images.value.length >= 3) {
            return;
        }
        if (videoElement.value) {
            const canvas = document.createElement('canvas');
            canvas.hidden = true;
            canvas.width = videoElement.value.videoWidth;
            canvas.height = videoElement.value.videoHeight;
            canvas.getContext('2d')!.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    images.value.push({
                        src: URL.createObjectURL(blob),
                        blob: blob
                    });
                    updateInputFiles();
                }
            });
            
            canvas.remove();
        }
    };

    const updateInputFiles = () => {
        if (inputElement.value) {
            const dataTransfer = new DataTransfer();
            images.value.forEach((image, index) => {
                const file = new File([image.blob], `photo${index}.png`, { type: 'image/png' });
                dataTransfer.items.add(file);
            });
            inputElement.value.files = dataTransfer.files;
        }
    };

    const removeImage = (index: number) => {
        images.value.splice(index, 1);
        updateInputFiles();
    };
</script>

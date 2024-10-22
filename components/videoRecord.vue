<template>
    <div class="relative flex flex-col gap-3 items-center w-1/2 h-auto">
        <video ref="videoElement" autoplay muted class="rounded-md bg-black w-full"></video>
        <div class="absolute bottom-2 w-full flex items-center justify-center gap-3">
            <button class="text-white" @click="toggleRecording">
                <LucideDisc class="w-10 h-10" :fill="isRecording ? 'red' : 'white'" />
            </button>
        </div>
        <span v-if="isRecording" class="absolute top-2 right-4 flex items-center gap-2 text-white font-bold "> <LucideCircle class="w-3 h-3" fill="red"/> Recording</span>
        <input type="file" accept="video/*" :name="name" hidden multiple ref="inputElement" />
    </div>

    <div class="grid grid-cols-3 gap-2">
        <div v-for="(video, index) in videos" :key="index" class="relative rounded-md">
            <video :src="video.src" controls class="w-full h-40 object-cover rounded-md"></video>
            <button @click="removeVideo(index)" class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                <LucideX class="w-5 h-5" />
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>

    interface Video {
        src: string;
        blob: Blob;
    }

    const videoElement = ref<HTMLVideoElement | null>(null);
    const inputElement = ref<HTMLInputElement | null>(null);
    let stream: MediaStream | null = null;
    let mediaRecorder: MediaRecorder | null = null;
    let recordedChunks: Blob[] = [];
    let videos = ref<Video[]>([]);
    const isRecording = ref(false);

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

    const toggleRecording = () => {
        if (isRecording.value) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        if (!stream) return;

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(blob);
            videos.value.push({ src: videoURL, blob });
            updateInputFiles();
            recordedChunks = [];
        };

        mediaRecorder.start();
        isRecording.value = true;
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            isRecording.value = false;
        }
    };

    const updateInputFiles = () => {
        if (inputElement.value) {
            const dataTransfer = new DataTransfer();
            videos.value.forEach((video, index) => {
                const file = new File([video.blob], `video${index}.webm`, { type: 'video/webm' });
                dataTransfer.items.add(file);
            });
            inputElement.value.files = dataTransfer.files;
        }
    };

    const removeVideo = (index: number) => {
        videos.value.splice(index, 1);
        updateInputFiles();
    };
</script>

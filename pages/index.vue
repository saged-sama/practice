<template>
    <form ref="form" @submit="handleFormSubmit" class="flex flex-col items-center gap-10 p-3 md:p-10 w-full max-md:h-full">
        <div class="flex flex-col items-center gap-2 p-3 md:p-10 w-full max-md:h-full">
            <h1>কোনো প্রমানাদি থাকলে তা সংযুক্ত করুন (সর্বোচ্চ ৩টি, ৫০ মেগাবাইটের মধ্যে)</h1>

            <UploadImage v-if="mode === 'upload'" name="uploads"/>
            <ImageCapture v-if="mode === 'photo'" name="capturedImages"/>
            <VideoRecording v-if="mode === 'video'" name="recordedVideos"/>

            <div class="flex items-center gap-3">
                <button @click="() => {
                    switchMode('upload');
                }"> <LucideImage :class="{
                    'text-blue-500': mode === 'upload',
                    '': mode !== 'upload'
                }"/> </button>
                <button @click="() => {
                    switchMode('photo');
                }"> <LucideCamera :class="{
                    'text-blue-500': mode === 'photo',
                    '': mode !== 'photo'
                }"/> </button>
                <button @click="() => {
                    switchMode('video');
                }"> <LucideVideo :class="{
                    'text-blue-500': mode === 'video',
                    '': mode !== 'video'
                }"/> </button>
            </div>
        </div>
        <button type="submit" class="p-3 px-5 bg-green-300 rounded-md">Submit</button>
    </form>
</template>


<script lang="ts" setup>
    let mode = ref("upload");
    const form = ref<HTMLFormElement | null>(null);

    const switchMode = (newMode: string) => {
        mode.value = newMode;
    }

    const handleFormSubmit = (event: any) => {
        event.preventDefault();
        if(form.value) {
            const formData = new FormData(form.value);
            console.log(formData.getAll('uploads'));
            console.log(formData.getAll('capturedImages'));
            console.log(formData.getAll('recordedVideos'));
        }
    }

</script>
<template>
    <div class="main-scope pa-3 ml-4">
        <div class="admin-fingerprint">
            <!-- Place the admin fingerprint for authentication -->
            <v-img @click="$router.push('/admin-signature')" class="admin-fingerprint-img"
                src="/src/assets/images/fingerprint.png"></v-img>
            <small class="admnin-signature">
                Admin's space
            </small>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'MoreView',
    setup() {
        return {};
    }
};
</script>

<style scoped>
.admin-fingerprint-img {
    position: fixed;
    bottom: 45px;
    left: 33px;
    width: 50px;
    height: 50px;
    z-index: 1000;
    cursor: pointer;
    border-radius: 50%;
    opacity: 0.3;
}

.admin-fingerprint-img:hover {
    opacity: 0.5;
    box-shadow: 0px 0px 500px 50000px #3b3b3b;
    transition: 0.5s;
    transform: scale(.5.1);
    border-radius: 50%;
    background-color: lightskyblue !important;
    /* border: 1px solid #a8a7a78a; */
}

.admnin-signature {
    position: fixed;
    bottom: -40px;
    left: 20px;
    width: 120px;
    height: 80px;
    z-index: 1000;
    /* cursor: grab; */
    /* border-radius: 50%; */
    opacity: 0.3;
}
</style>

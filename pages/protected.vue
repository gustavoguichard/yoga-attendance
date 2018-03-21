<template>
  <main class="protected">
    <h1>Protected</h1>
    <p>This is the private part of your application, the one available only to logged in users.</p>
  </main>
</template>

<script>
export default {
  middleware: 'check-auth',
};
</script>

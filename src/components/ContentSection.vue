<template functional>
  <section class="mb-5">
    <div :class="$style['header']">
      <h2 class="mb-2" :class="$style['title']">
        <slot name="section-header"></slot>
      </h2>

      <slot name="section-header-right"></slot>
    </div>
    <slot name="section-content"></slot>
  </section>
</template>

<style lang="scss" module>
.title {
  font-size: 3rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

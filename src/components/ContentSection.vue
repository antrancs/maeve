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
  font-size: 2.7rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: $md-breakpoint - 1) {
  .title {
    font-size: 2.2rem;
  }
}
</style>

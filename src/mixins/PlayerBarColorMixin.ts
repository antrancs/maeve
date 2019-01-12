import { Component, Vue } from 'vue-property-decorator';

import {
  isLight,
  TEXT_PRIMARY_DARK,
  TEXT_PRIMARY_LIGHT,
  TEXT_SECONDARY_LIGHT,
  TEXT_SECONDARY_DARK
} from './../themes';

@Component
export default class PlayerBarColorMixin extends Vue {
  get isLight(): boolean {
    return isLight(this.$vuetify.theme.secondary as string);
  }

  get primaryColor() {
    return this.isLight ? TEXT_PRIMARY_LIGHT : TEXT_PRIMARY_DARK;
  }

  get primaryStyle() {
    return {
      color: this.primaryColor
    };
  }

  get secondaryTextStyle() {
    return {
      color: this.isLight ? TEXT_SECONDARY_LIGHT : TEXT_SECONDARY_DARK
    };
  }
}

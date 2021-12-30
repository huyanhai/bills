<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.phone" size="large" placeholder="">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input v-model="formData.pass" size="large" :type="showPsw ? 'text' : 'password'" clearable placeholder="">
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录 </t-button>
    </t-form-item>
  </t-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { MessagePlugin } from 'tdesign-vue-next';

const INITIAL_DATA = {
  phone: '',
  pass: '',
};

const FORM_RULES = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  pass: [{ required: true, message: '密码必填', type: 'error' }],
};

export default defineComponent({
  components: {},
  setup() {
    const type = ref('password');

    const formData = ref({ ...INITIAL_DATA });
    const showPsw = ref(false);

    const router = useRouter();
    const store = useStore();

    const onSubmit = async ({ validateResult }) => {
      if (validateResult === true) {
        try {
          await store.dispatch('user/login', formData.value);
          MessagePlugin.success('登陆成功');
          router.push({
            path: '/dashboard/waiting',
          });
        } catch (e) {
          MessagePlugin.error(e.msg);
        }
      }
    };

    return {
      FORM_RULES,
      formData,
      showPsw,
      type,
      onSubmit,
    };
  },
});
</script>

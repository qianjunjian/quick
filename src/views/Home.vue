<template>
  <div class="page-full">
    <Header></Header>
    <div class="body">
      <Left></Left>
      <LeftBoard></LeftBoard>
      <div class="content"></div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../components/header/header.vue';
import Left from '../components/left/left.vue';
import LeftBoard from '../components/leftBoard/leftBoard.vue';
import Footer from '../components/footer/footer.vue';
export default {
  name: 'Home',
  components: {
    Header,
    Left,
    Footer,
    LeftBoard
  },
  setup() {
  }
};
</script>

<style scoped lang="less">
.page-full {
  position: absolute;
  left: 0;
  right: 0;
  top: 2px;
  bottom: 0;
  background-color: #1e1e1e;

  .body {
    position: absolute;
    top: 29px;
    left: 0;
    right: 0;
    bottom: 19px;
    display: flex;

    .content {
      flex: 1;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
